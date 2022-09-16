from typing import List, Optional

import requests
import spacy
from fastapi import APIRouter, Body, FastAPI, HTTPException, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pyshex import ShExEvaluator
from rdflib import Graph, URIRef
from rdflib.namespace import DC, DCTERMS, RDF, RDFS

from app.config import settings

router = APIRouter()


example_rdf = """@prefix this: <http://purl.org/np/RAKPZmCZwmP83KszoeZyTHeqD3t4MVxR47dALSYKjmy48> .
@prefix sub: <http://purl.org/np/RAKPZmCZwmP83KszoeZyTHeqD3t4MVxR47dALSYKjmy48#> .
@prefix schema: <https://schema.org/> .
@prefix np: <http://www.nanopub.org/nschema#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix nt: <https://w3id.org/np/o/ntemplate/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix orcid: <https://orcid.org/> .
@prefix bl: <https://w3id.org/biolink/vocab/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix npx: <http://purl.org/nanopub/x/> .

sub:association rdf:object <http://purl.obolibrary.org/obo/DOID_1040>;
    rdf:predicate bl:treats;
    rdf:subject <https://identifiers.org/drugbank:DB09054>;
    a rdf:Statement;
    rdfs:label "zydelig is a kinase inhibitor indicated for the treatment of patients with relapsed chronic lymphocytic leukemia";
    bl:association_type bl:ChemicalToDiseaseOrPhenotypicFeatureAssociation;
    bl:provided_by <https://w3id.org/um/NeuroDKG>;
    bl:relation schema:TreatmentIndication .
"""


@router.post("/validation/shex", name="Validate RDF with ShEx shapes",
    description="""Validate RDF with ShEx shapes""",
    response_description="Result of the ShEx execution", 
    response_model={})
async def validation_shex(
        rdf_input: str = Body(..., example=example_rdf),
        # rdf_input: str = Body(...),
        shape_start: str = 'https://w3id.org/biolink/vocab/Associationaaa',
        shape_url: str = 'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex',
        focus_types: List[str] = ['https://w3id.org/biolink/vocab/Association'],
    ):
    # shapemap: str = '{ FOCUS rdf:type <https://w3id.org/biolink/vocab/Association> }@<https://w3id.org/biolink/vocab/Association>',

    # if shape_url == 'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex':
    shex_shape = requests.get(shape_url).text

    g = Graph()
    g.parse(
        data=rdf_input, 
        # format='json-ld'
    )

    evaluator = ShExEvaluator(g.serialize(format='turtle'), shex_shape,
        start=shape_start,
        # start="http://purl.org/ejp-rd/metadata-model/v1/shex/patientRegistryShape",
    )
    output = ''
    shex_failed = False
    for validate_type in focus_types: 
        for s, p, o in g.triples((None, RDF.type, URIRef(validate_type))):
            # print('ShEx evaluate focus entity ' + str(s))
            # For specific RDF format: evaluator.evaluate(rdf_format="json-ld")
            for shex_eval in evaluator.evaluate(focus=str(s)):
                # output = output + f"{result.focus}: "
                if shex_eval.result:
                    if not shex_failed:
                        output = output + f"ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>"
                        # eval.success(f'ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>')
                    else:
                        output = output + f'ShEx validation passing for type <{validate_type}> with focus <{shex_eval.focus}>'
                else:
                    output = output + f'ShEx validation failing for type <{validate_type}> with focus <{shex_eval.focus}> due to {shex_eval.reason}'
                    shex_failed = True

    return JSONResponse({
        'comments': output,
        'valid': not shex_failed
    })

    # return JSONResponse({'output': 'Not implemented'})
