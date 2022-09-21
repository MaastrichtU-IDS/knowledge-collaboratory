import argparse

import pandas as pd
from nanopub import NanopubClient, NanopubConfig
from pyshex import ShExEvaluator
from rdflib import FOAF, RDF, RDFS, XSD, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DC, DCTERMS, PROV, RDFS, VOID, XSD

from nanopub_utils import (BIOLINK, DCAT, MLS, NP, NP_URI, NPX, PAV, PROV,
                           SCHEMA, SKOS, create_nanopub_index, init_graph,
                           shex_validation)

# Done, Nanopub Index published to http://purl.org/np/RAaZp4akBZI6FuRzIpeksyYxTArOtxqmhuv9on-YssEzA

# Get arguments
parser = argparse.ArgumentParser(description='Publish nanopublications.')
parser.add_argument('--publish', action='store_true',
                    help='Publish nanopubs (default: False)')
parser.add_argument('--validate', action='store_true',
                    help='Validate nanopubs wih PyShEx (default: False)')
args = parser.parse_args()


# Initialize the nanopub client using the encrypted keys in the ~/.nanopub folder
np_client = NanopubClient(
    nanopub_config=NanopubConfig(add_prov_generated_time=False)
)
# np_client = NanopubClient(
#     profile_path='/home/vemonet/.not_nanopub/profile.yml',
#     sign_explicit_private_key=True,
# )

CREATOR_ORCID = 'https://orcid.org/0000-0002-7641-6446'
association_uri = NP['association']
study_context_uri = NP['context']


# https://docs.google.com/spreadsheets/d/1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE/edit#gid=1574253813
googledocs_id = '1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE'
sheet = 'Load'
# Build URL to download CSV from google docs
googledocs_url = 'https://docs.google.com/spreadsheets/d/' + googledocs_id + '/gviz/tq?tqx=out:csv&sheet=' + sheet

# Load csv to a pandas dataframe from the URL
df = pd.read_csv(googledocs_url)
# print(df)

np_list = []
for index, row in df.iterrows():
    g = init_graph()
    g.add( (association_uri, RDF.type, BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation ) )
    g.add( (association_uri, BIOLINK.category, BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation ) )
    g.add( (association_uri, RDFS.label, Literal(str(row['context']).strip())) )

    # Add drug as subject
    drug_uri = URIRef('http://identifiers.org/drugbank/' + row['drugbank_id'].strip())
    g.add( (association_uri, RDF.subject, drug_uri) )

    # Add disease as object (use OBO or identifiergs.org URI? http://purl.obolibrary.org/obo/MONDO_0002491)
    # disease_uri = URIRef('https://identifiers.org/' + row['mondo_id'].replace('_', ':'))
    disease_uri = URIRef(row['mondo_URL'].strip())
    g.add( (association_uri, RDF.object, disease_uri) )

    # Define predicate/relation: BioLink treats/OffLabel drug indication?
    g.add( (association_uri, RDF.predicate, BIOLINK.treats) )
    # Off-label
    relation_uri = 'http://purl.obolibrary.org/obo/NCIT_C94303'
    # Off-Label Use
    # relation_uri = 'http://id.nlm.nih.gov/mesh/D056687'
    g.add( (association_uri, BIOLINK.relation, URIRef(relation_uri)) )

    # Information about the dataset providing of the statement
    knowledge_provider_uri = URIRef('https://w3id.org/biolink/infores/knowledge-collaboratory')
    knowledge_source_uri = URIRef('https://w3id.org/um/OffLabelDrugIndications')
    # primary_source_uri = 'https://docs.google.com/spreadsheets/d/1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE/edit#gid=428566902'
    g.add( (association_uri, BIOLINK.aggregator_knowledge_source, knowledge_provider_uri) )
    # TODO: put in prov
    # g.add( (association_uri, BIOLINK['publications'], knowledge_source_uri) )

    # Infos about the indication evidence publication
    publication = row['URL Complete'].strip().replace('https://pubmed.ncbi.nlm.nih.gov/', 'http://www.ncbi.nlm.nih.gov/pubmed/')
    g.add( (association_uri, BIOLINK.publications, URIRef(publication) ) )

    # g.add( (association_uri, BIOLINK['description'], Literal(row['context'])) )
    g.add( (association_uri, RDFS.label, Literal(str(row['context']).strip())) )
    g.add( (association_uri, BIOLINK.has_population_context, study_context_uri) )

    # Target group in the related publication
    g.add( (study_context_uri, RDF.type, BIOLINK.Cohort) )
    g.add( (study_context_uri, BIOLINK.category, BIOLINK.Cohort) )
    g.add( (study_context_uri, RDFS.label, Literal(row['targetGroup'].strip())) )
    if (pd.notna(row['hasPhenotype'])):
        g.add( (study_context_uri, BIOLINK.has_phenotype, URIRef(row['hasPhenotype'].strip())) )

    # Types for drug and disease
    g.add( (drug_uri, RDF.type, BIOLINK.Drug) )
    g.add( (disease_uri, RDF.type, BIOLINK.Disease) )
    g.add( (drug_uri, BIOLINK.category, BIOLINK.Drug) )
    g.add( (disease_uri, BIOLINK.category, BIOLINK.Disease) )
    # Add labels for drug and disease
    g.add( (drug_uri, RDFS.label, Literal(row['drugbank_name'].strip())) )
    g.add( (disease_uri, RDFS.label, Literal(row['mondo_name'].strip())) )

    # Add template in pub info
    pubinfo = Graph()
    pubinfo.add( (
        URIRef('http://purl.org/nanopub/temp/mynanopub#'),
        URIRef('https://w3id.org/np/o/ntemplate/wasCreatedFromTemplate'),
        URIRef('http://purl.org/np/RAhNHZw6Urw_Mccs4qy6Ws3C9CRuaHpQx8AwuApbWkqnY')
    ) )
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
    # prov.add( (
    #     NP['assertion'],
    #     DCTERMS.created,
    #     Literal(CREATION_TIME, datatype=XSD.dateTime, normalize=False)
    # ) )
    # prov.add( (
    #     NP['assertion'],
    #     PROV.hadPrimarySource,
    #     knowledge_source_uri
    # ) )

    publication = np_client.create_nanopub(
        assertion_rdf=g,
        provenance_rdf=prov,
        pubinfo_rdf=pubinfo,
    )

    if args.publish:
        published_info = np_client.publish(publication)
        print(published_info['nanopub_uri'])
    else:
        print(publication._rdf.serialize(format='trig'))
        signed_file = np_client.sign(publication)
        published_info = {'nanopub_uri': f'http://np#{str(len(np_list))}'}

    np_list.append(published_info['nanopub_uri'])
    print(str(len(np_list)))

    if len(np_list) == 1:
        print('🔬 One of the nanopub published:')
        # print(publication._rdf.serialize(format='trig').decode('utf-8'))
        print(publication._rdf.serialize(format='trig'))

        if args.validate:
            # Validate the 1st with ShEx
            shex_validation(
                g,
                start=str(BIOLINK.ChemicalToDiseaseOrPhenotypicFeatureAssociation),
                focus=str(association_uri)
                # start=str(BIOLINK.Drug),
                # focus=str(URIRef('http://identifiers.org/drugbank/DB01148'))
            )

    if not args.publish and len(np_list) >= 10:
        break

# Print the list of published np URIs in case we need to reuse it to republish the np index
print('["' + '", "'.join(np_list) + '"]')

print(f'🛎️  {str(len(np_list))} drug indications has been processed')

np_index = np_client.create_nanopub_index(
    np_list,
    title="Off-label drug indications dataset",
    description="""A dataset of 327 off-label drug indications found in PubMed articles. With additional information on the context of the indications, such as the target group age range (adult/children), or if the target group has a specific phenotype.
Drugs are identified by their DrugBank IDs, and conditions are identified by their MONDO, EFO, or HPO IDs.
Curated by Ricardo de Miranda Azevedo. See https://github.com/MaastrichtU-IDS/off-label-drug-indications-dataset for more details.""",
    see_also="https://github.com/MaastrichtU-IDS/off-label-drug-indications-dataset",
    creators=[CREATOR_ORCID],
    creation_time="2021-10-02T00:00:00",
    nanopub_config=NanopubConfig(
        add_prov_generated_time=False,
    ),
)

if args.publish:
    index_uri = np_client.publish(np_index)
else:
    print(np_index._rdf.serialize(format='trig'))
    index_uri = np_client.sign(np_index)

print('✅ Published Nanopub Index:')
print(index_uri)