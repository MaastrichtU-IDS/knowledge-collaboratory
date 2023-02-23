from typing import Optional
from time import sleep
import json

import openai
import yaml
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import BertForSequenceClassification, BertTokenizer
# from ontogpt.engines.spires_engine import SPIRESEngine
# from oaklib.utilities.apikey_manager import set_apikey_value

from app.config import biolink_context, settings, logger

router = APIRouter()


class NerInput(BaseModel):
    text: str = "Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication."


openai.api_key = settings.OPENAI_APIKEY
engine = "text-davinci-003"
# engine = "code-davinci-002"
NUM_RETRIES = 3

@router.post(
    "/openai-extract",
    name="Extract entities and relations from text using OpenAI models",
    description="""Get biomedical entities and relations from text""",
    response_description="Entities and relations extracted from the given text",
    response_model={},
)
async def get_entities_relations_openai(
    input: NerInput = Body(...)
):
#     prompt = """From the text below, extract the following entities in the following format:

# genes: <semicolon separated list of genes that catalyzes the mentioned reactions>
# reactions: <semicolon separated list of reaction equations (e.g. A+B = C+D) catalyzed by the gene>
# gene_reaction_pairings: <semicolon separated list of gene to reaction pairings>
# organism: <the value for organism>

# Text:
# """
# (make sure the keys are enclosed with double quotes and the content is utf-8 encoded)
    prompt = """
From the text below, extract the entities, classify them and extract associations between those entities
Entities to extract should be of one of those types: ChemicalEntity, Disease, Gene, GeneProduct, Taxon

Return the results as a YAML object with the following fields:
- entities: <the list of entities in the text, each entity is a JSON object with the fields: label, type of the entity>
- associations: <the list of associations between entities in the text, each association is a JSON object with the fields: "subject" for the subject entity, "predicate" for the relation (e.g. treats, affects, interacts_with, causes, supported_by), "object" for the object entity>

Text:
\""""
    i = 0
    response = None
    while not response:
        i += 1
        logger.debug(f"Calling OpenAI API (attempt {i})...")
        try:
            response = openai.Completion.create(
                engine=engine,
                prompt=prompt + input.text + "\"",
                max_tokens=3000,
            )
        except Exception as e:
            logger.error(f"OpenAI API connection error: {e}")
            if i >= NUM_RETRIES:
                raise e
            sleep_time = 4**i
            logger.info(f"Retrying {i} of {NUM_RETRIES} after {sleep_time} seconds...")
            sleep(sleep_time)
        print(response)

    # openai_resp = json.loads(response.choices[0].text)
    openai_resp = yaml.load(response.choices[0].text, Loader=yaml.Loader)
    return openai_resp
