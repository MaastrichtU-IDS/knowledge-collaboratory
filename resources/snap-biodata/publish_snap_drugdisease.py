import pandas as pd 
from nanopub import Publication, NanopubClient
from rdflib import Graph, Namespace, URIRef, Literal, RDF, FOAF, RDFS

BIOLINK = Namespace("https://w3id.org/biolink/vocab/")
SKOS = Namespace("http://www.w3.org/2004/02/skos/core#")
SCHEMA = Namespace("http://schema.org/")
DCAT = Namespace("http://www.w3.org/ns/dcat#")
PROV = Namespace("http://www.w3.org/ns/prov#")
MLS = Namespace("http://www.w3.org/ns/mls#")

def main():
    # Create the client, that allows searching, fetching and publishing nanopubs
    np_client = NanopubClient()

    # Download and fix drugbank CURIE
    # TODO: check if all drugbank IDs
    url = 'https://snap.stanford.edu/biodata/datasets/10004/files/DCh-Miner_miner-disease-chemical.tsv.gz'
    data = pd.read_csv(url, sep='\t', header=0)
    data["Chemical"] = data["Chemical"].apply (lambda row: 'DRUGBANK:' + row)

    print(data)
    # data.to_csv('mined-disease-chemical-associations.csv', index=False, header=False)

    for index, row in data.iterrows(): 
        nanopub_uri = create_nanopub(np_client, row['Chemical'], row['# Disease(MESH)'])
        print(nanopub_uri)
        break


def create_nanopub(np_client, drug_id, disease_id):
    """Create a Nanopublication in RDF for a drug-disease association
    using the BioLink model
    """
    # Or: 1. construct a desired assertion (a graph of RDF triples)
    nanopub_rdf = Graph()
    nanopub_rdf.bind("biolink", URIRef('https://w3id.org/biolink/vocab/'))
    nanopub_rdf.bind("drugbank", URIRef('https://identifiers.org/DRUGBANK:'))
    nanopub_rdf.bind("pmid", URIRef('http://www.ncbi.nlm.nih.gov/pubmed/'))
    nanopub_rdf.bind("ro", URIRef('http://purl.obolibrary.org/obo/RO_'))
    nanopub_rdf.bind("mesh", URIRef('https://identifiers.org/MESH:'))

    drug_uri = URIRef('https://identifiers.org/' + drug_id)
    disease_uri = URIRef('https://identifiers.org/' + disease_id)
    
    association_uri = URIRef('https://w3id.org/um/collaboratory/snap-biodata/drug-disease/' + drug_id.replace(':', '_') + '_' + disease_id.replace(':', '_'))

    # BioLink do not require to define rdf:type, but we do it anyway
    nanopub_rdf.add( (drug_uri, RDF.type, BIOLINK['Drug'] ) )
    nanopub_rdf.add( (drug_uri, BIOLINK['category'], BIOLINK['Drug'] ) )

    nanopub_rdf.add( (disease_uri, RDF.type, BIOLINK['Disease'] ) )
    nanopub_rdf.add( (disease_uri, BIOLINK['category'], BIOLINK['Disease'] ) )

    # Generate triples for the association
    nanopub_rdf.add( (association_uri, RDF.subject, drug_uri ) )
    nanopub_rdf.add( (association_uri, RDF.object, disease_uri ) )

    nanopub_rdf.add( (association_uri, RDF.predicate, BIOLINK['affects'] ) )
    nanopub_rdf.add( (association_uri, BIOLINK['association_type'], BIOLINK['ChemicalToDiseaseOrPhenotypicFeatureAssociation']) )
    # nanopub_rdf.add( (association_uri, BIOLINK['relation'], URIRef("http://purl.obolibrary.org/obo/RO_0002606") ) )

    ## TODO: change provenance here
    nanopub_rdf.add( (association_uri, BIOLINK['provided_by'], URIRef("http://snap.stanford.edu/biodata") ) )
    # Recommended citation URL: http://snap.stanford.edu/biodata
    # Direct link: http://snap.stanford.edu/biodata/datasets/10004/10004-DCh-Miner.html

    publication = Publication.from_assertion(assertion_rdf=nanopub_rdf)
    # publication_info = np_client.publish(publication)
    
    publication_info = publication
    # print(nanopub_rdf.serialize('output/np_assertion.ttl', format='turtle'))

    return publication_info


main()