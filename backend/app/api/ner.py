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

# BASE = Namespace("https://w3id.org/collaboratory/")

class NerInput(BaseModel):
    text: str = 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.'
    # text: str = 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease which may follow injury to the nervous system by carbon monoxide intoxication.'

# oc rsync --progress xiao-gpu-jupyterlab-1-54vlm:/workspace/notebooks/Litcoin/part1/ner_demo/training/litcoin-ner-model.zip ./

@router.post("/get-entities-relations", name="Get entities and relations from text",
    description="""Get biomedical entities and relations from text""",
    response_description="Entities and relations extracted from the given text", 
    response_model={})
async def get_entities_relations(
        input: NerInput = Body(...),
        extract_relations: Optional[bool] = False
    ):

    # Save and load a model/pipeline: https://spacy.io/usage/saving-loading

    ner = spacy.load(Rf"{settings.NER_MODELS_PATH}/litcoin-ner-model")
    # ner = spacy.load(Rf"{settings.NER_MODELS_PATH}/model-best", exclude=['vocab'])
    # ner = spacy.load(Rf"/data/ner-models/litcoin-ner-model")

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

        # Extract relations fromeach entity pairing
        # Instantiate the Bert tokenizer
        relation_model = Rf"{settings.NER_MODELS_PATH}/litcoin-relations-extraction-model"
        tokenizer = BertTokenizer.from_pretrained(relation_model, do_lower_case=False)
        model = BertForSequenceClassification.from_pretrained(relation_model,num_labels=len(label2id))
        device = torch.device("cpu")
        # Send model to device
        model.to(device);
        relations_extracted = []
        for rel in relations_list:
            extracted_rel = classify_relation(rel, device, tokenizer, model)
            if extracted_rel:
                relations_extracted.append(extracted_rel)

        print(f"⛏️  Extracted {len(entities_extracted)} entities and {len(relations_extracted)} relations")

        return JSONResponse({'entities': entities_extracted, 'relations': relations_extracted})

    return JSONResponse({'entities': entities_extracted})


# Functions used for relations extraction:
label2id = {
    'Association': 0,
    'Positive_Correlation': 1,
    'Negative_Correlation': 2,
    'Bind': 3,
    'Cotreatment': 4,
    'Comparison':5,
    'Drug_Interaction':6,
    'Conversion':7,
    'Negative':8
}

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