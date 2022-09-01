import argparse

import pandas as pd
from nanopub import NanopubClient, Publication
from pyshex import ShExEvaluator

# from rdflib import Graph, Namespace, URIRef, Literal, RDF, FOAF, RDFS, XSD
# from nanopub import Publication, NanopubClient
from rdflib import FOAF, RDF, RDFS, XSD, Graph, Literal, Namespace, URIRef

# Get arguments
parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--publish', action='store_true',
                    help='Publish nanopubs (default: False)')
parser.add_argument('--count', default=1, help='Publish nanopubs (default: 1)')
parser.add_argument('--validate', action='store_true',
                    help='Validate nanopubs wih PyShEx (default: False)')
args = parser.parse_args()

# https://docs.google.com/spreadsheets/d/1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE/edit#gid=1574253813
googledocs_id = '1fCykLEgAd2Z7nC9rTcW296KtBsFBBZMD8Yghcwv4WaE'
sheet = 'Load'

# Build URL to download CSV from google docs
googledocs_url = 'https://docs.google.com/spreadsheets/d/' + googledocs_id + '/gviz/tq?tqx=out:csv&sheet=' + sheet

# Load csv to a pandas dataframe from the URL
df = pd.read_csv(googledocs_url)
# .fillna(value = 0)
# Read from local to dev faster:
# df = pd.read_csv('data/data.csv')

print(df)

# Initialize the nanopub client using the encrypted keys in the ~/.nanopub folder
np_client = NanopubClient()


BIOLINK = Namespace("https://w3id.org/biolink/vocab/")
NP = Namespace("http://purl.org/nanopub/temp/mynanopub#")
association_uri = NP['association']
study_context_uri = NP['context']
# shex = str(requests.get('https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex').content)

count = 0
for index, row in df.iterrows():
    if (row['nanopub'] == 0):
        # Build the nanopub with a RDFLib Graph
        g = Graph()
        g.bind("biolink", URIRef('https://w3id.org/biolink/vocab/'))
        g.add( (association_uri, RDF.type, RDF.Statement ) )
        g.add( (association_uri, RDFS.label, Literal(row['context'])) )

        # Add drug as subject
        drug_uri = URIRef('https://identifiers.org/DRUGBANK:' + row['drugbank_id'])
        # drug_uri = URIRef('http://identifiers.org/drugbank/' + row['drugbank_id'])
        g.add( (association_uri, RDF.subject, drug_uri) )

        # Add disease as object (use OBO or identifiergs.org URI? http://purl.obolibrary.org/obo/MONDO_0002491)
        # disease_uri = URIRef('https://identifiers.org/' + row['mondo_id'].replace('_', ':'))
        disease_uri = URIRef(row['mondo_URL'].strip())
        g.add( (association_uri, RDF.object, disease_uri) )

        # Define predicate/relation: BioLink treats/OffLabel drug indication?
        g.add( (association_uri, RDF.predicate, BIOLINK['treats']) )
        relation_uri = 'https://w3id.org/um/neurodkg/OffLabelIndication'
        g.add( (association_uri, BIOLINK['relation'], URIRef(relation_uri)) )

        # Information about the dataset providing of the statement
        provider_uri = 'https://w3id.org/um/NeuroDKG'
        g.add( (association_uri, BIOLINK['provided_by'], URIRef(provider_uri)) )

        # Infos about the indication evidence publication
        g.add( (association_uri, BIOLINK['publications'], URIRef(row['URL Complete'])) )
        # g.add( (association_uri, BIOLINK['description'], Literal(row['context'])) )
        g.add( (association_uri, RDFS.label, Literal(row['context'])) )
        g.add( (association_uri, BIOLINK['has_population_context'], study_context_uri) )

        # Target group in the related publication
        g.add( (study_context_uri, RDF.type, BIOLINK['Cohort']) )
        g.add( (study_context_uri, RDFS.label, Literal(row['targetGroup'])) )
        if (pd.notna(row['hasPhenotype'])):
            print(row['hasPhenotype'])
            g.add( (study_context_uri, BIOLINK['has_phenotype'], URIRef(row['hasPhenotype'])) )

        # Types for drug and disease
        g.add( (drug_uri, BIOLINK['category'], BIOLINK['Drug']) )
        g.add( (disease_uri, BIOLINK['category'], BIOLINK['Disease']) )
        # g.add( (drug_uri, RDF.type, BIOLINK['Drug']) )
        # g.add( (disease_uri, RDF.type, BIOLINK['Disease']) )
        # Add labels?
        # g.add( (drug_uri, RDFS.label, Literal(row['drugbank_name'])) )
        # g.add( (disease_uri, RDFS.label, Literal(row['mondo_name'])) )

        if args.validate:
            # Validate with ShEx
            print('Running ShEx validation...')
            results = ShExEvaluator().evaluate(
                g, 
                'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex',
                # focus='http://purl.org/nanopub/temp/mynanopub#association',
                focus='https://w3id.org/biolink/vocab/Drug',
                start='https://w3id.org/biolink/vocab/Drug',
            )
            for r in results:
                if r.result:
                    print("ShEx PASS")
                else:
                    print(f"ShEx FAIL:\n {r.reason}")

        # Add template in pub info
        pubinfo = Graph()
        pubinfo.add( (
            URIRef('http://purl.org/nanopub/temp/mynanopub#'), 
            URIRef('https://w3id.org/np/o/ntemplate/wasCreatedFromTemplate'), 
            URIRef('http://purl.org/np/RAhNHZw6Urw_Mccs4qy6Ws3C9CRuaHpQx8AwuApbWkqnY')
        ) )
        publication = Publication.from_assertion(
            assertion_rdf=g,
            pubinfo_rdf=pubinfo
        )
        # print(g.serialize(format='turtle'))
        if args.publish:
            print("Publishing the nanopub")
            if count < int(args.count):
                print('Publish nanopub ' + str(count))
                publication_info = np_client.publish(publication)
                print(publication_info)
            else:
                break
        else:
            print(publication)
            print("Dry run, not publishing the Nanopub. Add --publish to publish")
            break
        count = count + 1

print(str(count) + ' drug indications has been processed')