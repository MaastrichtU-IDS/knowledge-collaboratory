from nanopub import NanopubClient, Publication
from rdflib import FOAF, RDF, RDFS, Graph, Literal, Namespace, URIRef
from SPARQLWrapper import TURTLE, XML, SPARQLWrapper

# import requests
# import functools
# import shutil

BIOLINK = Namespace("https://w3id.org/biolink/vocab/")

SKOS = Namespace("http://www.w3.org/2004/02/skos/core#")
SCHEMA = Namespace("http://schema.org/")
DCAT = Namespace("http://www.w3.org/ns/dcat#")
PROV = Namespace("http://www.w3.org/ns/prov#")
MLS = Namespace("http://www.w3.org/ns/mls#")


# def create_drug_indic_nanopub(np_client, drug_id, disease_id):
#     """Create a Nanopublication in RDF for a drug indication using the BioLink model
#     """
#     # Or: 1. construct a desired assertion (a graph of RDF triples)
#     nanopub_rdf = Graph()
#     nanopub_rdf.bind("bl", URIRef('https://w3id.org/biolink/vocab/'))

#     drug_uri = URIRef('https://identifiers.org/drugbank/' + drug_id)
#     disease_uri = URIRef('https://identifiers.org/mim/' + str(disease_id))
#     association_uri = URIRef('https://w3id.org/um/neurodkg/' + drug_id + '_OMIM' + str(disease_id))

#     # BioLink do not require to define rdf:type, but come on...
#     nanopub_rdf.add( (drug_uri, RDF.type, BIOLINK['Drug'] ) )
#     nanopub_rdf.add( (drug_uri, BIOLINK['category'], BIOLINK['Drug'] ) )

#     nanopub_rdf.add( (disease_uri, RDF.type, BIOLINK['Disease'] ) )
#     nanopub_rdf.add( (disease_uri, BIOLINK['category'], BIOLINK['Disease'] ) )

#     # Generate triples for the association
#     nanopub_rdf.add( (association_uri, RDF.subject, drug_uri ) )
#     nanopub_rdf.add( (association_uri, RDF.object, disease_uri ) )

#     nanopub_rdf.add( (association_uri, RDF.predicate, BIOLINK['treats'] ) )
#     nanopub_rdf.add( (association_uri, BIOLINK['association_type'], BIOLINK['ChemicalToDiseaseOrPhenotypicFeatureAssociation']) )

#     nanopub_rdf.add( (association_uri, BIOLINK['provided_by'], URIRef("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3159979") ) )
#     nanopub_rdf.add( (association_uri, BIOLINK['relation'], URIRef("http://purl.obolibrary.org/obo/RO_0002606") ) )
    

#     # https://identifiers.org/drugbank/DB01148
#     # https://identifiers.org/mim/231200

#     publication = Publication.from_assertion(assertion_rdf=nanopub_rdf)
#     publication_info = np_client.publish(publication)
#     # publication_info = publication
#     # print(nanopub_rdf.serialize('output/np_assertion.ttl', format='turtle'))
#     return publication_info




# Create the client, that allows searching, fetching and publishing nanopubs
np_client = NanopubClient()

# results = np_client.find_nanopubs_with_text('fair')
# results = np_client.find_nanopubs_with_pattern(
    # obj='http://w3id.org/biolink/treats'
    # obj='https://w3id.org/biolink/treats'
results = np_client.find_valid_signed_nanopubs_with_pattern(
    obj='https://w3id.org/biolink/vocab/treats'
)
print(results)

count = 0
for nanopub in results:
    count += 1
    print(nanopub['np'])
    # np_client.retract(nanopub['np'])
    # np_client.retract(nanopub['np'])

print(str(count) + ' nanopublications')

# url = 'https://raw.githubusercontent.com/MaastrichtU-IDS/translator-openpredict/master/openpredict/data/resources/openpredict-omim-drug.csv'

# data = pd.read_csv(url)

# for index, row in data.iterrows(): 
#     nanopub_uri = create_drug_indic_nanopub(np_client, row['drugid'], row['omimid'])
#     print(nanopub_uri)



# global DATA_DIR
# DATA_DIR = os.getenv('TRAPI_DATA_DIR')
# if not DATA_DIR:
#     # Output data folder in current dir if not provided via environment variable
#     DATA_DIR = os.getcwd() + '/output/'
# else:
#     if not DATA_DIR.endswith('/'):
#         DATA_DIR += '/'

