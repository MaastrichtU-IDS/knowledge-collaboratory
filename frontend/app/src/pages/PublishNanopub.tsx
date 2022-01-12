import React, { useContext } from 'react';
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Card, FormControl, Snackbar, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DownloadJsonldIcon from '@mui/icons-material/Description';
import UploadTriplestoreIcon from '@mui/icons-material/Share';
import UploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';

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
hljs.registerLanguage("turtle", hljsDefineTurtle)

export default function PublishNanopub() {
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
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    wizard_jsonld: wizard_jsonld,
    sample_selected: 'Drug indication with the BioLink model',
    published_nanopub: '',
    csvwColumnsArray: [],
    jsonld_uri_provided: null,
    // ontology_list: ['https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.ttl'],
    ontology_list: [],
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
    let jsonld_uri_provided = params.get('edit');
    let editionEnabled = params.get('toysrus');
    if (editionEnabled === 'closed') {
      // Disable edit if toysrus=closed
      updateState({ edit_enabled: false })
    }
    for (const onto_url of state.ontology_list) {
      console.log('ontology url', onto_url);
      downloadOntology(onto_url)
    }
    
    if (jsonld_uri_provided) {
      axios.get(jsonld_uri_provided)
        .then(res => {
          updateState({
            wizard_jsonld: res.data,
            jsonld_uri_provided: jsonld_uri_provided,
          })
          // downloadOntology(res.data['@context'])
        })
    } 
    // else {
    //   downloadOntology(state.wizard_jsonld['@context'])
    // }
    
  }, [state.wizard_jsonld])

  const downloadOntology  = (contextUrl: string) => {
    // Download the ontology JSON-LD 
    if (!contextUrl) {
      // Handle when no @context provided, use schema.org by default
      contextUrl = 'https://schema.org/'
      // if (!state.wizard_jsonld['@context']) updateState({...state.wizard_jsonld, '@context': contextUrl})
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
        window.location.reload(false);
      })
  }

  const handleSubmit  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    // var element = document.createElement('a');
    console.log(user);
    if (!user.error) {
      const access_token = user['access_token']
      axios.post(
          settings.apiUrl + '/assertion', 
          state.wizard_jsonld, 
          { headers: { Authorization: `Bearer ${access_token}` }} 
        )
        .then(res => {
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
    // element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.wizard_jsonld, null, 4)));
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

  // Handle TextField changes for SPARQL endpoint upload
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({[event.target.id]: event.target.value})
  }
  const handleSelectSample = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: not working properly
    // updateState({wizard_jsonld: null})
    const wizard_jsonld = samples[event.target.value]
    updateState({wizard_jsonld})
    updateState({sample_selected: event.target.value})
    // console.log(samples[event.target.value]);
    // setState({...state, wizard_jsonld: samples[event.target.value]})
  };

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        📬️ Publish Nanopublications
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
            ✅ Your authentications keys are successfully loaded, you can start publishing Nanopublications
          </Typography>
        }

        { user.id && !user.keyfiles_loaded && 
          <>
            <Typography>
              🔑 You need to upload the authentications keys binded to your ORCID for Nanopublications publishing (public and private encryption keys).
            </Typography>
            <Card className={classes.paperPadding}>
              <form encType="multipart/form-data" action="" onSubmit={handleUploadKeys}>
                <Typography>
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

        <InputLabel id="demo-simple-select-label" style={{ marginTop: theme.spacing(2) }}>
          Load a template:
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state.sample_selected}
          label="Load a template"
          // style={{ backgroundColor: '#ffffff'}}
          onChange={handleSelectSample}
        >
          { Object.keys(samples).map((query_label: any, key: number) => (
            <MenuItem key={key} value={query_label}>{query_label}</MenuItem>
          ))}
        </Select>

        <Typography style={{marginTop: theme.spacing(1)}}>
          Or
        </Typography>

        {/* Display the JSON-LD file uploader (if no ?edit= URL param provided) */}
        {!state.jsonld_uri_provided &&
          <JsonldUploader renderObject={state.wizard_jsonld} 
            onChange={(wizard_jsonld: any) => {updateState({wizard_jsonld})}} />
        }
      </Card>

      {/* <CsvUploader 
        csvwColumnsArray={state.csvwColumnsArray}
        onChange={(csvwColumnsArray: any) => {updateState({csvwColumnsArray})}} 
      /> */}

      <Snackbar open={state.ontoload_error_open} onClose={closeOntoloadError} autoHideDuration={10000}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          The ontology provided in @context could not be loaded from {state.wizard_jsonld['@context']}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={state.ontoload_success_open} onClose={closeOntoloadSuccess} autoHideDuration={10000}>
        <MuiAlert elevation={6} variant="filled" severity="success">
          The ontology {state.wizard_jsonld['@context']} from @context has been loaded successfully, it will be used for classes and properties autocomplete
        </MuiAlert>
      </Snackbar>

      <form onSubmit={handleSubmit}>
        <FormControl className={classes.settingsForm}>

          {/* First call of RenderObjectForm (the rest is handled recursively in this component) */}
          <RenderObjectForm
            renderObject={state.wizard_jsonld}
            ontologyObject={state.ontology_jsonld}
            onChange={(wizard_jsonld: any) => { updateState({wizard_jsonld})} }
            fullJsonld={state.wizard_jsonld}
            editEnabled={state.edit_enabled}
            parentProperty='root'
            parentType='root'
          />

          {/* Button to download the JSON-LD */}
          <div style={{width: '100%', textAlign: 'center'}}>
            <Button type="submit" 
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<DownloadJsonldIcon />}
              disabled={!user.id}
              color="secondary" >
                Publish as a Nanopublication
            </Button>
            { !user.id &&
              <Typography style={{marginTop: theme.spacing(2)}}>
                🔒️ You need to login with ORCID to publish Nanopublications
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

// https://purl.org/np/RAuN1kyW1BD9754LCUVWozDOhkrUaLUyb5LTu0HcsulIE
const wizard_jsonld = {
  "@context": "https://raw.githubusercontent.com/biolink/biolink-model/master/context.jsonld",
  "@wizardQuestions": {
    'rdf:subject': 'Subject of the association:',
    'rdf:predicate': 'Predicate of the association:',
    'rdf:object': 'Object of the association:',
    'biolink:provided_by': 'Association provided by dataset:',
    'biolink:publications': 'Publication supporting the association:',
    'biolink:association_type': 'Type of the association:',
    'biolink:relation': 'Type of drug indication:',
    'biolink:has_population_context': 'Population context of the drug indication:'
  },
  "@type": "rdf:Statement",
  "rdfs:label": "An atypical drug is now increasingly used as an off-label indication for the management of cancer patients",
  "rdf:subject": {
    "@id": "https://go.drugbank.com/drugs/DB00334",
    "@type": "biolink:Drug"
  },
  "rdf:predicate": {
    "@id": "biolink:treats"
  },
  "rdf:object": {
    "@id": "https://identifiers.org/HP:0002017",
    "@type": "biolink:Disease"
  },
  "biolink:association_type": {
    "@id": "biolink:ChemicalToDiseaseOrPhenotypicFeatureAssociation"
  },
  "biolink:relation": {"@id" : "https://w3id.org/um/neurodkg/OffLabelIndication"},
  "biolink:provided_by": {"@id" : "https://w3id.org/um/NeuroDKG"},
  "biolink:publications": {"@id" : "https://pubmed.ncbi.nlm.nih.gov/29061799/"},
  "biolink:has_population_context": {
    "rdfs:label": "Adults",
    "biolink:category": {"@id": "biolink:Cohort"},
    "biolink:has_phenotype": {
      "@id": "https://identifiers.org/MONDO:0004992",
      "@type": "biolink:Phenotype"
    }
  }
}
