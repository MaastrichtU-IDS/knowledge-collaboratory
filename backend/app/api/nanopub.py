import json
import os
from pathlib import Path
from typing import Union

import pyshacl
from fastapi import APIRouter, Body, Depends, File, HTTPException, Response, UploadFile
from fastapi.encoders import jsonable_encoder
from nanopub import Nanopub, NanopubConf, NanopubIntroduction, Profile, load_profile
from rdflib import ConjunctiveGraph, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DCTERMS, PROV
from starlette.responses import JSONResponse

from app.api.login import get_current_user
from app.config import settings
from app.models import User

router = APIRouter()

BASE = Namespace("http://purl.org/nanopub/temp/")
PAV = Namespace("http://purl.org/pav/")
NP = Namespace("http://www.nanopub.org/nschema#")
NPX = Namespace("http://purl.org/nanopub/x/")
NP_URI = Namespace("http://purl.org/nanopub/temp/mynanopub#")

shacl_g = Graph()
shacl_g.parse(
    "app/biolink-model.shacl.ttl",
    # "https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shacl.ttl",
    format="ttl"
)

biolink_g = Graph()
biolink_g.parse(
    "https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.owl.ttl",
    format="ttl"
)

def get_np_config(user_id: str) -> NanopubConf:
    return NanopubConf(
        profile=load_profile(f"{settings.KEYSTORE_PATH}/{user_id}/profile.yml"),
    )


ASSERTION_EXAMPLE = {
    "@context": {
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "dct": "http://purl.org/dc/terms/",
        "biolink": "https://w3id.org/biolink/vocab/"
    },
    "@type": "biolink:Association",
    "biolink:category": "biolink:Association",
    "rdf:subject": {"@id": "drugbank:DB00001"},
    "rdf:predicate": {"@id": "biolink:treats"},
    "rdf:object": {"@id": "MONDO:0004975"},
    # "@provenance": {
    #     "@context": {
    #         "ml": "https://w3id.org/YOUR_ML_SCHEMA/"
    #     },
    #     "ml:algorithm": "nearest neightbor",
    #     "ml:weight": 0.6,
    # }
}
# ASSERTION_EXAMPLE = [
#     {
#         "@context": "https://schema.org",
#         "@type": "Dataset",
#         "name": "ECJ case law text similarity analysis",
#         "description": "results from a study to analyse how closely the textual similarity of ECJ cases resembles the citation network of the cases.",
#         "version": "v2.0",
#         "url": "https://doi.org/10.5281/zenodo.4228652",
#         "license": "https://www.gnu.org/licenses/agpl-3.0.txt",
#     }
# ]

@router.post(
    "/assertion",
    name="Publish an Assertion",
    description="""Post an RDF assertion as JSON-LD that will be published in a Nanopublication using the key previously stored with your ORCID user.
You can also provide additional provenance using the special `@provenance` key.""",
    response_description="Operation result",
    response_model={},
)
async def publish_assertion(
    nanopub_rdf: Union[dict, list] = Body(..., example=ASSERTION_EXAMPLE),
    current_user: User = Depends(get_current_user),
    publish: bool = False,
    add_biolink_version: bool = True,
    shacl_validation: bool = True,
    source: str = None,
) -> Response:
    nanopub_rdf = jsonable_encoder(nanopub_rdf)

    print(current_user)
    if not current_user or "id" not in current_user.keys():
        raise HTTPException(
            status_code=403,
            detail="You need to login with ORCID to publish a Nanopublication",
        )

    keyfile_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/id_rsa"
    if not os.path.isfile(keyfile_path):
        raise HTTPException(
            status_code=403,
            detail="You need to first store a Nanopub key with the /authentication-key call",
        )

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

    annotations_rdf = nanopub_rdf["@provenance"]

    del nanopub_rdf["@provenance"]
    nanopub_rdf = json.dumps(nanopub_rdf)

    g = Graph()
    g.bind("np", NP)
    g.bind("pav", PAV)
    g.bind("prov", PROV)
    g.bind("dct", DCTERMS)
    g.bind("npx", NPX)
    g.bind("orcid", Namespace("https://orcid.org/"))
    g.bind("schema", Namespace("http://schema.org/"))
    g.bind("schemaorg", Namespace("https://schema.org/"))
    g.bind("biolink", Namespace("https://w3id.org/biolink/vocab/"))
    g.bind("infores", Namespace("https://w3id.org/biolink/infores/"))
    g.bind("drugbank", Namespace("http://identifiers.org/drugbank/"))
    g.bind("pmid", Namespace("http://www.ncbi.nlm.nih.gov/pubmed/"))
    g.bind("ro", Namespace("http://purl.obolibrary.org/obo/RO_"))
    g.bind("omim", Namespace("http://purl.obolibrary.org/obo/OMIM_"))
    g.bind("mondo", Namespace("http://purl.obolibrary.org/obo/MONDO_"))
    g.bind("ncit", Namespace("http://purl.obolibrary.org/obo/NCIT_"))
    g.bind("hp", Namespace("http://purl.obolibrary.org/obo/HP_"))
    g.bind("efo", Namespace("http://www.ebi.ac.uk/efo/EFO_"))
    g.bind("pubchem.compound", Namespace("http://identifiers.org/pubchem.compound/"))
    g.bind("unii", Namespace("http://identifiers.org/unii/"))
    g.bind("umls", Namespace("http://identifiers.org/umls/"))
    g.bind("mesh", Namespace("http://id.nlm.nih.gov/mesh/"))

    g.parse(data=nanopub_rdf, format="json-ld")

    if shacl_validation:
        # TODO: fix constraints on subclasses https://github.dev/RDFLib/pySHACL/blob/d218a01d1ef76385943bfc47e6bbfe16d8c3f57c/pyshacl/shapes_graph.py#L102
        conforms, _, results_text = pyshacl.validate(g, shacl_graph=shacl_g, ont_graph=biolink_g)
        # conforms, _, results_text = pyshacl.validate(g, shacl_graph=shacl_g)
        if results_text:
            results_text = results_text.replace("Constraint Violation in", "\nConstraint Violation in")
        # conforms, _, results_text = pyshacl.validate(g, shacl_graph=shacl_g, inference="rdfs")

        if conforms is False:
            raise HTTPException(
                status_code=400,
                detail=f"Error validating the assertion with the BioLink SHACL shape:\n{results_text}",
            )

    # Pubinfo time and creator are added by the nanopub lib
    np_conf = get_np_config(current_user["sub"])
    np_conf.add_prov_generated_time=True,
    np_conf.add_pubinfo_generated_time=True,
    np_conf.attribute_assertion_to_profile=True,
    np_conf.attribute_publication_to_profile=True,
    np = Nanopub(
        assertion=g,
        conf=np_conf,
    )

    if annotations_rdf:
        # Make sure annotations have the assertion as subject
        if "@graph" not in annotations_rdf and "@id" not in annotations_rdf:
            annotations_rdf["@id"] = str(np.assertion.identifier)
        np.provenance.parse(data=annotations_rdf, format="json-ld")
    if source:
        np.provenance.add((np.assertion.identifier, PROV.hadPrimarySource, URIRef(source)))

    if add_biolink_version:
        np.pubinfo.add(
            (
                np.metadata.np_uri,
                DCTERMS.conformsTo,
                URIRef("https://w3id.org/biolink/vocab/"),
            )
        )
        np.pubinfo.add(
            (
                URIRef("https://w3id.org/biolink/vocab/"),
                PAV.version,
                Literal(settings.BIOLINK_VERSION),
            )
        )

    np.sign()

    if publish:
        np.publish()
    else:
        signed_path = Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.nanopub.trig")
        np.store(signed_path)

    return Response(content=np.rdf.serialize(format='trig'), media_type="application/trig")


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
@router.post(
    "/nanopub",
    name="Publish a Nanopub",
    description="""Publish a full Nanopublication using the key previously stored with your ORCID user""",
    response_description="Operation result",
    response_model={},
)
async def publish_nanopub(
    nanopub_rdf: str = Body(..., example=NANOPUB_EXAMPLE),
    publish: bool = False,
    current_user: User = Depends(get_current_user),
):
    if not current_user or "id" not in current_user.keys():
        raise HTTPException(
            status_code=403,
            detail="You need to login with ORCID to publish a Nanopublication",
        )

    keyfile_path = f"{settings.KEYSTORE_PATH}/{current_user['sub']}/id_rsa"
    if not os.path.isfile(keyfile_path):
        raise HTTPException(
            status_code=403,
            detail="You need to first store a Nanopub key with the /authentication-key call",
        )

    g = ConjunctiveGraph()
    g.parse(data=nanopub_rdf, format='trig')

    np_conf = get_np_config(current_user["sub"])
    np = Nanopub(conf=np_conf, rdf=g)

    if publish:
        np.publish()
    else:
        np.sign()

    return Response(content=np.rdf.serialize(format='trig'), media_type="application/trig")


@router.post(
    "/publish-last-signed",
    name="Publish the last nanopub you signed",
    description="""Useful to first sign a nanopub, verify it, then publish it""",
    response_description="Operation result",
    response_model={},
)
async def publish_last_signed(
    current_user: User = Depends(get_current_user),
):
    if not current_user or "id" not in current_user.keys():
        raise HTTPException(
            status_code=403,
            detail="You need to login with ORCID to publish a Nanopublication",
        )

    signed_path = Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}/signed.nanopub.trig")

    if not os.path.isfile(signed_path):
        raise HTTPException(
            status_code=403,
            detail="You need to first sign a Nanopub with the /assertion or /nanopub call",
        )

    np_conf = get_np_config(current_user["sub"])
    try:
        np = Nanopub(conf=np_conf, rdf=signed_path)

        np.publish()
        os.remove(signed_path)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail=f"Error when publishing the nanopub: {e}",
        )

    return Response(content=np.rdf.serialize(format='trig'), media_type="application/trig")


@router.get(
    "/generate-keys",
    description="""This will generate authentications keys and register them in the Nanopublication network for your ORCID""",
    response_description="Operation result",
    response_model={},
)
async def generate_keyfile(current_user: User = Depends(get_current_user)):

    if not current_user or "id" not in current_user.keys():
        raise HTTPException(
            status_code=403,
            detail="You need to login to generate and register authentication keys to your ORCID",
        )

    user_dir = f"{settings.KEYSTORE_PATH}/{current_user['sub']}"
    pubkey_path = f"{user_dir}/id_rsa.pub"
    privkey_path = f"{user_dir}/id_rsa"

    if Path(pubkey_path).exists() or Path(privkey_path).exists():
        raise HTTPException(
            status_code=500,
            detail=f"A key pair already exist for user {current_user['id']}",
        )

    # Create user directory if does not exist
    Path(user_dir).mkdir(parents=True, exist_ok=True)
    username = ""
    if current_user["given_name"] or current_user["family_name"]:
        username = current_user["given_name"] + " " + current_user["family_name"]
        username = username.strip()
    elif current_user["name"]:
        username = current_user["name"]

    try:
        p = Profile(
            name=username,
            orcid_id=current_user['id'],
        )
        p.store(Path(user_dir))

        np_intro = NanopubIntroduction(
            conf=NanopubConf(profile=p),
            host=f"https://{settings.VIRTUAL_HOST}"
        )
        np_intro.publish()

        return JSONResponse({"message": f"Nanopub keys generated for {current_user['id']} and introduction nanopub published at {np_intro.source_uri}"})
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=f"An error occured when generating a keypair: {e}",
        )


@router.post(
    "/upload-keys",
    description="""Login with ORCID, and upload and store your authentications keys used to publish Nanopublication on our server""",
    response_description="Operation result",
    response_model={},
)
async def store_keyfile(
    publicKey: UploadFile = File(...),
    privateKey: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):

    if not current_user or "id" not in current_user.keys():
        raise HTTPException(
            status_code=403,
            detail="You need to login to upload the authentication keys bound to your ORCID",
        )

    user_dir = f"{settings.KEYSTORE_PATH}/{current_user['sub']}"
    # Create user directory if does not exist
    Path(user_dir).mkdir(parents=True, exist_ok=True)

    pubkey_path = f"{user_dir}/id_rsa.pub"
    with open(pubkey_path, "w") as f:
        pubkey = await publicKey.read()
        f.write(pubkey.decode("utf-8"))

    privkey_path = f"{user_dir}/id_rsa"
    with open(privkey_path, "w") as f:
        privkey = await privateKey.read()
        f.write(privkey.decode("utf-8"))

    username = ""
    if current_user["given_name"] or current_user["family_name"]:
        username = current_user["given_name"] + " " + current_user["family_name"]
        username = username.strip()
    elif current_user["name"]:
        username = current_user["name"]

    profile_yaml = f"""orcid_id: {current_user['id']}
name: {username}
public_key: {pubkey_path}
private_key: {privkey_path}
introduction_nanopub_uri:
"""
    with open(f"{user_dir}/profile.yml", "w") as f:
        f.write(profile_yaml)

    return JSONResponse({"message": "Nanopub key stored for " + current_user["id"]})



# @router.delete(
#     "/delete-keys",
#     description="""Delete the Nanopub keys stored on our server associated to your ORCID""",
#     response_description="Operation result",
#     response_model={},
# )
# async def delete_keyfile(current_user: User = Depends(get_current_user)):

#     if not current_user or "id" not in current_user.keys():
#         raise HTTPException(
#             status_code=403,
#             detail=f"You need to login to delete the keys associated with your ORCID",
#         )

#     keyfile_folder = Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}")

#     if keyfile_folder.exists():
#         shutil.rmtree(keyfile_folder)

#     return JSONResponse(
#         {
#             "message": "The Nanopub keyfile has been properly deleted from our servers for the ORCID user "
#             + current_user["id"]
#         }
#     )


# import zipfile
# @router.get(
#     "/download-keys",
#     description="""Download the Nanopub keys stored on our server associated to your ORCID""",
#     response_description="Operation result",
#     response_model={},
# )
# async def download_keyfile(current_user: models.User = Depends(get_current_user)):
#     if not current_user or "id" not in current_user.keys():
#         raise HTTPException(
#             status_code=403,
#             detail=f"You need to login to download the keys associated with your ORCID",
#         )
#     user_dir = Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}")
#     if user_dir.exists():
#         # shutil.make_archive(f"{user_dir}/nanopub_profile.zip", 'zip', user_dir)
#         zip_filename = "nanopub_profile.zip"
#         # Open BytesIO to grab in-memory ZIP contents
#         s = BytesIO()
#         # The zip compressor
#         zf = zipfile.ZipFile(s, "w")
#         for root, dirs, files in os.walk(user_dir):
#             for fpath in files:
#                 # Add file, at correct path
#                 print(os.path.join(root, fpath))
#                 zf.write(os.path.join(root, fpath), fpath)
#         zf.close()
#         # Grab ZIP file from in-memory, make response with correct MIME-type
#         return Response(
#             s.getvalue(),
#             media_type="application/x-zip-compressed",
#             headers={"Content-Disposition": f"attachment;filename={zip_filename}"},
#         )
#     return JSONResponse(
#         {
#             "message": "No files has been found on our servers for the ORCID user "
#             + current_user["id"]
#         }
#     )
