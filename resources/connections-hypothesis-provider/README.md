# Connections Hypothesis provider integration 

Integration of the Connections Hypothesis provider Gennifer service that generates genes associations.

Expected TRAPI KG for Gennifer gene-gene associations:

```json
{
    "knowledge_graph": {
        "nodes": {
            "ENSEMBL:ENSG00000132155": {
                "categories": [
                    "biolink:Gene"
                ]
            },
            "ENSEMBL:ENSG00000174775": {
                "categories": [
                    "biolink:Gene"
                ]
            }
        },
        "edges": {
            "1c164fe23bee": {
                "subject": "ENSEMBL:ENSG00000132155",
                "predicate": [
                    "biolink:regulates"
                ],
                "object": "ENSEMBL:ENSG00000174775",
                "qualifiers": [
                    {
                        "qualifier_type_id" : "biolink:qualified_predicate",
                        "qualifier_value" : "biolink:causes"
                    },
                    {
                        "qualifier_type_id" : "biolink:object_aspect_qualifier",
                        "qualifier_value" : "activity"
                    },
                    {
                        "qualifier_type_id" : "biolink:object_direction_qualifier",
                        "qualifier_value" : "upregulated"
                    }
                ],
                "sources": [
                    {
                        "resource_id": "infores:knowledge-collaboratory",
                        "resource_role": "primary_knowledge_source",
                        "upstream_resource_ids": [
                            "infores:connections-hypothesis"
                        ]
                    },
                    {
                        "resource_id": "infores:connections-hypothesis",
                        "resource_role": "supporting_data_source",
                        "upstream_resource_ids": [
                            "infores:zenodo"
                        ]
                    },
                    {
                        "resource_id": "infores:zenodo",
                        "resource_role": "supporting_data_source",
                        "source_record_urls": [
                            "<DOI_TO_STUDY>"
                        ]
                    }
                ],
                "attributes":[
                    {
                        "attribute_type_id": "biolink:knowledge_level",
                        "value": "curated",
                        "attribute_source": "infores:knowledge-collaboratory"
                    },
                    {
                        "attribute_type_id": "biolink:publications",
                        "value": "<NANOPUB_DOI>",
                        "attribute_source": "infores:knowledge-collaboratory"
                    },
                    {
                        "attribute_type_id": "has_author",
                        "value": "<SME_ORCHID>",
                        "attribute_source": "infores:connections-hypothesis"
                    },
                    {
                        "attribute_type_id": "algorithm",
                        "value": "<ALGORITHM_PUB>",
                        "attribute_source": "infores:connections-hypothesis"
                    }
                ]
            }
        }
    }
}
```

## As Nanopub

Example existing BioLink association as nanopub: https://np.knowledgepixels.com/RALF3OirR77buyLNA6Ehu_5RGYBQKIVEK5_yOLooqkZl4.html

BioLink classes used:

* Sources: https://biolink.github.io/biolink-model/RetrievalSource/
* Attributes: https://biolink.github.io/biolink-model/Attribute/


```json
{
  "@id": "#Head",
  "@graph": {
    "@type": "np:Nanopublication",
    "@id": "#",
    "np:hasAssertion": {
      "@id": "#assertion",
      "@graph": [
        {
          "@id": "ENSEMBL:ENSG00000132155",
          "@type": "biolink:Gene",
          "biolink:category": {"@id": "biolink:Gene"}
        },
        {
          "@id": "ENSEMBL:ENSG00000174775",
          "@type": "biolink:Gene",
          "biolink:category": {"@id": "biolink:Gene"}
        },
        {
          "@id": "#1c164fe23bee",
          "@type": "biolink:GeneToGeneAssociation",
          "biolink:categories": {"@id": "biolink:GeneToGeneAssociation"},
          "biolink:subject": {"@id": "ENSEMBL:ENSG00000132155"},
          "biolink:predicate": {"@id": "biolink:regulates"},
          "biolink:object": {"@id": "ENSEMBL:ENSG00000174775"},

          "biolink:qualified_predicate": {"@id": "biolink:causes"},
          "biolink:object_aspect_qualifier": "activity",
          "biolink:object_direction_qualifier": "upregulated",

          "biolink:has_attribute": [
            {
              "@type": "biolink:Attribute",
              "biolink:has_attribute_type": {"@id": "biolink:knowledge_level"},
              "biolink:value": "curated",
              "biolink:provided_by": {"@id": "infores:knowledge-collaboratory"}
            },
            {
              "@type": "biolink:Attribute",
              "biolink:has_attribute_type": {"@id": "biolink:publications"},
              "biolink:value": {"@id": "#"},
              "biolink:provided_by": {"@id": "infores:knowledge-collaboratory"}
            },
            {
              "@type": "biolink:Attribute",
              "biolink:has_attribute_type": {"@id": "biolink:has_author"},
              "biolink:value": "<SME_ORCHID>",
              "biolink:provided_by": {"@id": "infores:connections-hypothesis"}
            },
            {
              "@type": "biolink:Attribute",
              "biolink:has_attribute_type": {"@id": "biolink:algorithm"},
              "biolink:value": "<ALGORITHM_PUB>",
              "biolink:provided_by": {"@id": "infores:connections-hypothesis"}
            }
          ],

          "biolink:primary_knowledge_source": {
            "@type": "biolink:RetrievalSource",
            "biolink:resource_id": {"@id": "infores:knowledge-collaboratory"},
            "biolink:resource_role": "primary_knowledge_source",
            "biolink:upstream_resource_ids": [
              {"@id": "infores:connections-hypothesis"}
            ]
          },
          "biolink:supporting_data_source": [
            {
              "@type": "biolink:RetrievalSource",
              "biolink:resource_id": {"@id": "infores:connections-hypothesis"},
              "biolink:resource_role": "supporting_data_source",
              "biolink:upstream_resource_ids": [
                {"@id": "infores:zenodo"}
              ]
            },
            {
              "@type": "biolink:RetrievalSource",
              "biolink:resource_id": {"@id": "infores:zenodo"},
              "biolink:resource_role": "supporting_data_source",
              "biolink:source_record_urls": ["<DOITOSTUDY>"]
            }
          ]
        }
      ]
    },

    "np:hasProvenance": {
      "@id": "#provenance",
      "@graph": [
        {
          "@id": "#assertion",
          "dct:conformsTo": {"@id": "biolink:"}
        },
        {
          "@id": "biolink:",
          "pav:version": "3.1.0"
        }
      ]
    },
    "np:hasPublicationInfo": {
      "@id": "#pubinfo",
      "@graph": []
    }
  },
  "@context": {
    "@base": "http://purl.org/nanopub/temp/mynanopub#",
    "np": "http://www.nanopub.org/nschema#",
    "npx": "http://purl.org/nanopub/x/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "dct": "http://purl.org/dc/terms/",
    "prov": "http://www.w3.org/ns/prov#",
    "pav": "http://purl.org/pav/",
    "orcid": "https://orcid.org/",
    "biolink": "https://w3id.org/biolink/vocab/",
    "infores": "https://w3id.org/biolink/infores/",
    "ENSEMBL": "http://identifiers.org/ensembl/"
  }
}
```

> Should we import the complete context from BioLink? https://github.com/biolink/biolink-model/raw/master/project/jsonld/biolink_model.context.jsonld

### ⚠️ Comments

1. In the BioLink model `has_attribute` is defined from Attribute to Entity, when it should be from Entity to Attribute: https://biolink.github.io/biolink-model/Attribute/

> [has_attribute](https://biolink.github.io/biolink-model/has_attribute/): *connects any entity to an attribute* 

2. In the TRAPI JSON `attribute_type_id` and `value` and `attribute_source` are used

In the biolink model it is `has_attribute_type` and `has_quantitative_value`/`has_qualitative_value` and `provided_by`.

Not sure if it is normal

## Example signed Nanopub

Check the nanopub is valid and generate the signed version: https://vemonet.github.io/nanopub-rs/demo.html

In RDF trig format:

```turtle
PREFIX this: <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus>
PREFIX sub: <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX biolink: <https://w3id.org/biolink/vocab/>
PREFIX np: <http://www.nanopub.org/nschema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX pav: <http://purl.org/pav/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX orcid: <https://orcid.org/>
PREFIX npx: <http://purl.org/nanopub/x/>

GRAPH sub:Head {
  <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus> a np:Nanopublication;
    np:hasAssertion sub:assertion;
    np:hasProvenance sub:provenance;
    np:hasPublicationInfo sub:pubinfo.
}

GRAPH sub:assertion {
  <http://identifiers.org/ensembl/ENSG00000132155> a biolink:Gene;
    biolink:category biolink:Gene.

  <http://identifiers.org/ensembl/ENSG00000174775> a biolink:Gene;
    biolink:category biolink:Gene.

  sub:1c164fe23bee a biolink:GeneToGeneAssociation;
    biolink:categories biolink:GeneToGeneAssociation;
    biolink:has_attribute sub:_1,
      sub:_2,
      sub:_3,
      sub:_4;
    biolink:object <http://identifiers.org/ensembl/ENSG00000174775>;
    biolink:object_aspect_qualifier "activity";
    biolink:object_direction_qualifier "upregulated";
    biolink:predicate biolink:regulates;
    biolink:primary_knowledge_source sub:_5;
    biolink:qualified_predicate biolink:causes;
    biolink:subject <http://identifiers.org/ensembl/ENSG00000132155>;
    biolink:supporting_data_source sub:_6,
      sub:_7.

  sub:_1 a biolink:Attribute;
    biolink:has_attribute_type biolink:knowledge_level;
    biolink:provided_by <https://w3id.org/biolink/infores/knowledge-collaboratory>;
    biolink:value "curated".

  sub:_2 a biolink:Attribute;
    biolink:has_attribute_type biolink:publications;
    biolink:provided_by <https://w3id.org/biolink/infores/knowledge-collaboratory>;
    biolink:value <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus>.

  sub:_3 a biolink:Attribute;
    biolink:has_attribute_type biolink:has_author;
    biolink:provided_by <https://w3id.org/biolink/infores/connections-hypothesis>;
    biolink:value "<SME_ORCHID>".

  sub:_4 a biolink:Attribute;
    biolink:has_attribute_type biolink:algorithm;
    biolink:provided_by <https://w3id.org/biolink/infores/connections-hypothesis>;
    biolink:value "<ALGORITHM_PUB>".

  sub:_5 a biolink:RetrievalSource;
    biolink:resource_id <https://w3id.org/biolink/infores/knowledge-collaboratory>;
    biolink:resource_role "primary_knowledge_source";
    biolink:upstream_resource_ids <https://w3id.org/biolink/infores/connections-hypothesis>.

  sub:_6 a biolink:RetrievalSource;
    biolink:resource_id <https://w3id.org/biolink/infores/connections-hypothesis>;
    biolink:resource_role "supporting_data_source";
    biolink:upstream_resource_ids <https://w3id.org/biolink/infores/zenodo>.

  sub:_7 a biolink:RetrievalSource;
    biolink:resource_id <https://w3id.org/biolink/infores/zenodo>;
    biolink:resource_role "supporting_data_source";
    biolink:source_record_urls "<DOITOSTUDY>".
}

GRAPH sub:provenance {
  <https://w3id.org/biolink/vocab/>
    pav:version "3.1.0".

  sub:assertion
    dcterms:conformsTo <https://w3id.org/biolink/vocab/>.
}

GRAPH sub:pubinfo {
  <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus>
    dcterms:created "2024-02-29T08:51:45.454Z"^^xsd:dateTime.

  sub:sig
    npx:hasAlgorithm "RSA";
    npx:hasPublicKey "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD3RHyHR7WWKBYevw1qK86B6RVzI7oKlvghqXvbpOAX1KueDE6Itru34HRhrVy4OMLCRQWBE3VXktKdbgOxD3vC4cIxz5LX+XOgGWzv5WKSjOfXu/yIeJrzsuIkyHvw7/tToGrE0itJ1wGylJv+YieizmGvNiUHhP0J0+YFMNnvewIDAQAB";
    npx:hasSignature "HH5BAsSzPqeDtH13aV/RKP2OY2WEZKLfbE5Ldp29jAhg6gqVE8z+ypyEhNESaw7W3SjCzf2y2v2/zEiuK44btBVNnh86IqRDsnoJr++xDLNYciO/Y74hpSWSofdpShzFXVQt5Id4rizUlFuAiylirJUNEJxRwKuBwte3kBooYlM=";
    npx:hasSignatureTarget <https://w3id.org/np/RAzcda-64zCC9iyGDz95T87DC3tmyo1IevKnIrJCIfYus>.
}
```

