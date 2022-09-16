import argparse

import pandas as pd
from nanopub import NanopubClient, Publication
from pyshex import ShExEvaluator
from rdflib import FOAF, RDF, RDFS, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DC, DCTERMS, PROV, RDFS, VOID, XSD

from nanopub_utils import (BIOLINK, DCAT, MLS, NP, NP_URI, NPX, PAV, PROV,
                           SCHEMA, SKOS, init_graph, shex_validation)

# Get arguments
parser = argparse.ArgumentParser(description='Publish nanopublications.')
parser.add_argument('--publish', action='store_true',
                    help='Publish nanopubs (default: False)')
parser.add_argument('--validate', action='store_true',
                    help='Validate nanopubs wih PyShEx (default: False)')
args = parser.parse_args()

CREATOR_ORCID = "https://orcid.org/0000-0001-7769-4272"
CREATION_TIME = "2020-09-21T00:00:00"

# Create the client, that allows searching, fetching and publishing nanopubs
np_client = NanopubClient()

# Generate nanopubs from OpenPredict drug-disease gold standard
url = 'https://raw.githubusercontent.com/MaastrichtU-IDS/translator-openpredict/master/openpredict/data/resources/openpredict-omim-drug.csv'

data = pd.read_csv(url)

np_list = []
for index, row in data.iterrows():
    drug_id = row['drugid']
    disease_id = row['omimid']

    assertion = init_graph()
    assertion.bind("biolink", URIRef('https://w3id.org/biolink/vocab/'))
    assertion.bind("drugbank", URIRef('http://identifiers.org/drugbank/'))
    assertion.bind("pmid", URIRef('http://www.ncbi.nlm.nih.gov/pubmed/'))
    assertion.bind("ro", URIRef('http://purl.obolibrary.org/obo/RO_'))
    assertion.bind("omim", URIRef('http://purl.obolibrary.org/obo/OMIM_'))
    assertion.bind("pav", URIRef('http://purl.org/pav/'))
    assertion.bind("orcid", URIRef('https://orcid.org/'))

    # Use BioLink JSON-LD context: https://github.com/biolink/biolink-model/blob/master/context.jsonld
    drug_uri = URIRef('http://identifiers.org/drugbank/' + drug_id)
    disease_uri = URIRef('http://purl.obolibrary.org/obo/OMIM_' + str(disease_id))

    association_uri = NP['association']

    # BioLink do not require to define rdf:type, but we do it anyway
    assertion.add( (drug_uri, RDF.type, BIOLINK['Drug'] ) )
    assertion.add( (drug_uri, BIOLINK.category, BIOLINK['Drug'] ) )

    assertion.add( (disease_uri, RDF.type, BIOLINK.Disease ) )
    assertion.add( (disease_uri, BIOLINK.category, BIOLINK['Disease'] ) )

    # Generate triples for the association
    assertion.add( (association_uri, RDF.subject, drug_uri ) )
    assertion.add( (association_uri, RDF.object, disease_uri ) )
    assertion.add( (association_uri, RDF.predicate, BIOLINK.treats ) )

    # is substance that treats
    assertion.add( (association_uri, BIOLINK.relation, URIRef("http://purl.obolibrary.org/obo/RO_0002606") ) )

    assertion.add( (association_uri, BIOLINK['category'], BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation) )
    assertion.add( (association_uri, RDF.type, BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation ) )

    # Information about the dataset providing of the statement
    knowledge_provider_uri = URIRef('https://w3id.org/biolink/infores/knowledge-collaboratory')
    knowledge_source_uri = URIRef("http://www.ncbi.nlm.nih.gov/pubmed/PMC3159979")
    # primary_source_uri = 'https://docs.google.com/spreadsheets/d/1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE/edit#gid=428566902'

    assertion.add( (association_uri, BIOLINK['aggregator_knowledge_source'], knowledge_provider_uri) )
    # assertion.add( (association_uri, BIOLINK['primary_knowledge_source'], knowledge_source_uri) )
    assertion.add( (association_uri, BIOLINK['publications'], knowledge_source_uri) )

    pubinfo = Graph()
    pubinfo.add( (
        URIRef('https://w3id.org/biolink/vocab/'),
        URIRef('http://purl.org/pav/version'),
        Literal('2.3.0')
    ) )

    # Add provenance infos
    prov = Graph()
    prov.add( (
        NP['assertion'],
        PROV.wasAttributedTo,
        URIRef(CREATOR_ORCID)
    ) )
    prov.add( (
        NP['assertion'],
        DCTERMS.created,
        Literal(CREATION_TIME, datatype=XSD.dateTime, normalize=False)
    ) )
    # prov.add( (
    #     NP['assertion'],
    #     PROV.hadPrimarySource,
    #     knowledge_source_uri
    # ) )

    publication = np_client.create_publication(
        assertion_rdf=assertion,
        provenance_rdf=prov,
        pubinfo_rdf=pubinfo,
        add_prov_generated_time=False
    )

    if args.publish:
        published_info = np_client.publish(publication)
        print(published_info['nanopub_uri'])
    else:
        signed_file = np_client.sign(publication)
        published_info = {'nanopub_uri': f'http://np#{str(len(np_list))}'}

    np_list.append(published_info['nanopub_uri'])
    print(str(len(np_list)))

    if len(np_list) == 1:
        print('🔬 One of the nanopub published:')
        # print(publication._rdf.serialize(format='trig').decode('utf-8'))
        print(publication._rdf.serialize(format='trig'))

        if args.validate:
            shex_validation(
                assertion,
                start=str(BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation),
                focus=str(association_uri)
                # start=str(BIOLINK.Drug),
                # focus=str(URIRef('http://identifiers.org/drugbank/DB01148'))
            )

    if not args.publish and len(np_list) >= 10:
        break

# Print the list of published np URIs in case we need to reuse it to republish the np index
# print('["' + '", "'.join(np_list) + '"]')
print(f'🛎️  {str(len(np_list))} nanopublications published')

np_index = np_client.create_nanopub_index(
    np_list,
    title="OpenPredict reference dataset",
    description="""A dataset of 1972 drug indications retrieved from the PREDICT publication and used as reference dataset for the OpenPredict model.
See https://github.com/MaastrichtU-IDS/translator-openpredict for more details.""",
    see_also="https://github.com/MaastrichtU-IDS/translator-openpredict",
    creators=[CREATOR_ORCID],
    creation_time=CREATION_TIME
)

if args.publish:
    index_uri = np_client.publish(np_index)
else:
    print(np_index._rdf.serialize(format='trig'))
    index_uri = np_client.sign(np_index)

print('✅ Published Nanopub Index:')
print(index_uri)