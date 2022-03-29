from json import encoder
from fastapi import FastAPI, Response, APIRouter, Body, HTTPException, status, Depends, Header, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# from typing import Collection, List, Optional
from typing import List, Optional, Union, Dict
from starlette.responses import RedirectResponse
from rdflib import Graph, ConjunctiveGraph, Dataset, URIRef, Namespace, RDF, Literal
from rdflib.namespace import RDFS, XSD, DC, DCTERMS, VOID, PROV
from pyld import jsonld

import os
import json
from pathlib import Path
import datetime

from app.models import User
from app.api.login import get_current_user, reusable_oauth2
from app.config import settings

router = APIRouter()

BASE = Namespace("https://w3id.org/collaboratory/")

PAV = Namespace("http://purl.org/pav/")
NP = Namespace("http://www.nanopub.org/nschema#")
NPX = Namespace("http://purl.org/nanopub/x/")


NANOPUB_EXAMPLE = """@prefix : <https://w3id.org/collaboratory/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dc: <http://purl.org/dc/terms/> .
@prefix pav: <http://purl.org/pav/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix np: <http://www.nanopub.org/nschema#> .
@prefix npx: <http://purl.org/nanopub/x/> .
@prefix ex: <http://example.org/> .

:Head {
	: np:hasAssertion :assertion ;
		np:hasProvenance :provenance ;
		np:hasPublicationInfo :pubinfo ;
		a np:Nanopublication .
}

:assertion {
	ex:mosquito ex:transmits ex:malaria .
}

:provenance {
	:assertion prov:wasAttributedTo <http://orcid.org/0000-0002-1501-1082> .
}

:pubinfo {
	: dc:created "2014-07-24T18:05:11+01:00"^^xsd:dateTime ;
		pav:createdBy <http://orcid.org/0000-0002-1501-1082> ;
		a npx:ExampleNanopub .
}"""


@router.post("/nanopub", name="Publish a Nanopub",
    description="""Publish a full Nanopublication using the key previously stored with your ORCID user""",
    response_description="Operation result", 
    response_model={})
async def publish_nanopub(
        nanopub_rdf: str = Body(..., example=NANOPUB_EXAMPLE),
        # Query( None, description=self.example_query)
        # nanopub_rdf: str = Body(..., example=json.dumps(NANOPUB_EXAMPLE, indent=2)),
        current_user: User = Depends(get_current_user)
    ):

    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login with ORCID to publish a Nanopublication")

    keyfile_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/idrsa"
    if not os.path.isfile(keyfile_path):
        raise HTTPException(
            status_code=403, detail=f"You need to first store a Nanopub key with the /authentication-key call")

    nanopub_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/publication.trig"
    with open(nanopub_path, 'w') as f:
        f.write(nanopub_rdf)
    
    sign_cmd = f'java -jar /opt/nanopub.jar sign {nanopub_path} -k {keyfile_path}'
    print(sign_cmd)
    os.system(sign_cmd)

    signed_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.publication.trig"
    # publish_cmd = f'java -jar /opt/nanopub.jar publish {signed_path} -k {keyfile_path}'
    # os.system(publish_cmd)

    with open(signed_path, 'r') as f:
        signed_trig = f.read()
        return Response(content=signed_trig, media_type="application/trig")

    # return JSONResponse({
    #     'message': 'Nanopublication published with ' + current_user['id']
    # })



ASSERTION_EXAMPLE = [{
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "ECJ case law text similarity analysis",
    "description": "results from a study to analyse how closely the textual similarity of ECJ cases resembles the citation network of the cases.",
    "version": "v2.0",
    "url": "https://doi.org/10.5281/zenodo.4228652",
    "license": "https://www.gnu.org/licenses/agpl-3.0.txt"
}]

@router.post("/assertion", name="Publish an Assertion",
    description="""Post an RDF assertion as JSON-LD (only triples, no graph) that will be published in a Nanopublication using the key previously stored with your ORCID user""",
    response_description="Operation result", 
    response_model={})
async def publish_assertion(
        # evaluation: CreateEvaluationModel = Body(...),
        # keyfile: UploadFile = File(...),
        nanopub_rdf: Union[Dict,List] = Body(..., example=ASSERTION_EXAMPLE),
        # nanopub_rdf: Any = Body(..., example=ASSERTION_EXAMPLE),
        current_user: User = Depends(get_current_user),
        source: Optional[str] = None,
        quoted_from: Optional[str] = None
    ):
    print(f"nanopub_rdf begin: {nanopub_rdf}")
    nanopub_rdf = jsonable_encoder(nanopub_rdf)

    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login with ORCID to publish a Nanopublication")

    keyfile_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/idrsa"
    if not os.path.isfile(keyfile_path):
        raise HTTPException(
            status_code=403, detail=f"You need to first store a Nanopub key with the /authentication-key call")

    assertion_graph = URIRef(str(BASE) + 'assertion')
    print(assertion_graph)
    head_graph = URIRef(str(BASE) + 'Head')
    prov_graph = URIRef(str(BASE) + 'provenance')
    pubinfo_graph = URIRef(str(BASE) + 'pubinfo')

    ## TODO: will be fixed in the rdflib release after 6.0.2
    # try:
    #     if '@context' in nanopub_rdf.keys() and (str(nanopub_rdf['@context']).startswith('http://schema.org') or str(nanopub_rdf['@context']).startswith('https://schema.org')):
    #         # Regular content negotiation dont work with schema.org: https://github.com/schemaorg/schemaorg/issues/2578
    #         nanopub_rdf['@context'] = 'https://schema.org/docs/jsonldcontext.json'
    # except:
    #     pass
    # RDFLib JSON-LD has issue with encoding: https://github.com/RDFLib/rdflib/issues/1416
    # nanopub_rdf = jsonld.expand(nanopub_rdf)
    # nanopub_rdf = json.dumps(nanopub_rdf, ensure_ascii=False).encode("utf-8")
    nanopub_rdf = json.dumps(nanopub_rdf)
    print(f"nanopub_rdf after dump: {nanopub_rdf}")

    # RDFLib does not allow to load triples in a specific graph so we need to use another graph
    loader_g = Graph()
    loader_g.parse(
        data=nanopub_rdf, 
        format='json-ld'
    )

    print(f"Loaded from assertion: {len(loader_g)}")

    g = Dataset(default_graph_base=str(BASE))
    # g = ConjunctiveGraph(identifier=assertion_graph, default_graph_base=str(BASE))
    # In published np it is http://purl.org/np/
    g.bind("", BASE)
    g.bind("np", NP)
    g.bind("pav", PAV)
    g.bind("prov", PROV)
    g.bind("dct", DCTERMS)
    g.bind("npx", NPX)
    g.bind("schema", URIRef('http://schema.org/'))
    g.bind("schemaorg", URIRef('https://schema.org/'))
    g.bind("biolink", URIRef('https://w3id.org/biolink/vocab/'))
    
    BASE_URI = URIRef(str(BASE))

    for s, p, o in loader_g:
        g.add((s, p, o, assertion_graph))

    # Head
    g.add((BASE_URI, NP.hasAssertion, BASE.assertion, head_graph))
    g.add((BASE_URI, NP.hasProvenance, BASE.provenance, head_graph))
    g.add((BASE_URI, NP.hasPublicationInfo, BASE.pubinfo, head_graph))
    g.add((BASE_URI, RDF.type, NP.Nanopublication, head_graph))

    # Pubinfo
    time_created = datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
    g.add((BASE_URI, DCTERMS.created, Literal(time_created, datatype=XSD.integer, normalize=False), pubinfo_graph))
    g.add((BASE_URI, PAV.createdBy, URIRef(current_user['id']), pubinfo_graph))
    g.add((BASE_URI, RDF.type, NPX.ExampleNanopub, pubinfo_graph))

    # Provenance
    if source:
        g.add((BASE.assertion, PROV.hadPrimarySource, URIRef(source), prov_graph))
    if quoted_from:
        g.add((BASE.assertion, PROV.wasQuotedFrom, Literal(quoted_from), prov_graph))
    
    # g.add((BASE.assertion, PROV.wasAttributedTo, URIRef(current_user['id']), prov_graph))
    g.add((BASE.assertion, PROV.generatedAtTime, Literal(time_created, datatype=XSD.integer, normalize=False), prov_graph))
    

    # :Head {
    #     : np:hasAssertion :assertion ;
    #         np:hasProvenance :provenance ;
    #         np:hasPublicationInfo :pubinfo ;
    #         a np:Nanopublication .
    # }
    # :provenance {
    #     :assertion prov:hadPrimarySource <http://dx.doi.org/10.3233/ISU-2010-0613> .
    # }
    # :pubinfo {
    #     : dc:created "2014-07-24T18:05:11+01:00"^^xsd:dateTime ;
    #         pav:createdBy <http://orcid.org/0000-0002-1501-1082> ;
    #         a npx:ExampleNanopub .
    # }

    triple_count = len(g)
    print(triple_count, 'triples')
    print(g.serialize(format='trig'))

    nanopub_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/publication.trig"
    with open(nanopub_path, 'w') as f:
        f.write(g.serialize(format='trig'))
    
    sign_cmd = f'java -jar /opt/nanopub.jar sign {nanopub_path} -k {keyfile_path}'
    print(sign_cmd)
    os.system(sign_cmd)

    signed_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.publication.trig"
    # publish_cmd = f'java -jar /opt/nanopub.jar publish {signed_path} -k {keyfile_path}'
    # os.system(publish_cmd)

    with open(signed_path, 'r') as f:
        signed_trig = f.read()
        return Response(content=signed_trig, media_type="application/trig")

    # return JSONResponse({
    #     'message': f'Nanopublication containing an assertion of {triple_count} triples published with ' + current_user['id']
    # })
