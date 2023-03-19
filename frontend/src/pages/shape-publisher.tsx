"use client";

import React from 'react';
// import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { Typography, Container } from "@mui/material";

import ShapeUploader from "../components/shape-publisher/ShapeUploader";
// import CsvUploader from "../../src/components/CsvUploader";
// import RenderObjectForm from "../../src/components/RenderObjectForm";
import {JsonldForm} from '../components/shape-publisher/JsonldForm';
// import { JsonldEditor, JsonldForm } from 'json-ld-editor-react';


export default function ShapePublisher() {

  // TODO: use sx https://github.com/mui/material-ui/blob/master/examples/create-react-app-with-typescript/src/index.tsx
  const theme = useTheme();

  // useLocation hook to get URL params
  // let location = useLocation();
  const [state, setState] = React.useState({
    // shapeFile: shapeFile,
    shapeFile: shapeFile,
    shapeTarget: "https://w3id.org/kg-metadata/KgMetadataShape" ,
    open: false,
    dialogOpen: false,
    csvwColumnsArray: [],
    jsonld_uri_provided: null,
    ontology_jsonld: {},
    edit_enabled: true,
    ontoload_error_open: false,
    ontoload_success_open: false,
    sparql_endpoint: '',
    sparql_username: '',
    sparql_password: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // Original form and output:
  // Questions: https://github.com/kodymoodley/fair-metadata-generator/blob/main/questions.csv
  // Full output: https://github.com/kodymoodley/fair-metadata-html-page-generator/blob/main/testdata/inputdata/test.jsonld

  // React.useEffect(() => {
  //   // Get the edit URL param if provided, and download ontology if @context changed
  //   // Ontology is stored in state.ontology_jsonld
  //   // and passed to renderObjectForm to resolve classes and properties
  //   const params = new URLSearchParams(location.search + location.hash);
  //   let jsonld_uri_provided = params.get('edit');
  //   let editionEnabled = params.get('toysrus');
  //   if (editionEnabled === 'closed') {
  //     // Disable edit if toysrus=closed
  //     updateState({ edit_enabled: false })
  //   }
  //   if (jsonld_uri_provided) {
  //     axios.get(jsonld_uri_provided)
  //       .then(res => {
  //         updateState({
  //           wizard_jsonld: res.data,
  //           jsonld_uri_provided: jsonld_uri_provided,
  //         })
  //         downloadOntology(res.data['@context'])
  //       })
  //   } else {
  //     downloadOntology(state.wizard_jsonld['@context'])
  //   }

  // }, [state.wizard_jsonld['@context']])


  return(
    <Container className='mainContainer'>

      {/* <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(1)}}>
        🧙‍♂️ FAIR Metadata Wizard, a JSON-LD editor 📝
      </Typography> */}

      <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(1)}}>
        ⚠️ Work in progress, currently available for demo purpose
        {/* Load and edit <a href="https://json-ld.org/" className={classes.link} target="_blank" rel="noopener noreferrer">JSON-LD</a> <a href="https://en.wikipedia.org/wiki/Resource_Description_Framework" className={classes.link} target="_blank" rel="noopener noreferrer">RDF</a> files in a user-friendly web interface, with autocomplete based on the classes and properties of the ontology magically loaded from <code>@context</code> ✨️ */}
      </Typography>

      <ShapeUploader
        renderObject={state.shapeFile}
        shapeTarget={state.shapeTarget}
        onChange={(shapeFile: any, shapeTarget: any) => {
          updateState({shapeFile, shapeTarget})

          // setTimeout(function() {
          //   console.log('shapeFile state after clicking upload', state.shapeFile)
          // }, 300);
          // window.location.reload()
        }}
      />

      <JsonldForm
        shape={state.shapeFile}
        target={state.shapeTarget}
      />

      {/* <PublishNanopubButtons
        user={user}
        generateRDF={generateRDF}
        entitiesList={state.entitiesList}
        inputSource={state.inputSource}
        nanopubGenerated={state.nanopubGenerated}
        nanopubPublished={state.nanopubPublished}
        errorMessage={state.errorMessage}
      /> */}

    </Container>
  )
}


// SHACL shapes examples:
// Articles: https://raw.githubusercontent.com/NCATS-Gamma/omnicorp/master/shacl/omnicorp-shapes.ttl

const shapeFile = `@prefix : <https://w3id.org/kg-metadata/> .
@prefix dctypes: <http://purl.org/dc/dcmitype/> .
@prefix schemaorg: <http://schema.org/> .
@prefix void:  <http://rdfs.org/ns/void#> .
@prefix pav:   <http://purl.org/pav/> .
@prefix freq:  <http://purl.org/cld/freq/> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix void-ext: <http://ldf.fi/void-ext#> .
@prefix cito:  <http://purl.org/spar/cito/> .
@prefix idot:  <http://identifiers.org/idot/> .
@prefix sd:    <http://www.w3.org/ns/sparql-service-description#> .
@prefix dct:   <http://purl.org/dc/terms/> .
@prefix sh:    <http://www.w3.org/ns/shacl#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix sio:   <http://semanticscience.org/resource/> .
@prefix lexvo: <http://lexvo.org/id/iso639-3/> .
@prefix dcat:  <http://www.w3.org/ns/dcat#> .
@prefix prov:  <http://www.w3.org/ns/prov#> .
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .

## Shape to describe how to describe a Knowledge graph metadata
# Used to generate JSON Schema based form at the DKG COST action

# Target: https://w3id.org/kg-metadata/KgMetadataShape
:KgMetadataShape
    a sh:NodeShape ;
    sh:nodeKind sh:IRI ;
    sh:targetClass dcat:Dataset ;

    sh:property [
        sh:path dct:title ;
        sh:name "Title" ;
        sh:description "To provide a name or formal title for the KG" ;
        sh:severity sh:Violation ;
        sh:minCount 1;
        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype rdf:langString ] ) ;
        sh:nodeKind sh:Literal ;
    ] ;
    sh:property [
        sh:path dct:description ;
        sh:name "Description" ;
        sh:description "To provide a human readable description of the KG" ;
        sh:severity sh:Violation ;
        sh:minCount 1;
        sh:maxCount 1;
        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype rdf:langString ] ) ;
    ] ;
    sh:property [
        sh:path foaf:page ;
        sh:name "Homepage URL" ;
        sh:description "Page provides minimal information, link to access to data" ;
        sh:severity sh:Violation ;
        sh:minCount 0;
        sh:nodeKind sh:IRI ;
    ] ;
    sh:property [
        sh:path dct:issued ;
        sh:name "Published Date" ;
        sh:description "To provide the date when the KG is published" ;
        sh:severity sh:Violation ;
        sh:minCount 1;
        sh:maxCount 1;
        # sh:nodeKind sh:IRI ;
        # sh:datatype xsd:dateTime ;
        sh:pattern "^\\\\d{4}-(0?[1-9]|1[012])\\\\-(0?[1-9]|[12][0-9]|3[01])$" ;
        # sh:nodeKind sh:Literal ;
        sh:or ( [ sh:datatype xsd:dateTime ] [ sh:datatype xsd:date ] [ sh:datatype xsd:gYearMonth ] [ sh:datatype xsd:gYear ] ) ;
    ] ;
    sh:property [
        sh:path void:vocabulary ;
        sh:name "Vocabularies used" ;
        sh:description "To specify the vocabularies used in the knowledge" ;
        sh:severity sh:Violation ;
        sh:minCount 1;
        sh:nodeKind sh:IRI ;
        # TODO: make an enum?
        # sh:datatype xsd:dateTime ;
        # sh:pattern "^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$"
        # sh:or ( [ sh:datatype xsd:dateTime ] [ sh:datatype xsd:date ] [ sh:datatype xsd:gYearMonth ] [ sh:datatype xsd:gYear ] ) ;
    ] ;
    sh:property [
        sh:path foaf:depiction ;
        sh:name "Meta graph (picture)" ;
        sh:description "To provide an illustration of the graph connectivity through its types and relations between instances" ;
        sh:severity sh:Violation ;
        sh:minCount 1;
        sh:nodeKind sh:IRI ;
    ] ;

    sh:property [
        sh:path dct:language ;
        sh:severity sh:Warning ;
        sh:name "Language" ;
        sh:description "Language of the distribution" ;
        sh:message "Distribution SHOULD use dct:language with a lexvo URI: http://lexvo.org/id/iso639-3/{tag}" ;
        sh:minCount 1;
        sh:nodeKind sh:IRI
    ] ;
    sh:property [
        sh:path pav:version ;
        sh:name "Version" ;
        sh:description "To specify the version of the dataset, if defined" ;
        sh:severity sh:Warning ;
        sh:minCount 1;
        sh:maxCount 1;
        sh:nodeKind sh:Literal ;
    ] ;
    sh:property [
        sh:path dct:license ;
        sh:name "License" ;
        # sh:description "To specify the version of the dataset, if defined" ;
        sh:severity sh:Warning ;
        sh:minCount 1;
        sh:maxCount 1;
        sh:nodeKind sh:IRI
    ] ;
    sh:property [
        sh:path dcat:keyword ;
        sh:name "Keywords" ;
        sh:description "To provide a set of descriptors for the KG" ;
        sh:minCount 1;
        sh:nodeKind sh:Literal ;
        # TODO: add array when maxCount > 1
    ] ;
    sh:property [
        sh:path dct:accessRight ;
        sh:name "KG Accessibility" ;
        sh:description "To provide a set of descriptors for the KG" ;
        sh:minCount 0;
        sh:nodeKind sh:Literal ;
        # TODO: add array when maxCount > 1
    ] ;





    sh:property [
        sh:path dcat:Distribution ;
        sh:name "Distributions" ;
        sh:description "To provide different concrete distributions (files) of the resource" ;
        # sh:minCount 1;
        # sh:nodeKind sh:IRI ;
        sh:node :DistributionShape ;
    ] ;
    .



:DistributionShape
    a sh:NodeShape ;
    sh:targetClass dcat:Distribution ;
    sh:nodeKind sh:IRI ;

    sh:property [
        sh:path dcat:accessURL ;
        sh:name "Access URL" ;
        sh:description "URL to download or access the distribution (e.g. file)" ;
        sh:severity sh:Violation ;
        sh:minCount 0 ;
        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype rdf:langString ] ) ;
        sh:nodeKind sh:Literal ;
    ] ;
    .
`
