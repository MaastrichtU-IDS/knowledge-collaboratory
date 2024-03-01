# 🧬 Connections Hypothesis provider integration 

Integration of the [Connections Hypothesis provider](https://github.com/NCATSTranslator/Translator-All/wiki/Connections-Hypothesis-Provider) Gennifer service that generates genes associations.

<details><summary>Click here to see the expected TRAPI KG for Gennifer gene-gene associations</summary>


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
</details>

## ✉️ As Nanopub

Gennifer gene to gene association defined as Nanopub RDF using the JSON-LD format

> [!NOTE]
>
> BioLink classes used:
>
> * GeneToGeneAssociation
> * Sources: https://biolink.github.io/biolink-model/RetrievalSource/
> * Attributes: https://biolink.github.io/biolink-model/Attribute/
> * Qualifiers are provided directly as predicate-object on the association


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
          "pav:version": "4.1.3"
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

## ✍️ Nanopub signed and published to test server

Website to sign and publish the Nanopub to the test server: https://vemonet.github.io/nanopub-rs/demo.html

Example published on the test server: https://np.test.knowledgepixels.com/RAxEVUFRa69bSiCd4_KkO4YteCQ3Jq3_qnQWmdApLWBO0

## 🏁 Knowledge Collaboratory TRAPI results

Running the TRAPI query on the Knowledge Collaboratory TRAPI endpoint in test environment:

```json
{
  "message": {
    "query_graph": {
      "edges": {
        "e01": {
          "object": "n1",
          "subject": "n0"
        }
      },
      "nodes": {
        "n0": {
          "categories": [
            "biolink:Gene"
          ]
        },
        "n1": {
          "categories": [
            "biolink:Gene"
          ]
        }
      }
    }
  },
  "query_options": {
    "n_results": 1
  }
}
```

We get the result:

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
        "https://w3id.org/np/RA0bcmOxDs0pMzb1csOaEiQ6F82dOpLibgqA-htAiUUdA#1c164fe23bee": {
          "predicate": [
            "biolink:regulates"
          ],
          "subject": "ENSEMBL:ENSG00000132155",
          "object": "ENSEMBL:ENSG00000174775",
          "attributes": [
            {
              "attribute_type_id": "biolink:knowledge_level",
              "value": "curated",
              "attribute_source": "infores:knowledge-collaboratory"
            },
            {
              "attribute_type_id": "biolink:publications",
              "value": "https://w3id.org/np/RA0bcmOxDs0pMzb1csOaEiQ6F82dOpLibgqA-htAiUUdA",
              "attribute_source": "infores:knowledge-collaboratory"
            },
            {
              "attribute_type_id": "biolink:has_author",
              "value": "<SME_ORCHID>",
              "attribute_source": "infores:connections-hypothesis"
            },
            {
              "attribute_type_id": "biolink:algorithm",
              "value": "<ALGORITHM_PUB>",
              "attribute_source": "infores:connections-hypothesis"
            }
          ],
          "qualifiers": [
            {
              "qualifier_type_id": "biolink:object_aspect_qualifier",
              "qualifier_value": "activity"
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
              "resource_id": "infores:zenodo",
              "resource_role": "supporting_data_source",
              "source_record_urls": [
                "<DOITOSTUDY>"
              ]
            }
          ]
        }
}
```

