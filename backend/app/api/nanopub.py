import datetime
import json
import os
import shutil
from json import encoder
from typing import Dict, List, Optional, Union

from fastapi import (
    APIRouter,
    Body,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Query,
    Response,
    status,
)
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from nanopub import NanopubClient, Publication
from rdflib import RDF, ConjunctiveGraph, Dataset, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DC, DCTERMS, PROV, RDFS, VOID, XSD
from starlette.responses import RedirectResponse

from app.api.login import get_current_user, reusable_oauth2
from app.config import settings
from app.models import User

router = APIRouter()

BASE = Namespace("http://purl.org/nanopub/temp/")
PAV = Namespace("http://purl.org/pav/")
NP = Namespace("http://www.nanopub.org/nschema#")
NPX = Namespace("http://purl.org/nanopub/x/")
NP_URI = Namespace("http://purl.org/nanopub/temp/mynanopub#")


def get_np_client(user_id: str):
    return NanopubClient(
        profile_path=f"{settings.KEYSTORE_PATH}/{user_id}/profile.yml",
        sign_explicit_private_key=True,
    )


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
        nanopub_rdf: Union[Dict,List] = Body(..., example=ASSERTION_EXAMPLE),
        current_user: User = Depends(get_current_user),
        publish: bool= False,
        quoted_from: Optional[str] = None,
        add_biolink_version: bool = True,
        source: Optional[str] = None,
    ):
    nanopub_rdf = jsonable_encoder(nanopub_rdf)

    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login with ORCID to publish a Nanopublication")

    np_client = get_np_client(current_user['sub'])

    keyfile_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/idrsa"
    if not os.path.isfile(keyfile_path):
        raise HTTPException(
            status_code=403, detail=f"You need to first store a Nanopub key with the /authentication-key call")

    ## TODO: this should be fixed in the rdflib release after 6.0.2
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

    g = Graph()
    g.bind("np", NP)
    g.bind("pav", PAV)
    g.bind("prov", PROV)
    g.bind("dct", DCTERMS)
    g.bind("npx", NPX)
    g.bind("orcid", Namespace('https://orcid.org/'))
    g.bind("schema", Namespace('http://schema.org/'))
    g.bind("schemaorg", Namespace('https://schema.org/'))
    g.bind("biolink", Namespace('https://w3id.org/biolink/vocab/'))
    g.bind("infores", Namespace('https://w3id.org/biolink/infores/'))
    g.bind("drugbank", Namespace('http://identifiers.org/drugbank/'))
    g.bind("pmid", Namespace('http://www.ncbi.nlm.nih.gov/pubmed/'))
    g.bind("ro", Namespace('http://purl.obolibrary.org/obo/RO_'))
    g.bind("omim", Namespace('http://purl.obolibrary.org/obo/OMIM_'))
    g.bind("mondo", Namespace('http://purl.obolibrary.org/obo/MONDO_'))
    g.bind("ncit", Namespace('http://purl.obolibrary.org/obo/NCIT_'))
    g.bind("hp", Namespace('http://purl.obolibrary.org/obo/HP_'))
    g.bind("efo", Namespace('http://www.ebi.ac.uk/efo/EFO_'))
    g.bind("pubchem.compound", Namespace('http://identifiers.org/pubchem.compound/'))
    g.bind("unii", Namespace('http://identifiers.org/unii/'))
    g.bind("umls", Namespace('http://identifiers.org/umls/'))
    g.bind("mesh", Namespace('http://id.nlm.nih.gov/mesh/'))

    g.parse(
        data=nanopub_rdf,
        format='json-ld'
    )

    # Pubinfo time and creator are added by the nanopub lib
    pubinfo = Graph()
    prov = Graph()
    if quoted_from:
        prov.add((NP_URI.assertion, PROV.wasQuotedFrom, Literal(quoted_from)))
    if add_biolink_version:
        pubinfo.add((URIRef('https://w3id.org/biolink/vocab/'), PAV.version, Literal(settings.BIOLINK_VERSION)))
    if source:
        prov.add((NP_URI.assertion, PROV.hadPrimarySource, URIRef(source)))

    publication = np_client.create_publication(
        assertion_rdf=g,
        provenance_rdf=prov,
        pubinfo_rdf=pubinfo,
        add_prov_generated_time=True,
        add_pubinfo_generated_time=True,
        attribute_assertion_to_profile=True,
        attribute_publication_to_profile=True,
    )
    tmp_signed_path = np_client.sign(publication)

    signed_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.publication.trig"
    shutil.move(tmp_signed_path, signed_path)

    signed_trig = ''
    with open(signed_path, 'r') as f:
        signed_trig = f.read()

    if publish:
        np_client.publish_signed(signed_path)
        os.remove(signed_path)

    return Response(content=signed_trig, media_type="application/trig")



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


# TODO: convert to use the nanopub lib
@router.post("/nanopub", name="Publish a Nanopub",
    description="""Publish a full Nanopublication using the key previously stored with your ORCID user""",
    response_description="Operation result",
    response_model={})
async def publish_nanopub(
        nanopub_rdf: str = Body(..., example=NANOPUB_EXAMPLE),
        publish: bool= False,
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

    if publish:
        publish_cmd = f'java -jar /opt/nanopub.jar publish {signed_path} -k {keyfile_path}'
        os.system(publish_cmd)

    with open(signed_path, 'r') as f:
        signed_trig = f.read()
        return Response(content=signed_trig, media_type="application/trig")

    # return JSONResponse({
    #     'message': 'Nanopublication published with ' + current_user['id']
    # })


@router.post("/publish-last-signed", name="Publish the last nanopub you signed",
    description="""Useful to first sign a nanopub, verify it, then publish it""",
    response_description="Operation result",
    response_model={})
async def publish_last_signed(
        current_user: User = Depends(get_current_user),
    ):
    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login with ORCID to publish a Nanopublication")

    np_client = get_np_client(current_user['sub'])

    signed_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.publication.trig"

    if not os.path.isfile(signed_path):
        raise HTTPException(
            status_code=403, detail=f"You need to first sign a Nanopub with the /assertion or /nanopub call")

    signed_trig = ''
    with open(signed_path, 'r') as f:
        signed_trig = f.read()

    np_client.publish_signed(signed_path)
    os.remove(signed_path)

    return Response(content=signed_trig, media_type="application/trig")



    # publish_cmd = f'java -jar /opt/nanopub.jar publish {signed_path} -k {keyfile_path}'
    # os.system(publish_cmd)

    # with open(signed_path, 'r') as f:
    #     signed_trig = f.read()
    #     return Response(content=signed_trig, media_type="application/trig")

