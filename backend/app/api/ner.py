from fastapi import FastAPI, Response, APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
# from typing import Collection, List, Optional
from typing import List, Optional

from app.config import settings

import spacy
import requests
import numpy as np
import torch
from transformers import BertTokenizer, BertForSequenceClassification


router = APIRouter()

label2id = {
    'associated_with': 0, # Association
    'positively_correlated_with': 1, # Positive_Correlation
    'negatively_correlated_with': 2, # Negative_Correlation
    'interacts_with': 3, # Bind
    'treats': 4, # Cotreatment
    'related_to':5, # Comparison
    'chemically_interacts_with':6, # Drug_Interaction
    'develops_into':7, # Conversion
    'Negative':8 
}

# Loading models for NER
ner = spacy.load(Rf"{settings.NER_MODELS_PATH}/litcoin-ner-model")
# Loading models for relations extraction
relation_model = Rf"{settings.NER_MODELS_PATH}/litcoin-relations-extraction-model"
# Instantiate the Bert tokenizer
tokenizer = BertTokenizer.from_pretrained(relation_model, do_lower_case=False)
model = BertForSequenceClassification.from_pretrained(relation_model,num_labels=len(label2id))
device = torch.device("cpu")
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# Send model to device
model.to(device);
print('✅ Models for NER and relations extraction loaded')

class NerInput(BaseModel):
    text: str = 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.'

# Copy large models from the DSRI:
# oc rsync --progress xiao-gpu-jupyterlab-1-54vlm:/workspace/notebooks/Litcoin/part1/ner_demo/training/litcoin-ner-model.zip ./

@router.post("/get-entities-relations", name="Get entities and relations from text",
    description="""Get biomedical entities and relations from text""",
    response_description="Entities and relations extracted from the given text", 
    response_model={})
async def get_entities_relations(
        input: NerInput = Body(...),
        extract_relations: Optional[bool] = True
    ):
    ner_res = ner(input.text)

    entities_extracted= []
    # Extract entities
    for ent in ner_res.ents:
        # print(ent.text, ent.start_char, ent.end_char, ent.label_)
        entity = {
            'text': ent.text,
            'type': ent.label_, 
            'start': ent.start_char,
            'end': ent.end_char
        }
        # Get preferred ID for the entities label for the NameResolution API
        name_res = requests.post(f"https://name-resolution-sri.renci.org/lookup?string={ent.text}&offset=0&limit=5").json()
        if len(name_res.keys()) > 0:
            entity['curies'] = name_res
        # else:
            # Get RXCUIS: https://rxnav.nlm.nih.gov/REST/rxcui.json?name=Xyrem
            # Get other ID, such as UMLS or MESH for RXCUIS: https://rxnav.nlm.nih.gov/REST/rxcui/353098/proprietary.json

        # for pref_curie, labels in name_res.items():
        #     entity['curie'] = pref_curie
        entities_extracted.append(entity)

    if extract_relations:
        # Generate entities pairing to check if relations between them
        relations_list = []
        for ent in entities_extracted:
            for ent2 in entities_extracted:
                if ent['text'] != ent2['text']:
                    relations_list.append({
                        'sentence': input.text,
                        'entity1': ent['text'],
                        'entity2': ent2['text']
                    })

        # Extract relations from each entity pairing
        relations_extracted = []
        for rel in relations_list:
            extracted_rel = classify_relation(rel, device, tokenizer, model)
            if extracted_rel:
                relations_extracted.append(extracted_rel)

        stmts = []
        ido = 'https://identifiers.org/'
        for rel in relations_extracted:
            # Get the first ID match for each entity
            ent1_id = rel['entity1']
            ent2_id = rel['entity2']
            for ent in entities_extracted:
                if 'curies' in ent.keys():
                    # Take the first ID returned by the NCATS API
                    if ent['text'] == rel['entity1']:
                        ent1_id = list(ent['curies'].keys())[0]
                    if ent['text'] == rel['entity2']:
                        ent2_id = list(ent['curies'].keys())[0]
            stmt = {
                's': {'id': ido + ent1_id, 'curie': ent1_id, 'label': rel['entity1']},
                'p': {'id': 'https://w3id.org/biolink/vocab/' + rel['type'], 'curie': 'biolink:' + rel['type'], 'label': rel['type'].replace('_', ' ')},
                'o': {'id': ido + ent2_id, 'curie': ent2_id, 'label': rel['entity2']},
            }
            stmts.append(stmt)

        print(f"⛏️  Extracted {len(entities_extracted)} entities and {len(relations_extracted)} relations classified in {len(stmts)} statements")

        return JSONResponse({
            'entities': entities_extracted, 
            'relations': relations_extracted,
            'statements': stmts,
        })

    return JSONResponse({'entities': entities_extracted})


# Functions used for relations extraction:
id2label = {}
for key,value in label2id.items():
    id2label[value] = key

def classify_relation(rel, device, tokenizer, model):
    sentence = rel['sentence']
    entity1 = rel['entity1']
    entity2 = rel['entity2']
    text = sentence + str('[SEP]') + entity1 + str('[SEP]') + entity2
    input_ids = torch.tensor(tokenizer.encode(text, 
                                            add_special_tokens=True,
                                            max_length=128)).unsqueeze(0)  # Batch size 1
    labels = torch.tensor([1]).unsqueeze(0)  # Batch size 1

    input_ids= input_ids.to(device) 
    labels= labels.to(device)
    with torch.no_grad():
        outputs = model(input_ids, labels=labels)
    logits = outputs[1]
    result = np.argmax(logits.cpu().numpy(),axis=1)[0]
    
    label = id2label[result]

    if label == 'Negative':
        return None
    rel['type'] = label
    return rel