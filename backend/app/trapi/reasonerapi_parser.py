from SPARQLWrapper import SPARQLWrapper, POST, JSON
import urllib.request, json 

get_nanopubs_select_query = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
SELECT DISTINCT *
WHERE {
  graph ?np_assertion {
    ?association
      rdf:subject ?subject ;
      rdf:predicate ?predicate ;
      rdf:object ?object .
    OPTIONAL {
      ?association biolink:relation ?relation .
    }
    OPTIONAL {
      ?association biolink:provided_by ?provided_by .
    }
    OPTIONAL {
      ?association biolink:association_type ?association_type .
    }
    OPTIONAL {
      ?association biolink:publications ?publications .
    }
    OPTIONAL {
      ?association rdfs:label ?label .
    }
    OPTIONAL {
      ?association biolink:description ?description .
    }
    OPTIONAL {
      ?association biolink:has_population_context [
        rdfs:label ?has_population_context ;
        biolink:has_phenotype ?populationHasPhenotype ;
      ] .
    }
    {
      ?subject a ?subject_category .
      ?object a ?object_category .
    } UNION {
      ?subject biolink:category ?subject_category .
      ?object biolink:category ?object_category .
    }
  }
  ?_entity_filters
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}"""

get_metakg_edges_query = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
SELECT DISTINCT ?subject_category ?predicate_category ?object_category
WHERE {
  graph ?np_assertion {
    ?subject biolink:category ?subject_category .
    ?object biolink:category ?object_category .
    ?association
      rdf:subject ?subject ;
      rdf:predicate ?predicate_category ;
      rdf:object ?object .
    #{
    #  ?subject a ?subject_category .
    #  ?object a ?object_category .
    #} UNION {
    #  ?subject biolink:category ?subject_category .
    #  ?object biolink:category ?object_category .
    #}
  }
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}"""

get_metakg_prefixes_query = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
SELECT DISTINCT ?node_category ?node_prefix
WHERE {
  graph ?np_assertion {
    {
      ?association
        rdf:subject ?node ;
        rdf:predicate ?predicate_category ;
        rdf:object ?object .
    } UNION {
      ?association
        rdf:subject ?subject ;
        rdf:predicate ?predicate_category ;
        rdf:object ?node .
    }
    {
      ?node a ?node_category .
    } UNION {
      ?node biolink:category ?node_category .
    }
    BIND(UCASE(STRBEFORE(REPLACE(STRAFTER(str(?node), ":"), "//identifiers.org/", ""), ":")) AS ?node_prefix)
    FILTER(strlen(?node_prefix)>0)
  }
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}
"""


## Virtuoso SPARQL endpoint for the Nanopubs server at IDS
SPARQL_ENDPOINT_URL = 'http://virtuoso.np.dumontierlab.137.120.31.101.nip.io/sparql'

## Load BioLink JSON-LD Context to resolve URIs to BioLink CURIEs
# try:
with urllib.request.urlopen("https://raw.githubusercontent.com/biolink/biolink-model/master/context.jsonld") as url:
    data = json.loads(url.read().decode())
# except:
#   print('Error download BioLink model JSON-LD from GitHub')

namespace_resolver = {}
context = data['@context']
for prefix in context.keys():
    if isinstance(context[prefix], str):
        namespace_resolver[prefix] = context[prefix]

uri_resolver = {v: k for k, v in namespace_resolver.items()}
uri_resolver['https://identifiers.org/mim/'] = 'OMIM'
uri_resolver['https://identifiers.org/OMIM:'] = 'OMIM'
uri_resolver['https://identifiers.org/drugbank/'] = 'DRUGBANK'
uri_resolver['https://go.drugbank.com/drugs/'] = 'DRUGBANK'
uri_resolver['https://w3id.org/biolink/vocab/'] = 'biolink'
uri_resolver['http://w3id.org/biolink/vocab/'] = 'biolink'
uri_resolver['https://w3id.org/um/neurodkg/'] = 'neurodkg'
# http://www.ebi.ac.uk/efo/EFO_000985



def resolve_uri_with_context(uri_string):
    """Take an URI and return its CURIE form, using the BioLink JSON-LD Context previously loaded
    """
    for ns_uri in uri_resolver.keys():
        if uri_string.startswith('http://purl.obolibrary.org/obo/'): 
            # Handle OBO URIs
            return uri_string.replace('http://purl.obolibrary.org/obo/', '').replace('_', ':')
        elif uri_string.startswith(ns_uri):
            return uri_string.replace(ns_uri, uri_resolver[ns_uri] + ':')
        elif uri_string.startswith('https://identifiers.org/'):
            # To handle URIs generated by Nanobench templates
            return uri_string.replace('https://identifiers.org/', '')
    # If not found:
    return uri_string

def resolve_curie_to_identifiersorg(curie_string):
    """Take a CURIE and return the corresponding identifiers.org URI in the Nanopublication network
    using the BioLink JSON-LD Context previously loaded
    """
    # Quick fix to handle lowercase drugbank and omim
    if curie_string.startswith('drugbank:'):
      curie_string = curie_string.replace('drugbank:', 'DRUGBANK:')
    if curie_string.startswith('omim:'):
      curie_string = curie_string.replace('omim:', 'OMIM:')
    return 'https://identifiers.org/' + curie_string

def get_predicates_from_nanopubs():
    """Query the Nanopublications network to get BioLink entity categories and the relation between them
    Formatted for the Translator TRAPI /predicate get call
    """
    # TODO: Update to the meta_knowledge_graph for TRAPI 3.1.0
    predicates = {}
    # Run query to get types and relations between them
    sparql = SPARQLWrapper(SPARQL_ENDPOINT_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(get_metakg_edges_query)
    sparqlwrapper_results = sparql.query().convert()
    sparql_results = sparqlwrapper_results["results"]["bindings"]
    for result in sparql_results:
        np_subject = resolve_uri_with_context(result['subject_category']['value'])
        np_predicate = resolve_uri_with_context(result['predicate_category']['value'])
        np_object = resolve_uri_with_context(result['object_category']['value'])
        if not predicates.get(np_subject):
            predicates[np_subject] = {}

        if not predicates[np_subject].get(np_object):
            predicates[np_subject][np_object] = []
        if not np_predicate in predicates[np_subject][np_object]:
            predicates[np_subject][np_object].append(np_predicate)

    return predicates

def get_metakg_from_nanopubs():
    """Query the Nanopublications network to get BioLink entity categories and the relation between them
    Formatted for the Translator TRAPI /predicate get call
    """
    # TODO: Update to the meta_knowledge_graph for TRAPI 3.1.0
    predicates = {}
    # Run query to get types and relations between them
    sparql = SPARQLWrapper(SPARQL_ENDPOINT_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(get_metakg_edges_query)
    print(get_metakg_edges_query)
    sparqlwrapper_results = sparql.query().convert()
    sparql_results = sparqlwrapper_results["results"]["bindings"]
    edges_array = []
    for result in sparql_results:
        edges_array.append({
            "subject": resolve_uri_with_context(result['subject_category']['value']),
            "predicate": resolve_uri_with_context(result['predicate_category']['value']),
            "object": resolve_uri_with_context(result['object_category']['value'])
        })

    sparql.setQuery(get_metakg_prefixes_query)
    sparqlwrapper_results = sparql.query().convert()
    prefixes_results = sparqlwrapper_results["results"]["bindings"]
    nodes_obj = {}
    for result in prefixes_results:
        node_category = resolve_uri_with_context(result['node_category']['value'])
        if node_category not in nodes_obj.keys():
            nodes_obj[node_category] = {
                "id_prefixes": [ result['node_prefix']['value'] ]
            }
        else:
            nodes_obj[node_category]['id_prefixes'].append(result['node_prefix']['value'])

    return {'edges': edges_array, 'nodes': nodes_obj}


def reasonerapi_to_sparql(reasoner_query):
    """Convert an array of predictions objects to ReasonerAPI format
    Run the get_predict to get the QueryGraph edges and nodes
    {disease: OMIM:1567, drug: DRUGBANK:DB0001, score: 0.9}

    :param: reasoner_query Query from Reasoner API
    :return: Results as ReasonerAPI object
    """
    query_graph = reasoner_query["message"]["query_graph"]
    query_options = {}
    n_results = None
    if 'query_options' in reasoner_query.keys():
        query_options = reasoner_query["query_options"]
        if 'n_results' in query_options:
            n_results = int(query_options["n_results"])

    if len(query_graph["edges"]) != 1:
        return {'error': len(query_graph["edges"]) + """ edges have been provided. 
            This API currently only implements 1 hop queries (with 1 edge query_graph). 
            Contact us if you are interested in running multiple hop queries"""}
    
    sparql_query_get_nanopubs = get_nanopubs_select_query
    predicate_edge_id = ''
    subject_node_id = ''
    object_node_id = ''

    for edge_id in query_graph['edges'].keys():
        edge_props = query_graph['edges'][edge_id]
        predicate_edge_id = edge_id
        subject_node_id = edge_props['subject']
        object_node_id = edge_props['object']
        
        entity_filters = ''
        try:
          predicate_curies = edge_props['predicates']
          if not isinstance(predicate_curies, list):
            predicate_curies = [ predicate_curies ]
          predicate_curies = list(map(lambda curie: '?predicate = ' +  curie, predicate_curies))
          predicate_curies = ' || '.join('?predicate = ' + predicate_curies)
          entity_filters = entity_filters + 'FILTER ( ' + predicate_curies + ' )\n'
        except:
          pass

        try:
          subject_categories = query_graph['nodes'][edge_props['subject']]['categories']
          if not isinstance(subject_categories, list):
            subject_categories = [ subject_categories ]
          subject_categories = list(map(lambda curie: '?subject_category = ' +  curie, subject_categories))
          subject_categories = ' || '.join(subject_categories)
          entity_filters = entity_filters + 'FILTER ( ' + subject_categories + ' )\n'
        except:
          pass

        try:
          object_categories = query_graph['nodes'][edge_props['object']]['categories']
          if not isinstance(object_categories, list):
            object_categories = [ object_categories ]
          object_categories = list(map(lambda curie: '?object_category = ' +  curie, object_categories))
          object_categories = ' || '.join(object_categories)
          entity_filters = entity_filters + 'FILTER ( ' + object_categories + ' )\n'
        except:
          pass

        # Resolve provided CURIE to https://identifiers.org/CURIE
        try:
          subject_curies = query_graph['nodes'][edge_props['subject']]['ids']
          subject_curies = list(map(lambda curie: '?subject = <' +  resolve_curie_to_identifiersorg(curie) + '>', subject_curies))
          subject_curies = ' || '.join(subject_curies)
          entity_filters = entity_filters + 'FILTER ( ' + subject_curies + ' )\n'
        except:
          pass
        
        try:
          object_curies = query_graph['nodes'][edge_props['object']]['ids']
          object_curies = list(map(lambda curie: '?object = <' +  resolve_curie_to_identifiersorg(curie) + '>', object_curies))
          object_curies = ' || '.join(object_curies)
          entity_filters = entity_filters + 'FILTER ( ' + object_curies + ' )\n'
        except:
          pass
        sparql_query_get_nanopubs = sparql_query_get_nanopubs.replace('?_entity_filters', entity_filters)

    # Add LIMIT to the SPARQL query if n_results provided
    if n_results:
        sparql_query_get_nanopubs = sparql_query_get_nanopubs + ' LIMIT ' + str(n_results)

    knowledge_graph = {'nodes': {}, 'edges': {}}
    query_results = []
    kg_edge_count = 0

    print('Running the following SPARQL query to retrieve nanopublications from ' + SPARQL_ENDPOINT_URL)
    print(sparql_query_get_nanopubs)
    sparql = SPARQLWrapper(SPARQL_ENDPOINT_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(sparql_query_get_nanopubs)
    sparqlwrapper_results = sparql.query().convert()
    sparql_results = sparqlwrapper_results["results"]["bindings"]

    # Check current official example of Reasoner query results: https://github.com/NCATSTranslator/ReasonerAPI/blob/master/examples/Message/simple.json
    # Now iterates the Nanopubs SPARQL query results:
    for edge_result in sparql_results:
        edge_uri = edge_result['association']['value']
        # Create edge object in knowledge_graph
        knowledge_graph['edges'][edge_uri] = {
            'predicate': resolve_uri_with_context(edge_result['predicate']['value']),
            'subject': resolve_uri_with_context(edge_result['subject']['value']),
            'object': resolve_uri_with_context(edge_result['object']['value']),
            'attributes': [
                {
                    'attribute_type_id': 'biolink:aggregator_knowledge_source',
                    'value': 'infores:knowledge-collaboratory',
                    'value_type_id': 'biolink:InformationResource',
                    'attribute_source': 'infores:knowledge-collaboratory',
                    'value_url': 'https://api.collaboratory.semanticscience.org/query'
                }
            ]
        }
        if 'relation' in edge_result:
          # knowledge_graph['edges'][edge_uri]['relation'] = resolve_uri_with_context(edge_result['relation']['value'])
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:relation',
              'value': resolve_uri_with_context(edge_result['relation']['value'])
          })
        if 'publications' in edge_result:
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:publications',
              'value': resolve_uri_with_context(edge_result['publications']['value'])
          })
        
        if 'label' in edge_result:
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:name',
              'value': resolve_uri_with_context(edge_result['label']['value'])
          })
        if 'description' in edge_result:
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:description',
              'value': resolve_uri_with_context(edge_result['description']['value']),
              # 'value_type_id': 'biolink:Cohort',
          })

        if 'has_population_context' in edge_result:
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:has_population_context',
              'value': resolve_uri_with_context(edge_result['has_population_context']['value']),
              # 'value_type_id': 'biolink:Cohort',
          })
        
        if 'populationHasPhenotype' in edge_result:
          # TODO: fix the key
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:has_phenotype',
              'value': resolve_uri_with_context(edge_result['populationHasPhenotype']['value']),
              # 'value_type_id': 'biolink:Phenotype',
          })
        
        # if edge_result['association_type']:
        #   knowledge_graph['edges'][edge_uri]['association_type'] = resolve_uri_with_context(edge_result['association_type']['value'])

        if edge_result['provided_by']:
          # Add provided_by attribute
          knowledge_graph['edges'][edge_uri]['attributes'].append({
              'attribute_type_id': 'biolink:provided_by',
              'value': resolve_uri_with_context(edge_result['provided_by']['value']),
              # 'value_type_id': 'biolink:Agent',
          })

        knowledge_graph['nodes'][resolve_uri_with_context(edge_result['subject']['value'])] = {
            'categories': [resolve_uri_with_context(edge_result['subject_category']['value'])]
        }
        knowledge_graph['nodes'][resolve_uri_with_context(edge_result['object']['value'])] = {
            'categories': [resolve_uri_with_context(edge_result['object_category']['value'])]
        }

        # Add the bindings to the results object
        result = {'edge_bindings': {}, 'node_bindings': {}}
        result['edge_bindings'][predicate_edge_id] = [
            {
                "id": edge_uri
            }
        ]
        result['node_bindings'][subject_node_id] = [
            {
                "id": resolve_uri_with_context(edge_result['subject']['value'])
            }
        ]
        result['node_bindings'][object_node_id] = [
            {
                "id": resolve_uri_with_context(edge_result['object']['value'])
            }
        ]
        query_results.append(result)

        kg_edge_count += 1
    
    return {'message': {'knowledge_graph': knowledge_graph, 'query_graph': query_graph, 'results': query_results}}


array_json = {
  "message": {
    "query_graph": {
      "edges": {
        "e01": {
          "object": "n1",
          "predicate": ["biolink:treated_by", "biolink:treats"],
          "subject": "n0"
        }
      },
      "nodes": {
        "n0": {
          "category": ["biolink:ChemicalSubstance", "biolink:Drug"],
          "id": ["CHEBI:75725", "DRUGBANK:DB00394"]
        },
        "n1": {
          "category": ["biolink:Drug", "biolink:Disease"]
        }
      }
    }
  }
}

## Get for rdf:type and biolink:category
# get_metakg_edges_query = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
# PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
# PREFIX biolink: <https://w3id.org/biolink/vocab/>
# PREFIX np: <http://www.nanopub.org/nschema#>
# PREFIX npx: <http://purl.org/nanopub/x/>
# SELECT DISTINCT ?subject_category ?predicate_category ?object_category
# WHERE {
#   graph ?np_assertion {
#     ?association
#       rdf:subject ?subject ;
#       rdf:predicate ?predicate_category ;
#       rdf:object ?object .
#     {
#       ?subject a ?subject_category .
#       ?object a ?object_category .
#     } UNION {
#       ?subject biolink:category ?subject_category .
#       ?object biolink:category ?object_category .
#     }
#   }
#   graph ?np_head {
#     ?np_uri np:hasAssertion ?np_assertion .
#   }
#   FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
# }"""