import React, { useContext } from 'react';
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Box, CircularProgress, Tooltip, IconButton, Autocomplete, Button, Card, FormControl, TextField, Snackbar, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DownloadJsonldIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/AddBox';
import UploadIcon from '@mui/icons-material/FileUpload';
import RemoveIcon from '@mui/icons-material/Delete';
import ExtractIcon from '@mui/icons-material/AutoFixHigh';
import GenerateIcon from '@mui/icons-material/FactCheck';
import PublishIcon from '@mui/icons-material/Backup';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import Taggy from 'react-taggy'

const $rdf = require('rdflib')
// import { LoggedIn, LoggedOut, Value } from '@solid/react';
// import * as jsonld from 'jsonld'
// import {$rdf} from 'rdflib'
// const jsonld = require('jsonld')

// import hljs from 'highlight.js/lib/core';
// import 'highlight.js/styles/github-dark-dimmed.css';
// import turtle from 'highlightjs-turtle';
// var hljsDefineTurtle = require('highlightjs-turtle');
// hljs.registerLanguage('turtle', turtle);

import JsonldUploader from "../components/JsonldUploader";
import RenderObjectForm from "../components/RenderObjectForm";
import { settings, samples } from '../settings';
import UserContext from '../UserContext'

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../components/highlightjs-turtle';
import { gridColumnsSelector } from '@mui/x-data-grid';
hljs.registerLanguage("turtle", hljsDefineTurtle)

const sentenceToAnnotate = [
  {
    text: "Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.", 
    url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=491aea85-5a55-4a7c-b1cf-a123fea4377d"
  },
  {
    text: "Xyrem is indicated for the treatment of cataplexy or excessive daytime sleepiness (EDS) in patients 7 years of age and older with narcolepsy.", 
    url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=926eb076-a4a8-45e4-91ef-411f0aa4f3ca"
  },
]

const BIOLINK = 'https://w3id.org/biolink/vocab/'

export default function AnnotateText() {
  const theme = useTheme();
  const { user }: any = useContext(UserContext)
  // const { user, setUser }: any = useContext(UserContext)

  const useStyles = makeStyles(() => ({
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      // color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.light,
        textDecoration: 'none',
      },
    },
    settingsForm: {
      width: '100%',
      // textAlign: 'center',
      '& .MuiFormControl-root': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
      '& .MuiFormHelperText-root': {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(1),
      },
    },
    input: {
      background: 'white',
      fontSize: '11px',
      fontFamily: 'monospace'
    },
    saveButton: {
      textTransform: 'none',
      margin: theme.spacing(2, 2),
    },
    addEntryButton: {
      textTransform: 'none',
      marginLeft: theme.spacing(2),
      // marginTop: theme.spacing(2),
    },
    fullWidth: {
      width: '100%',
    },
    autocomplete: {
      marginRight: theme.spacing(2)
    },
    formInput: {
      background: 'white',
      width: '100%'
    },
    smallerFont: {
      fontSize: '12px',
    },
    alignLeft: {
      textAlign: 'left'
    },
    paperPadding: {
      padding: theme.spacing(2, 2),
      margin: theme.spacing(2, 2),
    },
    paperTitle: {
      fontWeight: 300,
      marginBottom: theme.spacing(1),
    }
  }))
  const classes = useStyles();

  // useLocation hook to get URL params
  let location = useLocation();
  const entitiesType: any = {}
  const [state, setState] = React.useState({
    // inputText: 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.',
    inputText: '',
    inputSource: '',
    editInputText: '',
    templateSelected: 'BioLink reified associations',
    entitiesAnnotations: [],
    entitiesList: [],
    entitiesType: entitiesType,
    statements: [{'s': '', 'p': '', 'o': '', 'props': []}],
    propertiesList: [
      {id: 'https://w3id.org/biolink/vocab/treats', curie: 'biolink:treats', label: 'Treats', type: 'BioLink'},
      {id: 'https://w3id.org/biolink/vocab/treatedBy', curie: 'biolink:treatedBy', label: 'Treated by', type: 'BioLink'},
    ],
    loading: false,
    open: false,
    dialogOpen: false,
    np_jsonld: samples['Drug indication with the BioLink model'],
    sample_selected: 'Drug indication with the BioLink model',
    published_nanopub: '',
    csvwColumnsArray: [],
    jsonld_uri_provided: null,
    // ontology_list: ['https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.ttl'],
    ontology_list: [],
    ontologies: {
      'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.ttl': {},
      'https://schema.org/version/latest/schemaorg-current-https.jsonld': {},
    },
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
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);
  
  // Original form and output:
  // Questions: https://github.com/kodymoodley/fair-metadata-generator/blob/main/questions.csv
  // Full output: https://github.com/kodymoodley/fair-metadata-html-page-generator/blob/main/testdata/inputdata/test.jsonld

  React.useEffect(() => {
    // Get the edit URL param if provided, and download ontology if @context changed
    // Ontology is stored in state.ontology_jsonld 
    // and passed to renderObjectForm to resolve classes and properties
    const params = new URLSearchParams(location.search + location.hash);
    if (!state.inputText) {
      const randomSentence = sentenceToAnnotate[Math.floor(Math.random() * sentenceToAnnotate.length)]
      updateState({
        inputText: randomSentence.text,
        editInputText: randomSentence.text,
        inputSource: randomSentence.url,
      })
    }
    // let jsonld_uri_provided = params.get('edit');
    // for (const onto_url of state.ontology_list) {
    //   console.log('ontology url', onto_url);
    //   downloadOntology(onto_url)
    // }
    
    // if (jsonld_uri_provided) {
    //   axios.get(jsonld_uri_provided)
    //     .then(res => {
    //       updateState({
    //         np_jsonld: res.data,
    //         jsonld_uri_provided: jsonld_uri_provided,
    //       })
    //       // downloadOntology(res.data['@context'])
    //     })
    // } 
    // else {
    //   downloadOntology(state.np_jsonld['@context'])
    // }
    
  }, [state.np_jsonld])

  const ents = [
    {type: 'chemicalentity', color: {r: 166, g: 226, b: 45}},
    {type: 'drug', color: {r: 67, g: 198, b: 252}},
    {type: 'diseaseorphenotypicfeature', color: {r: 47, g: 187, b: 171}}
]

  const downloadOntology  = (contextUrl: string) => {
    // Download the ontology JSON-LD 
    if (!contextUrl) {
      // Handle when no @context provided, use schema.org by default
      contextUrl = 'https://schema.org/'
      // if (!state.np_jsonld['@context']) updateState({...state.np_jsonld, '@context': contextUrl})
      console.log('No @context provided, using schema.org by default');
    }
    if (contextUrl.startsWith('https://schema.org') || contextUrl.startsWith('https://schema.org')) {
      // Schema.org does not enable content-negociation 
      contextUrl = 'https://schema.org/version/latest/schemaorg-current-https.jsonld'
    }
    if (contextUrl.startsWith('http://')) {
      // Resolving http:// ontologies is prevented by mixed active content (query http from https)
      // We would need to deploy on our own DNS to use http (https is forced on github.io URLs)
      contextUrl = contextUrl.replace('http://', 'https://')
    }
    // Try to download the ontology provided in @context URL as JSON-LD
    // curl -iL -H 'Accept: application/ld+json' http://www.w3.org/ns/csvw
    axios.defaults.headers.common['Accept'] = 'application/ld+json'
    axios.get(contextUrl)
      .then(res => {
        // console.log('ontology downloaded!')
        // console.log(res.data)
        // if not json
        if (typeof res.data !== 'object') {
          // If not object, we try to parse
          // const jsonLDList = await jsonld.fromRDF(result.quadList)
          // TODO: support other types than just RDF/XML
          toJSONLD(res.data, contextUrl)
            .then((jsonld_rdf) => {
              console.log('Ontology downloaded, and converted to JSON-LD RDF:');
              console.log(jsonld_rdf);
              updateState({
                ontology_jsonld: {
                  '@context': contextUrl,
                  '@graph': jsonld_rdf
                }
              })
              updateState({ontoload_success_open: true})
              // jsonld.flatten(doc, (err: any, flattened: any) => {
              //     console.log('flattened')
              //     console.log(flattened)
              //     // jsonld.frame(flattened, frame, (err: any, framed: any) => {
              //     //     resolve(framed)
              //     // })
              // })
            })
        } else {
          updateState({
            ontology_jsonld: res.data
          })
          updateState({ontoload_success_open: true})
        }
      })
      .catch(error => {
        updateState({ontoload_error_open: true})
        console.log(error)
      })
  }

  const toJSONLD = (data: any, uri: any) => {
    // Convert RDF to JSON-LD using rdflib
    let rdf_format = 'application/rdf+xml';
    if (uri.endsWith('.ttl')) rdf_format = 'text/turtle'
    if (uri.endsWith('.nq')) rdf_format = 'application/n-quads'
    // Or text/x-nquads
    if (uri.endsWith('.nt')) rdf_format = 'application/n-triples'
    if (uri.endsWith('.n3')) rdf_format = 'text/n3'
    if (uri.endsWith('.trig')) rdf_format = 'application/trig'
    return new Promise((resolve, reject) => {
        let store = $rdf.graph()
        let doc = $rdf.sym(uri);
        $rdf.parse(data, store, uri, rdf_format)
        // console.log(store)
        $rdf.serialize(doc, store, uri, 'application/ld+json', (err: any, jsonldData: any) => {
          return resolve(JSON.parse(jsonldData)
            .sort((a: any, b: any) => {
              if (a['@type'] && b['@type'] && Array.isArray(a['@type']) && Array.isArray(b['@type'])){
                // Handle when array of types provided (e.g. SIO via rdflib)
                return a['@type'][0] < b['@type'][0] ? 1 : -1
              } else {
                return a['@type'] < b['@type'] ? 1 : -1
              }
            })
        )
      })
    })
  }

  const handleUploadKeys  = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    // @ts-ignore
    formData.append("publicKey", event.currentTarget.elements.publicKey.files[0]);
    // @ts-ignore
    formData.append("privateKey", event.currentTarget.elements.privateKey.files[0]);

    const access_token = user['access_token']
    axios.post(
        settings.apiUrl + '/upload-keys', 
        formData, 
        { 
          headers: { 
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
            "type": "formData"
          }
        } 
      )
      .then(res => {
        updateState({
          open: true,
        })
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        window.location.reload();
      })
  }

  const handleExtract  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    updateState({
      loading: true, 
      inputText: state.editInputText,
      entitiesAnnotations: [], 
      entitiesList: [],
      entitiesType: {}
    })
    // var element = document.createElement('a');
    axios.post(
        settings.apiUrl + '/get-entities-relations', 
        {'text': state.editInputText}, 
        // { headers: { Authorization: `Bearer ${access_token}` }} 
      )
      .then(res => {
        const entitiesList: any = []
        console.log(res.data)
        res.data.map((entityMatch: any) => {
          if (entityMatch.curies) {
            Object.keys(entityMatch.curies).map((curie: any) => {
              entitiesList.push({
                id: 'https://identifiers.org/' + curie,
                label: entityMatch.curies[curie][0],
                curie: curie,
                type: entityMatch.type,
                typeMatch: entityMatch.type + ' ' + entityMatch.text
              })
            })
          }
        })
        updateState({
          loading: false,
          entitiesList: entitiesList,
          entitiesAnnotations: res.data
        })
        // console.log(entitiesAnnotations)
      })
      .catch(error => {
        console.log(error)
      })
      // .finally(() => {
      //   hljs.highlightAll();
      // })
  }

  const generateRDF  = () => {
    const stmtJsonld: any = []
    const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
    if (state.templateSelected === 'BioLink reified associations') {
      state.statements.map((stmt: any, index: number) => {
        stmtJsonld.push({
          // '@id': 'https://w3id.org/collaboratory/association/' + index,
          [`${rdf}type`]: {'@id': 'https://w3id.org/biolink/vocab/Association'},
          [`${rdf}subject`]: {'@id': stmt.s},
          [`${rdf}predicate`]: {'@id': stmt.p},
          [`${rdf}object`]: {'@id': stmt.o},
        })
      })
    } else if (state.templateSelected === 'RDF reified statements') {
      state.statements.map((stmt: any, index: number) => {
        stmtJsonld.push({
          [`${rdf}type`]: {'@id': `${rdf}Statement`},
          [`${rdf}subject`]: {'@id': stmt.s},
          [`${rdf}predicate`]: {'@id': stmt.p},
          [`${rdf}object`]: {'@id': stmt.o},
        })
      })
    } else {
      // Plain RDF
      state.statements.map((stmt: any) => {
        stmtJsonld.push({
          '@id': stmt.s,
          [stmt.p]: stmt.o
        })
      })
    }
    // Add triples for types
    Object.keys(state.entitiesType).map((entity: any) => {
      stmtJsonld.push({
        '@id': entity,
        '@type': state.entitiesType[entity]
      })
    })
    return stmtJsonld
  }

  const handleDownloadRDF  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    // var element = document.createElement('a');
    console.log(user);
    const stmtJsonld: any = generateRDF()
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stmtJsonld, null, 4)));
    element.setAttribute('download', 'annotation.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const handleSubmit  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    // var element = document.createElement('a');
    console.log(user);
    const stmtJsonld: any = generateRDF()
    // console.log(stmtJsonld)
    if (!user.error) {
      console.log('Publishing!', stmtJsonld)
      let requestParams = ''
      if (state.inputSource) {
        requestParams = `?source=${state.inputSource}`
      }
      const access_token = user['access_token']
      axios.post(
          `${settings.apiUrl}/assertion${requestParams}`,
          stmtJsonld, 
          { headers: { Authorization: `Bearer ${access_token}` }} 
        )
        .then(res => {
          console.log(res)
          updateState({
            open: true,
            published_nanopub: res.data
          })
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          hljs.highlightAll();
        })
    } else {
      console.log('You need to be logged in with ORCID to publish a Nanopublication')
    }
    // element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.np_jsonld, null, 4)));
    // element.setAttribute('download', 'metadata.json');
    // element.style.display = 'none';
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
    // setState({...state, open: true})
  }

  // Close Snackbars
  const closeOntoloadError = () => {
    updateState({...state, ontoload_error_open: false})
  };
  const closeOntoloadSuccess = () => {
    updateState({...state, ontoload_success_open: false})
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ [event.target.id]: event.target.value})
  }

  // Handle TextField changes for SPARQL endpoint upload
  // const handleStmtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // event.preventDefault
  //   const property = event.target.id.split(':')[0]
  //   const index = event.target.id.split(':')[1]
  //   const stmts: any = state.statements
  //   console.log('index', index)
  //   console.log('stmts', stmts)
  //   console.log('stmts index', stmts[index])
  //   stmts[index][property] = event.target.value
  //   updateState({statements: stmts})
  //   console.log(state.statements)
  // }

  const addStatement  = (event: React.FormEvent) => {
    event.preventDefault();
    const stmts: any = state.statements
    stmts.push({'s': '', 'p': '', 'o': '', 'props': []})
    updateState({statements: stmts})
  }
  const addProperty = (event: React.FormEvent)=> {
    // event.preventDefault();
    const stmts: any = state.statements
    // @ts-ignore
    const stmtIndex = event.target.id.split('-')[0].split(':')[1]
    console.log(event.target.id)
    console.log(stmtIndex)
    stmts[stmtIndex]['props'].push({p: '', o: ''})
    updateState({statements: stmts})
  }
  const handleAutocomplete = (event: any, newInputValue: any) => {
    const stmts: any = state.statements
    if (event.target.id.startsWith('prop:')) {
      // Edit properties of a statement
      const property = event.target.id.split('-')[0].split(':')[1]
      const index = event.target.id.split('-')[0].split(':')[2]
      if (newInputValue) {
        stmts[index]['props'][property] = newInputValue.id as string
        updateState({statements: stmts})
      }
    } else {
      // Edit a statement
      const property = event.target.id.split('-')[0].split(':')[0]
      const index = event.target.id.split('-')[0].split(':')[1] 
      if (newInputValue) {
        stmts[index][property] = newInputValue.id as string
        updateState({statements: stmts})
      }
      // Add type based on labels extracted
      const entitiesType: any = state.entitiesType
      if (!(newInputValue.id in entitiesType)) {
        state.entitiesList.map((entity: any) => {
          if (entity.id == newInputValue.id) {
            entitiesType[entity.id] = BIOLINK + entity.type
            updateState({entitiesType: entitiesType})
          }
        })
      }
    }
  }

  const triplesTemplates = ["BioLink reified associations", "RDF reified statements", "Plain RDF"]
  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({templateSelected: event.target.value})
    // hljs.highlightAll();
  }

  const handleRemoveStmt = (index: number) => {
    const stmts = state.statements
    stmts.splice(index, 1);
    updateState({statements: stmts})
    // hljs.highlightAll();
  }


  const handleSelectSample = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: not working properly
    // updateState({np_jsonld: null})
    const np_jsonld = samples[event.target.value]
    updateState({np_jsonld})
    updateState({sample_selected: event.target.value})
    // console.log(samples[event.target.value]);
    // setState({...state, np_jsonld: samples[event.target.value]})
  };

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        📝 Annotate biomedical text
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        This service allows you to easily annotate biomedical text using popular identification systems (such as MONDO, PubChem, or CHEBI), and the RDF Linked Data standards.
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        ⚙️ A machine learning model automatically extracts biomedical entities from the given text, classify them in different types from the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a> (chemical, disease, etc), and retrieve potential standard identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator Name Resolution API</a>.
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 You can then compose the statements representing the different assertions present in the text using standard identifiers and properties from the BioLink model.
      </Typography>
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🗜️ In the last step you will define the model used to generate the statements, reified associations enable you to attach additional properties to each statement.
      </Typography> */}
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        📥️ Finally you can either download the statements as RDF, or directly publish them in a Nanopublication. 
      </Typography>

      {/* <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(1)}}>
        Load and edit <a href="https://json-ld.org/" className={classes.link} target="_blank" rel="noopener noreferrer">JSON-LD</a> <a href="https://en.wikipedia.org/wiki/Resource_Description_Framework" className={classes.link} target="_blank" rel="noopener noreferrer">RDF</a> files in a user-friendly web interface, with autocomplete based on the classes and properties of the ontology loaded ✨️
      </Typography> */}

      <Card className={classes.paperPadding} style={{textAlign: 'center'}}>
        { !user.id &&
          <Typography>
            🔒️ You need to login with ORCID to publish Nanopublications
          </Typography>
        }
        { user.id && user.keyfiles_loaded && 
          <Typography>
            ✅ Your authentication keys are successfully loaded, you can start publishing Nanopublications
          </Typography>
        }

        { user.id && !user.keyfiles_loaded && 
          <>
            <Card className={classes.paperPadding} >
              <Typography>
                🔑 You need to upload the authentication keys bound to your ORCID to publish Nanopublications (public and private encryption keys):
              </Typography>
              <form encType="multipart/form-data" action="" onSubmit={handleUploadKeys} 
                  style={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                <Typography style={{marginTop: theme.spacing(1)}}>
                  Select the <b>Public</b> key:&nbsp;&nbsp;
                  <input type="file" id="publicKey" />
                </Typography>
                <Typography style={{marginTop: theme.spacing(1)}}>
                  Select the <b>Private</b> key:&nbsp;&nbsp;
                  <input type="file" id="privateKey" />
                </Typography>

                <Button type="submit" 
                  variant="contained" 
                  className={classes.saveButton} 
                  startIcon={<UploadIcon />}
                  style={{textTransform: 'none', marginTop: theme.spacing(1)}}
                  color="secondary" >
                    Upload your keys
                </Button>
              </form>
            </Card>
          </>
        }
      </Card>

      <Typography variant='body1' style={{marginBottom: theme.spacing(2)}}>
        1. Extract biomedical entities from text:
      </Typography>

      <form onSubmit={handleExtract}>
        <FormControl className={classes.settingsForm}>

          <TextField
            id='editInputText'
            label='Text to annotate'
            placeholder='Text to annotate'
            value={state.editInputText}
            required
            multiline
            // className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextChange}
            size='small'
            InputProps={{
              className: classes.input
            }}
            InputLabelProps={{ required: false }}
          />

          <TextField
            id='inputSource'
            label='Source URL (optional)'
            placeholder='Source URL (optional)'
            value={state.inputSource}
            required
            // className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextChange}
            size='small'
            InputProps={{
              className: classes.input
            }}
            InputLabelProps={{ required: false }}
          />

          <div style={{width: '100%', textAlign: 'center', marginBottom: theme.spacing(2)}}>
            <Button type="submit" 
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<ExtractIcon />}
              color="secondary" >
                Extract entities
            </Button>
          </div>
          {/* <Snackbar open={state.json_error_open} onClose={closeJsonError} autoHideDuration={10000}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              The JSON-LD provided is not valid ❌️
            </MuiAlert>
          </Snackbar>
          <Snackbar open={state.json_loaded_open} onClose={closeJsonLoaded} autoHideDuration={10000}>
            <MuiAlert elevation={6} variant="filled" severity="info">
              Your JSON-LD has been loaded. Trying to load the ontology from the URL provided in @context...
            </MuiAlert>
          </Snackbar> */}
        </FormControl>
      </form>

      { state.loading &&
        <Box sx={{textAlign: 'center', margin: theme.spacing(10, 0)}} >
          <CircularProgress style={{textAlign: 'center'}} />
        </Box>
      }

      { state.entitiesAnnotations.length > 0 &&
        <Card className={classes.paperPadding} >
          <Taggy text={state.inputText} spans={state.entitiesAnnotations} ents={ents} />
        </Card>
      }

      <Typography variant='body1' style={{marginBottom: theme.spacing(2)}}>
        2. Define the statements that represent the assertions made in the text:
      </Typography>

      {/* <Grid container spacing={2}> */}
      { state.statements.map((stmtRow: any, index: number) => { 
        // {console.log(stmtRow)}
        // {console.log(stmtRow.s)}
        // {console.log(index)}
        // return <Box key={index} style={{marginBottom: theme.spacing(1)}}>
        return <Grid container spacing={2} key={index} style={{marginBottom: theme.spacing(1)}}>
            <Grid item xs={4}>
              <Autocomplete
                key={'s:'+index}
                id={'s:'+index}
                freeSolo
                options={state.entitiesList}
                onChange={handleAutocomplete}
                getOptionLabel={(option: any) => option.label + ' (' + option.curie + ')'}
                groupBy={(option) => option.typeMatch}
                // required={true}
                // defaultValue={[top100Films[13]]}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size='small'
                    className={classes.input}
                    label="Subject"
                    placeholder="Subject"
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Autocomplete
                key={'p:'+index}
                id={'p:'+index}
                freeSolo
                options={state.propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                // options={state.propertiesList}
                onChange={handleAutocomplete}
                getOptionLabel={(option: any) => option.label + ' (' + option.curie + ')'}
                // required={true}
                // defaultValue={[top100Films[13]]}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size='small'
                    className={classes.input}
                    label="Predicate"
                    placeholder="Predicate"
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                key={'o:'+index}
                id={'o:'+index}
                freeSolo
                options={state.entitiesList}
                onChange={handleAutocomplete}
                getOptionLabel={(option: any) => option.label + ' (' + option.curie + ')'}
                groupBy={(option) => option.typeMatch}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size='small'
                    className={classes.input}
                    label="Object"
                    placeholder="Object"
                  />
                )}
              />
            </Grid>

            <Grid item xs={1}>
              <Tooltip title={<Typography style={{textAlign: 'center'}}>Delete the statement</Typography>}>
                <IconButton onClick={() => handleRemoveStmt(index)} color="default">
                    <RemoveIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            {/* TODO: Add props to each statement */}
            {/* { state.statements[index].props.map((prop: any, pindex: number) => { 
              <Grid container spacing={2} key={'prop' + prop + pindex} style={{marginLeft: theme.spacing(5), marginBottom: theme.spacing(1)}}>
              {console.log(prop)}
              <Grid item xs={4}>
                <Autocomplete
                  // key={'prop:p:'+pindex}
                  id={'prop:p:'+pindex}
                  value={prop.p}
                  freeSolo
                  options={state.propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                  onChange={handleAutocomplete}
                  getOptionLabel={(option: any) => option.label + ' (' + option.curie + ')'}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small'
                      className={classes.input}
                      label="Property predicate"
                      placeholder="Property predicate"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Autocomplete
                  key={'prop:o:'+pindex}
                  id={'prop:o:'+pindex}
                  value={prop.o}
                  freeSolo
                  options={state.entitiesList}
                  onChange={handleAutocomplete}
                  getOptionLabel={(option: any) => option.label + ' (' + option.curie + ')'}
                  groupBy={(option) => option.typeMatch}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small'
                      className={classes.input}
                      label="Property object"
                      placeholder="Property object"
                    />
                  )}
                />
              </Grid>
            </Grid>
            })
          } 
          <Button 
            // onClick={addProperty(index)}
            onClick={addProperty}
            id={"addProp:" + index}
            variant="contained" 
            className={classes.saveButton} 
            startIcon={<AddIcon />}
            style={{textTransform: 'none', marginTop: theme.spacing(1)}}
            color="secondary" >
              Add a property to this statement
          </Button> */}
        </Grid>
        {/* </Box> */}
      })}
      {/* </Grid> */}
      <Button onClick={addStatement}
        variant="contained" 
        className={classes.saveButton} 
        startIcon={<AddIcon />}
        style={{textTransform: 'none', marginTop: theme.spacing(1)}}
        color="primary" >
          Add a statement
      </Button>

      <Typography variant='body1' style={{marginTop: theme.spacing(3), marginBottom: theme.spacing(2)}}>
        3. Choose the template used to generate the triples:
      </Typography>
      <TextField select
          value={state.templateSelected} 
          label={"Use the template"} 
          id="collectionSelected" 
          onChange={handleTemplateChange} 
          SelectProps={{ MenuProps: { disableScrollLock: true } }}
          style={{marginBottom: theme.spacing(3), backgroundColor: 'white'}}
          variant="outlined"> 
        { triplesTemplates.map((template: any, key: number) => (
          <MenuItem key={template} value={template}>{template}</MenuItem>
        ))}
      </TextField>

      <form onSubmit={handleSubmit}>
        <FormControl className={classes.settingsForm}>

          {/* Button to download the JSON-LD */}
          <div style={{width: '100%', textAlign: 'center'}}>
            <Button 
              onClick={handleDownloadRDF}
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<DownloadIcon />}
              style={{marginRight: theme.spacing(2)}}
              color="secondary" >
                Download RDF
            </Button>
            <Button type="submit" 
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<GenerateIcon />}
              disabled={!user.id}
              style={{marginRight: theme.spacing(2)}}
              color="info" >
                Generate Nanopublication
            </Button>
            <Button type="submit" 
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<PublishIcon />}
              disabled={!user.id}
              color="warning" >
                Publish Nanopublication
            </Button>
            { !user.id &&
              <Typography style={{marginTop: theme.spacing(2)}}>
                🔒️ You need to login with ORCID to generate Nanopublications
              </Typography>
            }
          </div>
        </FormControl>
      </form>
      {state.published_nanopub &&
        <pre style={{whiteSpace: 'pre-wrap'}}>
          <code className="language-turtle">
            {state.published_nanopub}
          </code>
        </pre>
      }
    </Container>
  )
}
