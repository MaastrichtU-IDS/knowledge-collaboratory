import json
import urllib.request

import requests
from app.config import settings
from SPARQLWrapper import JSON, SPARQLWrapper

KNOWLEDGE_PROVIDER = "https://w3id.org/biolink/infores/knowledge-collaboratory"


# Query to get nanopublications that uses the older BioLink model (NeuroDKG)
select_np_query_old = (
    """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX infores: <https://w3id.org/biolink/infores/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
PREFIX npa: <http://purl.org/nanopub/admin/>
SELECT DISTINCT ?association ?subject ?predicate ?object ?subject_category ?object_category
    ?primary_knowledge_source ?provided_by ?publications
    ?label ?description ?population_has_phenotype ?has_population_context
WHERE {
  graph ?np_assertion {
    ?association
      biolink:aggregator_knowledge_source <"""
    + KNOWLEDGE_PROVIDER
    + """> ;
      rdf:subject ?subject ;
      rdf:predicate ?predicate ;
      rdf:object ?object .
    OPTIONAL {
      ?association biolink:primary_knowledge_source ?primary_knowledge_source .
    }
    OPTIONAL {
      ?association biolink:provided_by ?provided_by .
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
      ?association biolink:has_population_context|biolink:population_context_qualifier [
        rdfs:label ?has_population_context ;
        biolink:has_phenotype ?population_has_phenotype ;
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
  ?_prov_block
  ?_np_index_filter
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion ;
      np:hasProvenance ?np_prov .
  }
  graph npa:graph {
    ?np_uri npa:hasValidSignatureForPublicKey ?pubkey .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}"""
)

select_np_query = (
    """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX infores: <https://w3id.org/biolink/infores/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
PREFIX npa: <http://purl.org/nanopub/admin/>
SELECT DISTINCT ?association ?subject ?predicate ?object ?subject_category ?object_category
    ?primary_knowledge_source ?primary_upstream_resource_ids ?primary_source_record_urls
    ?supporting_data_source ?supporting_upstream_resource_ids ?supporting_source_record_urls
    ?attribute_type ?attribute_provider ?attribute_value
    ?qualifier ?qualifier_value
    ?label ?description ?population_has_phenotype ?has_population_context ?provided_by ?publications
WHERE {
  graph ?np_assertion {
    ?association biolink:subject ?subject ;
      biolink:predicate ?predicate ;
      biolink:object ?object .
    OPTIONAL {
      ?association biolink:primary_knowledge_source ?pks .
      ?pks biolink:resource_id ?primary_knowledge_source .
      OPTIONAL { ?pks biolink:upstream_resource_ids ?primary_upstream_resource_ids . }
      OPTIONAL { ?pks biolink:source_record_urls ?primary_source_record_urls . }
    }
    OPTIONAL {
      ?association biolink:supporting_data_source ?sks .
      ?sds biolink:resource_id ?supporting_data_source .
      OPTIONAL { ?sds biolink:upstream_resource_ids ?supporting_upstream_resource_ids . }
      OPTIONAL { ?sds biolink:source_record_urls ?supporting_source_record_urls . }
    }
    OPTIONAL {
      ?association biolink:has_attribute [
        biolink:has_attribute_type ?attribute_type ;
        biolink:provided_by ?attribute_provider ;
        biolink:value ?attribute_value
      ]
    }
    OPTIONAL {
      ?association biolink:publications ?publications .
    }
    OPTIONAL {
      ?association biolink:provided_by ?provided_by .
    }
    OPTIONAL {
      ?association biolink:publications ?publications .
    }
    OPTIONAL {
      ?association biolink:name ?label .
    }
    OPTIONAL {
      ?association biolink:description ?description .
    }
    OPTIONAL {
      ?association biolink:has_population_context|biolink:population_context_qualifier [
        rdfs:label ?has_population_context ;
        biolink:has_phenotype ?population_has_phenotype ;
      ] .
    }
    {
      ?subject a ?subject_category .
      ?object a ?object_category .
    } UNION {
      ?subject biolink:category ?subject_category .
      ?object biolink:category ?object_category .
    }
    VALUES ?qualifier {
        biolink:qualified_predicate biolink:subject_aspect_qualifier biolink:object_aspect_qualifier biolink:subject_direction_qualifier biolink:object_direction_qualifier
        biolink:subject_part_qualifier biolink:object_part_qualifier biolink:subject_context_qualifier biolink:subject_part_qualifier biolink:object_part_qualifier biolink:object_context_qualifier
        biolink:population_context_qualifier biolink:temporal_context_qualifier biolink:form_or_variant_qualifier
        biolink:derivative_qualifier biolink:statement_qualifier
        biolink:frequency_qualifier biolink:severity_qualifier biolink:sex_qualifier biolink:onset_qualifier
    }
    OPTIONAL { ?association ?qualifier ?qualifier_value . }
  }
  ?_entity_filters
  ?_prov_block
  ?_np_index_filter
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion ;
      np:hasProvenance ?np_prov .
  }
  graph npa:graph {
    ?np_uri npa:hasValidSignatureForPublicKey ?pubkey .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}"""
)

get_metakg_edges_query = (
    """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX infores: <https://w3id.org/biolink/infores/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
SELECT DISTINCT ?subject_category ?predicate_category ?object_category
WHERE {
  graph ?np_assertion {
    ?subject biolink:category ?subject_category .
    ?object biolink:category ?object_category .
    ?association
      rdf:subject|biolink:subject ?subject ;
      rdf:predicate|biolink:predicate ?predicate_category ;
      rdf:object|biolink:object ?object .
  }
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}"""
)

get_metakg_prefixes_query = (
    """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX infores: <https://w3id.org/biolink/infores/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX npx: <http://purl.org/nanopub/x/>
SELECT DISTINCT ?node_category ?node_prefix
WHERE {
  graph ?np_assertion {
    {
      ?association
        rdf:subject|biolink:subject ?node ;
        rdf:predicate|biolink:predicate ?predicate_category ;
        rdf:object|biolink:object ?object .
    } UNION {
      ?association
        rdf:subject|biolink:subject ?subject ;
        rdf:predicate|biolink:predicate ?predicate_category ;
        rdf:object|biolink:object ?node .
    }
    ?node biolink:category ?node_category .

    VALUES (?namespace ?separator) {
      ("//identifiers.org/" "/")
      ("//purl.obolibrary.org/obo/" "_")
      ("//www.ebi.ac.uk/efo/" "_")
    }
    BIND(UCASE(STRBEFORE(REPLACE(STRAFTER(str(?node), ":"), ?namespace, ""), ?separator)) AS ?node_prefix)
    FILTER(strlen(?node_prefix)>0)
    FILTER(!strstarts(?node_prefix, "//"))
  }
  graph ?np_head {
    ?np_uri np:hasAssertion ?np_assertion .
  }
  FILTER NOT EXISTS { ?creator npx:retracts ?np_uri }
}
"""
)

# Load BioLink JSON-LD Context to resolve URIs to BioLink CURIEs
with urllib.request.urlopen(
    f"https://raw.githubusercontent.com/biolink/biolink-model/v{settings.BIOLINK_VERSION}/context.jsonld"
) as url:
    data = json.loads(url.read().decode())


namespace_resolver = {}
context = data["@context"]
for prefix in context:
    if isinstance(context[prefix], str):
        namespace_resolver[prefix] = context[prefix]
    elif "@id" in context[prefix]:
        namespace_resolver[prefix] = context[prefix]["@id"]
namespace_resolver["infores"] = "https://w3id.org/biolink/infores/"

uri_resolver = {v: k for k, v in namespace_resolver.items()}
uri_resolver["https://identifiers.org/mim/"] = "OMIM"
uri_resolver["https://identifiers.org/OMIM:"] = "OMIM"
uri_resolver["https://identifiers.org/drugbank/"] = "DRUGBANK"
uri_resolver["https://go.drugbank.com/drugs/"] = "DRUGBANK"
uri_resolver["https://w3id.org/biolink/vocab/"] = "biolink"
uri_resolver["http://w3id.org/biolink/vocab/"] = "biolink"
uri_resolver["https://w3id.org/um/neurodkg/"] = "neurodkg"
# http://www.ebi.ac.uk/efo/EFO_000985


def resolve_uri(uri_string):
    """Take an URI and return its CURIE form, using the BioLink JSON-LD Context previously loaded"""
    for ns_uri in uri_resolver:
        if uri_string.startswith("http://purl.obolibrary.org/obo/"):
            # Handle OBO URIs
            return uri_string.replace("http://purl.obolibrary.org/obo/", "").replace(
                "_", ":"
            )
        elif uri_string.startswith(ns_uri):
            return uri_string.replace(ns_uri, uri_resolver[ns_uri] + ":")
        elif uri_string.startswith("https://identifiers.org/"):
            # To handle URIs generated by Nanobench templates
            return uri_string.replace("https://identifiers.org/", "")
    # If not found:
    return uri_string


def resolve_curie(curie_string):
    """Take a CURIE and return the corresponding URI in the Nanopublication network
    using the BioLink JSON-LD Context previously loaded
    """
    # Quick fix to handle lowercase drugbank and omim
    # if curie_string.startswith('drugbank:'):
    #   curie_string = curie_string.replace('drugbank:', 'DRUGBANK:')
    # if curie_string.startswith('omim:'):
    #   curie_string = curie_string.replace('omim:', 'OMIM:')

    ns = curie_string.split(":")[0]
    id = curie_string.split(":")[1]
    if ns in namespace_resolver:
        return namespace_resolver[ns] + id
    else:
        return "http://identifiers.org/" + curie_string


def resolve_curie_identifiersorg(curie_string):
    """Take a CURIE and return the corresponding URI in the Nanopublication network"""
    # Quick fix to handle lowercase drugbank and omim
    if curie_string.startswith("drugbank:"):
        curie_string = curie_string.replace("drugbank:", "DRUGBANK:")
    if curie_string.startswith("omim:"):
        curie_string = curie_string.replace("omim:", "OMIM:")
    return "https://identifiers.org/" + curie_string


def get_predicates_from_nanopubs():
    """Query the Nanopublications network to get BioLink entity categories and the relation between them
    Formatted for the Translator TRAPI /predicate get call
    """
    # TODO: Update to the meta_knowledge_graph for TRAPI 3.1.0
    predicates = {}
    # Run query to get types and relations between them
    sparql = SPARQLWrapper(settings.NANOPUB_SPARQL_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(get_metakg_edges_query)
    sparqlwrapper_results = sparql.query().convert()
    sparql_results = sparqlwrapper_results["results"]["bindings"]
    for result in sparql_results:
        np_subject = resolve_uri(result["subject_category"]["value"])
        np_predicate = resolve_uri(result["predicate_category"]["value"])
        np_object = resolve_uri(result["object_category"]["value"])
        if not predicates.get(np_subject):
            predicates[np_subject] = {}

        if not predicates[np_subject].get(np_object):
            predicates[np_subject][np_object] = []
        if np_predicate not in predicates[np_subject][np_object]:
            predicates[np_subject][np_object].append(np_predicate)

    return predicates


def get_metakg_from_nanopubs():
    """Query the Nanopublications network to get BioLink entity categories and the relation between them
    Formatted for the Translator TRAPI /predicate get call
    """
    # TODO: Update to the meta_knowledge_graph for TRAPI 3.1.0
    # Run query to get types and relations between them
    sparql = SPARQLWrapper(settings.NANOPUB_SPARQL_URL)
    sparql.setReturnFormat(JSON)
    sparql.setQuery(get_metakg_edges_query)
    sparqlwrapper_results = sparql.query().convert()
    sparql_results = sparqlwrapper_results["results"]["bindings"]
    if settings.DEV_MODE:
        print(get_metakg_edges_query)
        print(sparql_results)
    edges_array = []
    for result in sparql_results:
        edges_array.append(
            {
                "subject": resolve_uri(
                    result["subject_category"]["value"]
                ),
                "predicate": resolve_uri(
                    result["predicate_category"]["value"]
                ),
                "object": resolve_uri(result["object_category"]["value"]),
            }
        )

    # print(get_metakg_prefixes_query)
    sparql.setQuery(get_metakg_prefixes_query)
    sparqlwrapper_results = sparql.query().convert()
    prefixes_results = sparqlwrapper_results["results"]["bindings"]
    nodes_obj = {}
    for result in prefixes_results:
        node_category = resolve_uri(result["node_category"]["value"])
        if node_category not in nodes_obj.keys():
            nodes_obj[node_category] = {"id_prefixes": [result["node_prefix"]["value"]]}
        else:
            nodes_obj[node_category]["id_prefixes"].append(
                result["node_prefix"]["value"]
            )

    return {"edges": edges_array, "nodes": nodes_obj}


def get_np_users():
    pubkeys = {}
    headers = {"Accept": "application/json"}
    res = requests.get(
        f"{settings.NANOPUB_GRLC_URL}/get_all_users", headers=headers
    ).json()
    for user in res["results"]["bindings"]:
        # print(user)
        # Remove bad ORCID URLs
        if not user["user"]["value"].startswith("https://orcid.org/https://orcid.org/"):
            if "name" not in user:
                user["name"] = {"value": user["user"]["value"]}

            pubkeys[user["pubkey"]["value"]] = user
            # users_orcid[user['user']['value']] = user
    return pubkeys


def reasonerapi_to_sparql(reasoner_query):
    """Convert an array of predictions objects to ReasonerAPI format
    Run the get_predict to get the QueryGraph edges and nodes
    {disease: OMIM:1567, drug: DRUGBANK:DB0001, score: 0.9}

    :param: reasoner_query Query from Reasoner API
    :return: Results as ReasonerAPI object
    """
    np_users = get_np_users()
    # print(np_users)
    query_graph = reasoner_query["message"]["query_graph"]
    query_options = {}
    n_results = None
    in_index = None
    if "query_options" in reasoner_query:
        query_options = reasoner_query["query_options"]
        if "n_results" in query_options:
            n_results = int(query_options["n_results"])
        if "in_index" in query_options:
            in_index = str(query_options["in_index"])

    if len(query_graph["edges"]) != 1:
        return {
            "error": len(query_graph["edges"])
            + """ edges have been provided.
            This API currently only implements 1 hop queries (with 1 edge query_graph).
            Contact us if you are interested in running multiple hop queries"""
        }

    sparql_queries = [
        select_np_query_old,
        select_np_query,
    ]
    predicate_edge_id = ""
    subject_node_id = ""
    object_node_id = ""
    prov_block = ""
    np_index_block = ""
    transformed_queries = []

    for query_template in sparql_queries:
        if in_index == "infores:knowledge-collaboratory":
            # TODO: filter just on nanopubs created via annotate tool, maybe use prov?
            # knowledge_source_block = f"biolink:primary_knowledge_source <{KNOWLEDGE_PROVIDER}> ;"
            prov_block = """graph ?np_prov {
            ?np_assertion prov:wasQuotedFrom ?wasQuotedFrom .
        }"""
        elif in_index:
            np_index_block = f"""graph ?indexAssertionGraph {{
                {{
                    <{in_index}> npx:appendsIndex* ?index .
                    ?index npx:includesElement ?np .
                }} UNION {{
                    <{in_index}> npx:includesElement ?np .
                }}
            }}"""

        query = query_template.replace(
            "?_np_index_filter", np_index_block
        )
        query = query.replace(
            "?_prov_block", prov_block
        )
        # else:
        #   knowledge_source_block = f"biolink:aggregator_knowledge_source <{KNOWLEDGE_PROVIDER}> ;"
        #   sparql_query_get_nanopubs = sparql_query_get_nanopubs.replace('?_knowledge_source', knowledge_source_block)

        for edge_id in query_graph["edges"]:
            edge_props = query_graph["edges"][edge_id]
            predicate_edge_id = edge_id
            subject_node_id = edge_props["subject"]
            object_node_id = edge_props["object"]

            entity_filters = ""
            # Generate SPARQL query filters based on TRAPI query graph
            try:
                predicate_curies = edge_props["predicates"]
                if not isinstance(predicate_curies, list):
                    predicate_curies = [predicate_curies]
                predicate_curies = ["?predicate = " + curie for curie in predicate_curies]
                predicate_curies = " || ".join("?predicate = " + predicate_curies)
                entity_filters = entity_filters + "FILTER ( " + predicate_curies + " )\n"
            except Exception:
                pass
            try:
                subject_categories = query_graph["nodes"][edge_props["subject"]][
                    "categories"
                ]
                if not isinstance(subject_categories, list):
                    subject_categories = [subject_categories]
                subject_categories = ["?subject_category = " + curie for curie in subject_categories]
                subject_categories = " || ".join(subject_categories)
                entity_filters = entity_filters + "FILTER ( " + subject_categories + " )\n"
            except Exception:
                pass
            try:
                object_categories = query_graph["nodes"][edge_props["object"]]["categories"]
                if not isinstance(object_categories, list):
                    object_categories = [object_categories]
                object_categories = ["?object_category = " + curie for curie in object_categories]
                object_categories = " || ".join(object_categories)
                entity_filters = entity_filters + "FILTER ( " + object_categories + " )\n"
            except Exception:
                pass
            # Resolve provided CURIE to the BioLink context and https://identifiers.org/CURIE:ID
            try:
                subject_curies = query_graph["nodes"][edge_props["subject"]]["ids"]
                subject_curies = [f"?subject = <{resolve_curie(curie)}> || ?subject =<{resolve_curie_identifiersorg(curie)}>" for curie in subject_curies]
                subject_curies = " || ".join(subject_curies)
                entity_filters = entity_filters + "FILTER ( " + subject_curies + " )\n"
            except Exception:
                pass
            try:
                object_curies = query_graph["nodes"][edge_props["object"]]["ids"]
                object_curies = [f"?object = <{resolve_curie(curie)}> || ?object =<{resolve_curie_identifiersorg(curie)}>" for curie in object_curies]
                object_curies = " || ".join(object_curies)
                entity_filters = entity_filters + "FILTER ( " + object_curies + " )\n"
            except Exception:
                pass
            query = query.replace(
                "?_entity_filters", entity_filters
            )
            query = query.replace(
                "?_prov_block", prov_block
            )
        # NOTE: arbitrary limit to prevent requesting too much from the SPARQL endpoint
        query = query + " LIMIT 10000"
        transformed_queries.append(query)

    kg = {"nodes": {}, "edges": {}}
    query_results = []
    kg_edge_count = 0

    sparql = SPARQLWrapper(settings.NANOPUB_SPARQL_URL)
    sparql.setReturnFormat(JSON)
    sparql_results = []
    for query in transformed_queries:
        if settings.DEV_MODE is True:
            print(
                f"Running the following SPARQL query to retrieve nanopublications from {settings.NANOPUB_SPARQL_URL}"
            )
            print(query)
        sparql.setQuery(query)
        sparqlwrapper_results = sparql.query().convert()
        sparql_results.extend(sparqlwrapper_results["results"]["bindings"])

    # Build TRAPI KG from SPARQL results
    # Check current official example of Reasoner query results: https://github.com/NCATSTranslator/ReasonerAPI/blob/master/examples/Message/simple.json
    # Now iterates the Nanopubs SPARQL query results:
    for edge_result in sparql_results:
        # print(edge_result)
        if kg_edge_count >= n_results:
            break
        edge_uri = edge_result["association"]["value"]
        # Conflict when multiple nanopubs use the same edge ID: edge_uri = edge_result["association"]["value"].split("#")[-1]
        # Create edge object in knowledge_graph
        add_binding = False
        if edge_uri not in kg["edges"]:
            add_binding = True
            kg["edges"][edge_uri] = {
                "predicate": [resolve_uri(edge_result["predicate"]["value"])],
                "subject": resolve_uri(edge_result["subject"]["value"]),
                "object": resolve_uri(edge_result["object"]["value"]),
                "attributes": [],
                "qualifiers": [],
                "sources": [],
            }

        # Get author based on nanopub pubkey?
        if (
            "pubkey" in edge_result
            and "user" in np_users[edge_result["pubkey"]["value"]]
        ):
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:author",
                    "value": np_users[edge_result["pubkey"]["value"]]["user"]["value"],
                }
            )

        # Add Sources
        if "primary_knowledge_source" in edge_result:
            new_src = {
                "resource_id": resolve_uri(edge_result["primary_knowledge_source"]["value"]),
                "resource_role": "primary_knowledge_source",
            }
            if "primary_upstream_resource_ids" in edge_result:
                if "upstream_resource_ids" not in new_src:
                    new_src["upstream_resource_ids"] = []
                new_src["upstream_resource_ids"].append(resolve_uri(
                    edge_result["primary_upstream_resource_ids"]["value"]
                ))
            if "primary_source_record_urls" in edge_result:
                if "source_record_urls" not in new_src:
                    new_src["source_record_urls"] = []
                new_src["source_record_urls"].append(resolve_uri(
                    edge_result["primary_source_record_urls"]["value"]
                ))
            if not any(
                attribute for attribute in kg["edges"][edge_uri]["sources"]
                if attribute["resource_id"] == new_src["resource_id"]
            ):
                kg["edges"][edge_uri]["sources"].append(new_src)

        if "supporting_data_source" in edge_result:
            new_src = {
                "resource_id": resolve_uri(edge_result["supporting_data_source"]["value"]),
                "resource_role": "supporting_data_source",
            }
            if "supporting_upstream_resource_ids" in edge_result:
                if "upstream_resource_ids" not in new_src:
                    new_src["upstream_resource_ids"] = []
                new_src["upstream_resource_ids"].append(resolve_uri(
                    edge_result["supporting_upstream_resource_ids"]["value"]
                ))
            if "supporting_source_record_urls" in edge_result:
                if "source_record_urls" not in new_src:
                    new_src["source_record_urls"] = []
                new_src["source_record_urls"].append(resolve_uri(
                    edge_result["supporting_source_record_urls"]["value"]
                ))
            if not any(
                attribute for attribute in kg["edges"][edge_uri]["sources"]
                if attribute["resource_id"] == new_src["resource_id"]
            ):
                kg["edges"][edge_uri]["sources"].append(new_src)

        # Add Attributes
        if "attribute_type" in edge_result:
            new_attribute = {
                "attribute_type_id": resolve_uri(edge_result["attribute_type"]["value"]),
                "value": resolve_uri(edge_result["attribute_value"]["value"]),
                "attribute_source": resolve_uri(edge_result["attribute_provider"]["value"])
            }
            if not any(
                attribute for attribute in kg["edges"][edge_uri]["attributes"]
                if attribute["attribute_type_id"] == new_attribute["attribute_type_id"] and attribute["value"] == new_attribute["value"]
            ):
                kg["edges"][edge_uri]["attributes"].append(new_attribute)

        # Add Qualifiers
        if "qualifier_value" in edge_result:
            new_qualifier = {
                "qualifier_type_id": resolve_uri(edge_result["qualifier"]["value"]),
                "qualifier_value": resolve_uri(edge_result["qualifier_value"]["value"]),
            }
            if not any(
                qualifier for qualifier in kg["edges"][edge_uri]["qualifiers"]
                if qualifier["qualifier_type_id"] == new_qualifier["qualifier_type_id"] and qualifier["qualifier_value"] == new_qualifier["qualifier_value"]
            ):
                kg["edges"][edge_uri]["qualifiers"].append(new_qualifier)

        if "label" in edge_result:
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:name",
                    "value": resolve_uri(edge_result["label"]["value"]),
                }
            )
        if "description" in edge_result:
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:description",
                    "value": resolve_uri(
                        edge_result["description"]["value"]
                    ),
                    # 'value_type_id': 'biolink:Cohort',
                }
            )

        # NOTE: below properties are mainly for the old query
        # TODO: refactor to use a list and a loop?
        # extract_attributes = [
        #   'relation', 'publications', 'knowledge_source', 'label', 'provided_by',
        #   'description', 'has_population_context', 'population_has_phenotype'
        # ]
        # if "relation" in edge_result:
        #     # knowledge_graph['edges'][edge_uri]['relation'] = resolve_uri_with_context(edge_result['relation']['value'])
        #     knowledge_graph["edges"][edge_uri]["attributes"].append(
        #         {
        #             "attribute_type_id": "biolink:relation",
        #             "value": resolve_uri_with_context(edge_result["relation"]["value"]),
        #         }
        #     )
        if "publications" in edge_result:
            # Only for the old query
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:publications",
                    "value": resolve_uri(
                        edge_result["publications"]["value"]
                    ),
                }
            )
        if "has_population_context" in edge_result:
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:population_context_qualifier",
                    "value": resolve_uri(
                        edge_result["has_population_context"]["value"]
                    ),
                    # 'value_type_id': 'biolink:Cohort',
                }
            )
        if "population_has_phenotype" in edge_result:
            # TODO: fix the key
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:has_phenotype",
                    "value": resolve_uri(
                        edge_result["population_has_phenotype"]["value"]
                    ),
                    # 'value_type_id': 'biolink:Phenotype',
                }
            )
        if "provided_by" in edge_result:
            # Add provided_by attribute
            kg["edges"][edge_uri]["attributes"].append(
                {
                    "attribute_type_id": "biolink:provided_by",
                    "value": resolve_uri(
                        edge_result["provided_by"]["value"]
                    ),
                    # 'value_type_id': 'biolink:Agent',
                }
            )

        # Add nodes to the knowledge_graph
        kg["nodes"][
            resolve_uri(edge_result["subject"]["value"])
        ] = {
            "categories": [
                resolve_uri(edge_result["subject_category"]["value"])
            ]
        }
        kg["nodes"][
            resolve_uri(edge_result["object"]["value"])
        ] = {
            "categories": [
                resolve_uri(edge_result["object_category"]["value"])
            ]
        }

        # Add the bindings to the results object
        if add_binding:
            result = {
                'node_bindings': {},
                'analyses': [{
                    "resource_id": "infores:knowledge-collaboratory",
                    "edge_bindings": {
                        predicate_edge_id: [
                            {
                                "id": edge_uri
                            }
                        ]
                    }
                }],
                # 'edge_bindings': {},
            }
            # result["edge_bindings"][predicate_edge_id] = [{"id": edge_uri}]
            result["node_bindings"][subject_node_id] = [
                {"id": resolve_uri(edge_result["subject"]["value"])}
            ]
            result["node_bindings"][object_node_id] = [
                {"id": resolve_uri(edge_result["object"]["value"])}
            ]
            query_results.append(result)
            kg_edge_count += 1

    return {
        "message": {
            "knowledge_graph": kg,
            "query_graph": query_graph,
            "results": query_results,
        },
        "query_options": query_options,
        "reasoner_id": "infores:knowledge-collaboratory",
        "schema_version": settings.TRAPI_VERSION,
        "biolink_version": settings.BIOLINK_VERSION,
        "status": "Success",
        # "logs": [
        #     {
        #         "code": None,
        #         "level": "INFO",
        #         "message": "No descendants found from Ontology KP for QNode 'n00'.",
        #         "timestamp": "2023-04-05T07:24:26.646711"
        #     },
        # ]
    }
