from time import sleep

import openai
import yaml
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel

from app.config import logger, settings

# Check available engines at https://platform.openai.com/docs/models/overview
default_model = "gpt-3.5-turbo"
model_list = [
    "gpt-3.5-turbo",
    "text-davinci-003",
    "code-davinci-002"
]
# Handle differently request for chat models
chat_models = [
    "gpt-3.5-turbo",
]
NUM_RETRIES = 3

default_prompt = """From the text below, extract the entities, classify them and extract associations between those entities
Entities to extract should be of one of those types: "Chemical Entity", "Disease", "Gene", "Gene Product", "Organism Taxon"

Return the results as a YAML object with the following fields:
- entities: <the list of entities in the text, each entity is an object with the fields: label, type>
- associations: <the list of associations between entities in the text, each association is an object with the fields: "subject" for the subject entity, "predicate" for the relation (treats, affects, interacts with, causes, caused by, has evidence), "object" for the object entity>
"""

openai.api_key = settings.OPENAI_APIKEY
router = APIRouter()


class NerInput(BaseModel):
    text: str = "Divalproex sodium delayed-release capsules are indicated as monotherapy and adjunctive therapy in the treatment of adult patients and pediatric patients down to the age of 10 years with complex partial seizures that occur either in isolation or in association with other types of seizures."


@router.post(
    "/openai-extract",
    name="Extract entities and relations from text using OpenAI models",
    description=f"""Extract entities and relations from text using OpenAI models, engines available are {' ,'.join(model_list)}""",
    response_description="Entities and relations extracted from the given text",
    response_model={},
)
def get_entities_relations_openai(
    input: NerInput = Body(...),
    prompt: str = default_prompt,
    model: str = default_model,
    # current_user: User = Depends(get_current_user),
):
    # if not current_user or "id" not in current_user.keys():
    #     raise HTTPException(
    #         status_code=403,
    #         detail=f"You need to login with ORCID to publish a Nanopublication",
    #     )
    if model not in model_list:
        raise HTTPException(
            status_code=400,
            detail=f"The provided engine {model} does not exist, please use on of {' ,'.join(model_list)}",
        )

    prompt = f"""{prompt}

Text:
\""""
    i = 0
    response = None
    while not response:
        i += 1
        logger.debug(f"Calling OpenAI API (attempt {i})...")
        print(f"Calling OpenAI API (attempt {i})...")
        send_prompt = prompt + input.text + '"'
        try:
            if model in chat_models:
                response = openai.ChatCompletion.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": "Act like you are a biomedical expert working to extract entities and relations from biomedical text. Return the results as pure YAML, without codeblocks tags"},
                        {"role": "user", "content": send_prompt}
                    ]
                    # max_tokens=5000,
                )
            else:
                response = openai.Completion.create(
                    model=model,
                    prompt=send_prompt,
                    max_tokens=5000,
                )
        except Exception as e:
            logger.error(f"OpenAI API connection error: {e}")
            if i >= NUM_RETRIES:
                raise e
            sleep_time = 4**i
            logger.info(f"Retrying {i} of {NUM_RETRIES} after {sleep_time} seconds...")
            sleep(sleep_time)
        logger.debug(response)
        print(response)

    text_resp = response.choices[0].message.content if model in chat_models else response.choices[0].text

    if text_resp.startswith("```yaml\n"):
        text_resp = text_resp[8:]
    if text_resp.startswith("```\n"):
        text_resp = text_resp[4:]
    if text_resp.endswith("```"):
        text_resp = text_resp[0:-3]


    openai_resp = yaml.load(text_resp, Loader=yaml.Loader)
    return openai_resp


# prompt used by OntoGPT = """From the text below, extract the following entities in the following format:

# genes: <semicolon separated list of genes that catalyzes the mentioned reactions>
# reactions: <semicolon separated list of reaction equations (e.g. A+B = C+D) catalyzed by the gene>
# gene_reaction_pairings: <semicolon separated list of gene to reaction pairings>
# organism: <the value for organism>

# Text:
# """
