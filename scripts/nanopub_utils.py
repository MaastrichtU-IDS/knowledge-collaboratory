from typing import List

from nanopub import NanopubClient, Publication
from pyshex import ShExEvaluator
from rdflib import FOAF, RDF, RDFS, XSD, Graph, Literal, Namespace, URIRef
from rdflib.namespace import DC, DCTERMS, PROV, RDFS, VOID, XSD

BIOLINK = Namespace("https://w3id.org/biolink/vocab/")
SKOS = Namespace("http://www.w3.org/2004/02/skos/core#")
SCHEMA = Namespace("http://schema.org/")
DCAT = Namespace("http://www.w3.org/ns/dcat#")
# PROV = Namespace("http://www.w3.org/ns/prov#")
PAV = Namespace("http://purl.org/pav/")
MLS = Namespace("http://www.w3.org/ns/mls#")
NPX = Namespace("http://purl.org/nanopub/x/")
NP = Namespace("http://purl.org/nanopub/temp/mynanopub#")
NP_URI = URIRef("http://purl.org/nanopub/temp/mynanopub#")


def init_graph() -> Graph:
  """Initialize a RDFLib Graph with popular namespaces pre-bound"""
  g = Graph()
  g.bind("biolink", BIOLINK)
  g.bind("pav", PAV)
  g.bind("prov", PROV)
  g.bind("drugbank", URIRef('http://identifiers.org/drugbank/'))
  g.bind("pmid", URIRef('http://www.ncbi.nlm.nih.gov/pubmed/'))
  g.bind("ro", URIRef('http://purl.obolibrary.org/obo/RO_'))
  g.bind("omim", URIRef('http://purl.obolibrary.org/obo/OMIM_'))
  g.bind("mondo", URIRef('http://purl.obolibrary.org/obo/MONDO_'))
  g.bind("ncit", URIRef('http://purl.obolibrary.org/obo/NCIT_'))
  g.bind("hp", URIRef('http://purl.obolibrary.org/obo/HP_'))
  g.bind("efo", URIRef('http://www.ebi.ac.uk/efo/EFO_'))
  g.bind("orcid", URIRef('https://orcid.org/'))
  g.bind("ntemplate", URIRef('https://w3id.org/np/o/ntemplate/'))
  g.bind("infores", URIRef('https://w3id.org/biolink/infores/'))
  return g


def shex_validation(g: Graph, focus: str, start: str = None):
  print(f'⏳️ Running ShEx validation with start node {start} and focus node {focus}...')
  results = ShExEvaluator().evaluate(
      g,
      'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex',
      # focus='http://purl.org/nanopub/temp/mynanopub#association',
      start=start, # type of the shape in the ShEx schema to test against
      focus=focus, # subject to test in the graph
  )
  for r in results:
      if r.result:
          print("✅ ShEx PASS")
      else:
          raise Exception(f"❌ Shex validation failed:\n {r.reason}")


# cf. https://purl.org/np/RAzPytdERsBd378zHGvwgRbat1MCiS7QrxNrPxe9yDu6E
def create_nanopub_index(
  np_client: NanopubClient,
  np_list: List[str],
  title: str,
  description: str,
  creation_time: str,
  creators: List[str],
  see_also: str = None,
  publish: bool = False
) -> str:
    assertion = init_graph()

    for np in np_list:
        assertion.add( (NP_URI, NPX.includesElement, URIRef(np)) )

    pubinfo = init_graph()
   
    pubinfo.add( (
        NP_URI,
        RDF.type,
        NPX.NanopubIndex
    ) )
    pubinfo.add( (
        NP_URI,
        DC.title,
        Literal(title)
    ) )
    pubinfo.add( (
        NP_URI,
        DC.description,
        Literal(description)
    ) )
    if see_also:
      pubinfo.add( (
          NP_URI,
          RDFS.seeAlso,
          URIRef(see_also)
      ) )
    for creator in creators:
        pubinfo.add( (
            NP_URI,
            PAV.createdBy,
            URIRef(creator)
        ) )
    # TODO: time_created = datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
    pubinfo.add( (
        NP_URI,
        DCTERMS.created,
        Literal(creation_time, datatype=XSD.dateTime, normalize=False)
    ) )

    prov = Graph()
    prov.add( (
        NP.assertion,
        RDF.type,
        NPX.IndexAssertion
    ) )

    publication = Publication.from_assertion(
        assertion_rdf=assertion,
        pubinfo_rdf=pubinfo,
        provenance_rdf=prov,
        # assertion_attributed_to=URIRef('https://orcid.org/0000-0003-4904-631X')
    )

    if publish:
        publication_info = np_client.publish(publication)
    else:
        publication_info = "🏜️  Dry run, not publishing the Nanopub Index. Add --publish to publish"
        # print(publication._rdf.serialize(format='trig').decode('utf-8'))
        print(publication._rdf.serialize(format='trig'))

    return publication_info





# Example to publish a nanopub about to comment an edge with an evidence
def publish_edge_comment(edge_to_comment, comment, negated, evidence, dryrun=True):
  np_client = NanopubClient()
  BIOLINK = Namespace("https://w3id.org/biolink/vocab/")
  NP = Namespace("http://purl.org/nanopub/temp/mynanopub#")
  nanopub_rdf = Graph()
  nanopub_rdf.bind("biolink", URIRef('https://w3id.org/biolink/vocab/'))

  # Add edge data
  edge_uri = NP['edge']
  # nanopub_rdf.add( (edge_uri, RDF.type, RDF.Statement ) )
  for prop, value in edge_to_comment.items():
      nanopub_rdf.add( (edge_uri, BIOLINK[prop], Literal(value) ) )

  # Add user comment
  comment_uri = NP['comment']
  nanopub_rdf.add( (comment_uri, RDF.type, RDF.Statement ) )
  nanopub_rdf.add( (comment_uri, RDFS.comment, Literal(comment) ) )
  nanopub_rdf.add( (comment_uri, BIOLINK['source'], edge_uri ) )
  nanopub_rdf.add( (comment_uri, BIOLINK['negated'], Literal(negated,datatype=XSD.boolean) ) )
  nanopub_rdf.add( (comment_uri, BIOLINK['has_evidence'], URIRef(evidence) ) )

  # print(nanopub_rdf.serialize(format='turtle'))
  publication = Publication.from_assertion(assertion_rdf=nanopub_rdf)
  if dryrun == False:
    publication_info = np_client.publish(publication)
  else:
    print("Dry run, not publishing the Nanopub. Add dryrun=False to the function args to publish")
  return publication