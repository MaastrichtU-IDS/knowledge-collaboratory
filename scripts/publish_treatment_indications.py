
# Indication published by Leoni Bucken, e.g.


sparql_get_pubs = """
PREFIX prov: <http://www.w3.org/ns/prov#>
prefix np: <http://www.nanopub.org/nschema#>
prefix npa: <http://purl.org/nanopub/admin/>
prefix npx: <http://purl.org/nanopub/x/>
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
prefix dct: <http://purl.org/dc/terms/>
prefix biolink: <https://w3id.org/biolink/vocab/>
prefix schema: <https://schema.org/>

prefix luc: <http://www.ontotext.com/owlim/lucene#>
prefix bif: <http://www.openlinksw.com/schemas/bif#>

select ?np ?date ?pubkey where {
  graph npa:graph {
    ?np npa:hasHeadGraph ?h .
    ?np dct:created ?date .
    ?np npa:hasValidSignatureForPublicKey ?pubkey.
  }
  graph ?h {
    ?np np:hasAssertion ?assertionGraph ;
        np:hasPublicationInfo ?pubInfoGraph ;
        np:hasProvenance ?provGraph .
  }
  graph ?assertionGraph {
#    ?association biolink:aggregator_knowledge_source <https://w3id.org/biolink/infores/knowledge-collaboratory> .
    ?association  biolink:provided_by <https://w3id.org/um/NeuroDKG>;
    	biolink:relation schema:TreatmentIndication .
  }
  graph ?provGraph {
    ?assertionGraph prov:wasAttributedTo <https://orcid.org/0000-0002-1468-3557> .
  }

  filter not exists {
    graph npa:graph {
      ?newversion npa:hasHeadGraph ?nh .
      ?newversion npa:hasValidSignatureForPublicKey ?pubkey .
    }
    graph ?nh {
      ?newversion np:hasPublicationInfo ?ni .
    }
    graph ?ni {
      ?newversion npx:supersedes ?np .
    }
  }
  filter not exists {
    graph npa:graph {
      ?retraction npa:hasHeadGraph ?rh .
      ?retraction npa:hasValidSignatureForPublicKey ?pubkey .
    }
    graph ?rh {
      ?retraction np:hasAssertion ?ra .
    }
    graph ?ra {
      ?somebody npx:retracts ?np .
    }
  }

} ORDER BY desc(?date)
"""