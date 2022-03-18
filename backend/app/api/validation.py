from fastapi import FastAPI, Response, APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
# from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
# from typing import Collection, List, Optional
from typing import List, Optional

from app.config import settings

import spacy
import requests
from rdflib import URIRef, Graph
from rdflib.namespace import RDF, DC, DCTERMS, RDFS
# from pyshex import ShExEvaluator


router = APIRouter()

@router.post("/validation/shex", name="Validate RDF with ShEx shapes",
    description="""Validate RDF with ShEx shapes""",
    response_description="Result of the ShEx execution", 
    response_model={})
async def validation_shex(
        rdf_input: str = Body(...),
        shape_start: str = 'https://w3id.org/biolink/vocab/Association',
        focus_types: List[str] = ['https://w3id.org/biolink/vocab/Association'],
        # shapemap: str = '{ FOCUS rdf:type <https://w3id.org/biolink/vocab/Association> }@<https://w3id.org/biolink/vocab/Association>',
        shape_url: str = 'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex'
    ):

    # if shape_url == 'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex':
    shex_shape = requests.get(shape_url).text

    g = Graph()
    g.parse(
        data=rdf_input, 
        # format='json-ld'
    )

    # evaluator = ShExEvaluator(g.serialize(format='turtle'), shex_shape,
    #     start=shape_start,
    #     # start="http://purl.org/ejp-rd/metadata-model/v1/shex/patientRegistryShape",
    # )
    # output = ''
    # shex_failed = False
    # for validate_type in focus_types: 
    #     for s, p, o in g.triples((None, RDF.type, URIRef(validate_type))):
    #         # print('ShEx evaluate focus entity ' + str(s))
    #         # For specific RDF format: evaluator.evaluate(rdf_format="json-ld")
    #         for shex_eval in evaluator.evaluate(focus=str(s)):
    #             # output = output + f"{result.focus}: "
    #             if shex_eval.result:
    #                 if not shex_failed:
    #                     output = output + f"ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>"
    #                     # eval.success(f'ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>')
    #                 else:
    #                     output = output + f'ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>'
    #             else:
    #                 output = output + f'ShEx validation failing for type <{validate_type}> with focus <{shex_eval.focus}> due to {shex_eval.reason}'
    #                 shex_failed = True

    # return JSONResponse({
    #     'comments': output,
    #     'valid': not shex_failed
    # })

    return JSONResponse({'output': 'Not implemented'})
