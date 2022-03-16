from fastapi import FastAPI, Response, APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
# from typing import Collection, List, Optional
# from typing import List, Optional

from app.config import settings

import spacy
import requests

router = APIRouter()

# BASE = Namespace("https://w3id.org/collaboratory/")

class NerInput(BaseModel):
    text: str = 'Delayed institution of hypertension during focal cerebral ischemia: effect on brain edema.'

# oc rsync --progress xiao-gpu-jupyterlab-1-54vlm:/workspace/notebooks/Litcoin/part1/ner_demo/training/litcoin-ner-model.zip ./

@router.post("/get-entities-relations", name="Get entities and relations from text",
    description="""Get biomedical entities and relations from text""",
    response_description="Entities and relations extracted from the given text", 
    response_model={})
async def get_entities_relations(
        input: NerInput = Body(...),
    ):

    # Save and load a model/pipeline: https://spacy.io/usage/saving-loading

    ner = spacy.load(Rf"{settings.NER_MODELS_PATH}/litcoin-ner-model")
    # ner = spacy.load(Rf"{settings.NER_MODELS_PATH}/model-best", exclude=['vocab'])
    # ner = spacy.load(Rf"/data/ner-models/litcoin-ner-model")

    ner_res = ner(input.text)

    entities_extracted= []
    for ent in ner_res.ents:
        # print(ent.text, ent.start_char, ent.end_char, ent.label_)
        entity = {
            'text': ent.text,
            'type': ent.label_, 
            'start': ent.start_char,
            'end': ent.end_char
        }

        name_res = requests.post(f"https://name-resolution-sri.renci.org/lookup?string={ent.text}&offset=0&limit=5").json()
        if len(name_res.keys()) > 0:
            entity['curies'] = name_res
        # for pref_curie, labels in name_res.items():
        #     entity['curie'] = pref_curie
        entities_extracted.append(entity)

    return JSONResponse(entities_extracted)



# import numpy as np
# import torch
# from transformers import BertTokenizer, BertForSequenceClassification

# label2id = {
#     'Association': 0,
#     'Positive_Correlation': 1,
#     'Negative_Correlation': 2,
#     'Bind': 3,
#     'Cotreatment': 4,
#     'Comparison':5,
#     'Drug_Interaction':6,
#     'Conversion':7,
#     'Negative':8
#       }

# id2label = {}
# for key,value in label2id.items():
#     id2label[value] = key

# def classify_relation(sentence, entity1, entity2):
#     tokenizer = BertTokenizer.from_pretrained(model_fname, do_lower_case=False)
#     model = BertForSequenceClassification.from_pretrained(model_fname,num_labels=len(label2id))
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     # send model to device
#     model.to(device);


#     text = sentence + str('[SEP]') + entity1 + str('[SEP]') + entity2]
#     input_ids = torch.tensor(tokenizer.encode(text, 
#                                             add_special_tokens=True,
#                                             max_length=128)).unsqueeze(0)  # Batch size 1
#     labels = torch.tensor([1]).unsqueeze(0)  # Batch size 1

#     input_ids= input_ids.to(device) 
#     labels= labels.to(device)
#     with torch.no_grad():
#         outputs = model(input_ids, labels=labels)
#     logits = outputs[1]
#     result = np.argmax(logits.cpu().numpy(),axis=1)[0]
    
#     label = id2label[result]

#     return label