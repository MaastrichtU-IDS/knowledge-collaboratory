import React, { useContext } from 'react';
import { useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Popper, ClickAwayListener, Paper, Container, Box, CircularProgress, Tooltip, IconButton, Autocomplete, Button, Card, FormControl, TextField, Snackbar, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DownloadJsonldIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/AddBox';
import UploadIcon from '@mui/icons-material/FileUpload';
import RemoveIcon from '@mui/icons-material/Delete';
import ExtractIcon from '@mui/icons-material/AutoFixHigh';
import GenerateIcon from '@mui/icons-material/FactCheck';
import PublishIcon from '@mui/icons-material/Backup';
import DownloadIcon from '@mui/icons-material/Download';
import ShexIcon from '@mui/icons-material/TaskAlt';
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

import { settings, samples, propertiesList, predicatesList, sentenceToAnnotate, biolinkShex } from '../settings';

import UserContext from '../UserContext'

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../components/highlightjs-turtle';
// import { gridColumnsSelector } from '@mui/x-data-grid';
hljs.registerLanguage("turtle", hljsDefineTurtle)

// Define namespaces for building RDF URIs
const BIOLINK = 'https://w3id.org/biolink/vocab/'
const IDO = 'https://identifiers.org/'


export default function AnnotateText() {
  const theme = useTheme();
  const { user }: any = useContext(UserContext)

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
    formInput: {
      background: 'white',
      width: '100%'
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
  const tagSelected: any = null
  const [state, setState] = React.useState({
    // inputText: 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.',
    inputText: '',
    inputSource: '',
    editInputText: '',
    templateSelected: 'BioLink reified associations',
    entitiesList: [],
    relationsList: [],
    entitiesType: entitiesType,
    tagSelected: tagSelected,
    statements: [{'s': '', 'p': '', 'o': '', 'props': []}],
    predicatesList: predicatesList,
    propertiesList: propertiesList,
    loading: false,
    open: false,
    dialogOpen: false,
    np_jsonld: samples['Drug indication with the BioLink model'],
    sample_selected: 'Drug indication with the BioLink model',
    published_nanopub: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  // Settings for Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl]: any = React.useState(null);
  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(anchorEl ? null : anchorEl);
  };
  // const id = open ? 'simple-popper' : undefined;
  

  React.useEffect(() => {
    // const params = new URLSearchParams(location.search + location.hash);
    // let sentences_url = params.get('sentences');
    // Get a random sentence to annotate
    if (!state.inputText) {
      const randomSentence = sentenceToAnnotate[Math.floor(Math.random() * sentenceToAnnotate.length)]
      updateState({
        inputText: randomSentence.text,
        editInputText: randomSentence.text,
        inputSource: randomSentence.url,
      })
    }
    
  }, [state.np_jsonld])

  // TODO: complete the list of ents?
  const ents = [
    {type: 'ChemicalEntity', label: 'Chemical Entity', id: BIOLINK + 'ChemicalEntity', 
      curie: 'biolink:ChemicalEntity', color: {r: 166, g: 226, b: 45}},
    {type: 'Drug', label: 'Drug', id: BIOLINK + 'Drug', 
      curie: 'biolink:Drug', color: {r: 67, g: 198, b: 252}},
    {type: 'DiseaseOrPhenotypicFeature', label: 'Disease or Phenotypic Feature', id: BIOLINK + 'DiseaseOrPhenotypicFeature', 
      curie: 'biolink:DiseaseOrPhenotypicFeature', color: {r: 47, g: 187, b: 171}},
    {type: 'GeneOrGeneProduct', label: 'Gene or Gene Product', id: BIOLINK + 'GeneOrGeneProduct', 
      curie: 'biolink:GeneOrGeneProduct', color: {r: 218, g: 112, b: 214}},
    {type: 'SequenceVariant', label: 'Sequence Variant', id: BIOLINK + 'SequenceVariant', 
      curie: 'biolink:SequenceVariant', color: {r: 0, g: 206, b: 209}},
    {type: 'OrganismTaxon', label: 'Organism Taxon', id: BIOLINK + 'OrganismTaxon', 
      curie: 'biolink:OrganismTaxon', color: {r: 0, g: 206, b: 209}},
    {type: 'Association', label: 'Association', id: BIOLINK + 'Association', 
      curie: 'biolink:Association', color: {r: 0, g: 206, b: 209}}
  ]


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
    event.preventDefault();
    updateState({
      loading: true, 
      inputText: state.editInputText,
      entitiesList: [],
      entitiesType: {}
    })
    axios.post(
        settings.apiUrl + '/get-entities-relations', 
        {'text': state.editInputText}, 
        {'params': {'extract_relations': true}}
      )
      .then(res => {
        // const entitiesList: any = []
        // console.log(res.data)
        // res.data.entities.map((entityMatch: any) => {
        //   if (entityMatch.curies) {
        //     Object.keys(entityMatch.curies).map((curie: any) => {
        //       entitiesList.push({
        //         id: 'https://identifiers.org/' + curie,
        //         label: entityMatch.curies[curie][0],
        //         curie: curie,
        //         type: entityMatch.type,
        //         typeMatch: entityMatch.type + ' ' + entityMatch.text
        //       })
        //     })
        //   }
        // })
        updateState({
          loading: false,
          entitiesList: res.data.entities,
          relationsList: res.data.relations,
          statements: res.data.statements
        })
      })
      .catch(error => {
        console.log(error)
      })
      // .finally(() => {
      //   hljs.highlightAll();
      // })
  }

  const getPropValue  = (prop: any) => {
    if (prop['id_uri']) {
      return prop.id_uri
    }
    if (prop['id']) {
      return prop.id
    }
    return prop.text
  }

  const generateRDF  = () => {
    const stmtJsonld: any = []
    const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
    if (state.templateSelected === 'BioLink reified associations') {
      state.statements.map((stmt: any, index: number) => {
        console.log('PPP', stmt.p)
        const reifiedStmt = {
          // '@id': 'https://w3id.org/collaboratory/association/' + index,
          [`${rdf}type`]: {'@id': `${BIOLINK}Association`},
          [`${rdf}subject`]: {'@id': getPropValue(stmt.s)},
          [`${rdf}predicate`]: {'@id': getPropValue(stmt.p)},
          [`${rdf}object`]: {'@id': getPropValue(stmt.o)},
        }
        // Add properties for reified statements
        if (stmt.props) {
          stmt.props.map((stmtProp: any, pindex: number) => {
            reifiedStmt[stmtProp.p] = stmtProp.o
          })
        }
        stmtJsonld.push(reifiedStmt)
      })

    } else if (state.templateSelected === 'RDF reified statements') {
      state.statements.map((stmt: any, index: number) => {
        const reifiedStmt = {
          // '@id': 'https://w3id.org/collaboratory/association/' + index,
          [`${rdf}type`]: {'@id': `${rdf}Statement`},
          [`${rdf}subject`]: {'@id': getPropValue(stmt.s)},
          [`${rdf}predicate`]: {'@id': getPropValue(stmt.p)},
          [`${rdf}object`]: {'@id': getPropValue(stmt.o)},
        }
        // Add properties for reified statements
        if (stmt.props) {
          stmt.props.map((stmtProp: any, pindex: number) => {
            reifiedStmt[stmtProp.p] = stmtProp.o
          })
        }
        stmtJsonld.push(reifiedStmt)
      })

    } else {
      // Plain RDF
      state.statements.map((stmt: any) => {
        stmtJsonld.push({
          '@id': getPropValue(stmt.s),
          [getPropValue(stmt.p)]: getPropValue(stmt.o)
        })
      })
    }
    // Add triples for types
    state.entitiesList.map((entity: any) => {
      if (entity.id_uri && entity.type)
      stmtJsonld.push({
        '@id': entity.id_uri,
        '@type': BIOLINK + entity.type
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


  const shexValidation  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    const stmtJsonld = generateRDF()
    state.statements.map((stmt: any, stmtIndex: number) => {
      console.log(`Validate statement ${stmt.s} with shape ${stmt.shex}`)
      const shapemap = `<${stmt.s}>@<${stmt.shex}>`
      axios.post(
        `${settings.apiUrl}/validation/shex`,
        stmtJsonld, 
        { 
          params: { 
            shape_start: `${BIOLINK}Association`,
            focus_types: `${BIOLINK}Association`,
            shape_url: 'https://raw.githubusercontent.com/biolink/biolink-model/master/biolink-model.shex'
          } 
        } 
      )
      .then(res => {
        console.log(res)
        updateState({shexResults: res.data})
      })
      .catch(error => {
        console.log(error)
      })
    })
    // var element = document.createElement('a');
    // console.log();
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
      const requestParams: any = {}
      if (state.inputSource) {
        requestParams['source'] = state.inputSource
      }
      if (state.inputText) {
        requestParams['quoted_from'] = state.inputText
      }
      const access_token = user['access_token']
      axios.post(
          `${settings.apiUrl}/assertion`,
          stmtJsonld, 
          { 
            headers: { Authorization: `Bearer ${access_token}` },
            params: requestParams
          } 
        )
        .then(res => {
          updateState({
            open: true,
            published_nanopub: res.data
          })
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
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ [event.target.id]: event.target.value})
  }


  const addStatement  = (event: React.FormEvent) => {
    event.preventDefault();
    const stmts: any = state.statements
    stmts.push({'s': '', 'p': '', 'o': '', 'props': [], 
      'shex': {id: `${BIOLINK}Association`, label: 'Association', type: 'ShapeOr'}})
    updateState({statements: stmts})
  }
  const addProperty = (event: React.FormEvent)=> {
    // event.preventDefault();
    const stmts: any = state.statements
    // @ts-ignore
    const stmtIndex = event.target.id.split('-')[0].split(':')[1]
    // @ts-ignore
    console.log(event.target.id);
    console.log(stmtIndex);
    if (!stmts[stmtIndex]['props']) {
      stmts[stmtIndex]['props'] = []
    }
    stmts[stmtIndex]['props'].push({p: '', o: ''})
    updateState({statements: stmts})
    // setState({statements: stmts})
  }
  const handleAutocomplete = (event: any, newInputValue: any) => {
    const stmts: any = state.statements
    if (event && newInputValue) {
      if (event.target.id.startsWith('tag:type')) {
        const entitiesList: any = state.entitiesList
        const tagSelected: any = state.tagSelected
        console.log('TAG TYPE', entitiesList, state.tagSelected.index)
        entitiesList[state.tagSelected.index].type = newInputValue.type
        // console.log('tag id newInputValue', newInputValue)
        tagSelected.type = newInputValue.type
        updateState({tagSelected: tagSelected, entitiesList: entitiesList})
      } else if (event.target.id.startsWith('tag:id')) {
        const entitiesList: any = state.entitiesList
        const tagSelected: any = state.tagSelected
        entitiesList[state.tagSelected.index].id_curie = newInputValue.curie
        entitiesList[state.tagSelected.index].id_label = newInputValue.label
        entitiesList[state.tagSelected.index].id_uri = IDO + newInputValue.curie
        console.log('tag id newInputValue', newInputValue)
        tagSelected.id_curie = newInputValue.curie
        tagSelected.id_label = newInputValue.label
        tagSelected.id_uri = IDO + newInputValue.curie
        if (newInputValue) {
          updateState({tagSelected: tagSelected, entitiesList: entitiesList})
        }
      } else if (event.target.id.startsWith('prop:')) {
        // Edit properties of a statement
        const index = event.target.id.split('-')[0].split(':')[1]
        const property = event.target.id.split('-')[0].split(':')[2]
        const pindex = event.target.id.split('-')[0].split(':')[3]
        if (newInputValue) {
          if (newInputValue.id) {
            stmts[index]['props'][pindex][property] = newInputValue.id as string
          } else {
            stmts[index]['props'][pindex][property] = newInputValue as string
          }
          updateState({statements: stmts})
        }
      } else if (event.target.id.startsWith('shex:')) {
        // Edit properties of a statement
        const index = event.target.id.split('-')[0].split(':')[1]
        if (newInputValue) {
          if (newInputValue.id) {
            stmts[index]['shex'] = newInputValue.id as string
          } else {
            stmts[index]['shex'] = newInputValue as string
          }
          updateState({statements: stmts})
        }
      } else  {
        // Edit a statement
        const property = event.target.id.split('-')[0].split(':')[0]
        const index = event.target.id.split('-')[0].split(':')[1] 
        if (newInputValue) {
          if (newInputValue.id) {
            stmts[index][property] = newInputValue.id as string
          } else {
            stmts[index][property] = newInputValue as string
          }
          updateState({statements: stmts})
        }
        // Add type based on labels extracted
        const entitiesType: any = state.entitiesType
        if (newInputValue && !(newInputValue.id in entitiesType)) {
          state.entitiesList.map((entity: any) => {
            if (entity.id == newInputValue.id) {
              entitiesType[entity.id] = BIOLINK + entity.type
              updateState({entitiesType: entitiesType})
            }
          })
        }
      }
    }
  }
  const getAutocompleteLabel = (option: any, displayProp: string = '') => {
    // console.log('getAutocompleteLabel', option)
    if (displayProp) {
      return option[displayProp]
    }
    if (option.id_label && option.id_curie) {
      return option.id_label + ' (' + option.id_curie + ')'
    }
    if (option.text && option.id_curie) {
      return option.text + ' (' + option.id_curie + ')'
    }
    if (option.label && option.curie) {
      return option.label + ' (' + option.curie + ')'
    }
    if (option.text) {
      return option.text
    }
    if (option.label) {
      return option.label
    }
    if (option.id) {
      return option.id
    }
    return option
  }

  const triplesTemplates = ["BioLink reified associations", "RDF reified statements", "Plain RDF"]
  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({templateSelected: event.target.value})
  }

  const handleRemoveStmt = (index: number) => {
    // TODO: entities that are not anymore relevant are removed when a statement is removed
    const stmts = state.statements
    stmts.splice(index, 1);
    updateState({statements: stmts})
  }
  const handleRemoveEntity = (text: any) => {
    // TODO: entities that are not anymore relevant are removed when a statement is removed
    const entitiesList = state.entitiesList
    console.log(entitiesList, text)
    // Delete the first entity with the same text (not ideal but best quick option)
    entitiesList.splice(entitiesList.findIndex((ent: any) => ent.text === text), 1);
    updateState({entitiesList: entitiesList})
    handleClickAway()
  }
  const handleRemoveProp = (stmtIndex: number, pindex: number) => {
    // TODO: entities that are not anymore relevant are removed when a statement is removed
    const stmts = state.statements
    stmts[stmtIndex].props.splice(pindex, 1);
    updateState({statements: stmts})
  }

  const clickTag = (event: any, tag: any, elemIndex: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((prev) => !prev);
    tag['id'] = tag['type']
    updateState({tagSelected: tag})
    // console.log('entitiesList', state.entitiesList)
    // console.log('Clicked that tag!', elemIndex, tag);
  }

  const highlightCallback = (event: any, text: string, spanIndex: number, start: number, end: number) => {
    const entitiesList: any = state.entitiesList
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((prev) => !prev);
    if (text.length > 1) {
      console.log('TEXT', text)
      const newEntity = {
        index: state.entitiesList.length, 
        text: text, 
        token: text, 
        type: "ChemicalEntity", 
        start: state.inputText.indexOf(text), 
        end: state.inputText.indexOf(text) + text.length + 1, 
        curies: [], id_curie: "", id_label: "", id_uri: ""
      }
      console.log('hightlight newEntity', newEntity)
      entitiesList.push(newEntity)
      // tag['id'] = tag['type']
      updateState({tagSelected: newEntity, entitiesList: entitiesList})
      // console.log('entitiesList', state.entitiesList)
      // // console.log('Clicked that tag!', elemIndex, tag);
      // console.log('highlightCallback!', event)
      // console.log("Start-end highlight", start, end)
    }
  }


  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        🏷️ Annotate biomedical text
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        ℹ️ This service helps you to annotate biomedical text using the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a> and popular identifiers systems (such as MONDO and PubChem). 
        You can then download the annotations as RDF, or publish them in Nanopublications.
        {/* A machine learning model automatically extracts biomedical entities from the given text, classify them in different types from the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a> (chemical, disease, etc), and retrieve potential standard identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator Name Resolution API</a>. */}
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 A machine learning model automatically extracts biomedical entities and relations from the given text, classify them in different types from the BioLink model (chemical, disease, etc), 
        and retrieve potential identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator Name Resolution API</a>.
      </Typography>
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 You can then compose the statements representing the different assertions present in the text using standard identifiers and properties from the BioLink model.
      </Typography> */}
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🗜️ In the last step you will define the model used to generate the statements, reified associations enable you to attach additional properties to each statement.
      </Typography> */}
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        📥️ Finally you can either download the statements as RDF, or directly publish them in a Nanopublication. 
      </Typography> */}

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

      <Popper open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={4} style={{minWidth: theme.spacing(60), padding: theme.spacing(2, 2), textAlign: 'left'}}>
            { state.tagSelected && 
              <>
                <Typography variant='h5' style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
                  {state.tagSelected.token}
                  <Tooltip title={<Typography style={{textAlign: 'center'}}>Delete the entity</Typography>}>
                    <IconButton onClick={() => handleRemoveEntity(state.tagSelected.token)} 
                      style={{marginLeft: theme.spacing(1), alignContent: 'right'}} color="default">
                        <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Autocomplete
                    id={'tag:type'}
                    freeSolo
                    value={state.tagSelected.type}
                    options={ents}
                    onChange={(event: any, newInputValue: any) => handleAutocomplete(event, newInputValue)}
                    onInputChange={handleAutocomplete}
                    // onChange={handleAutocomplete}
                    // onInputChange={handleAutocomplete}
                    getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                    groupBy={(option) => option.type ? option.type : null }
                    style={{marginBottom: theme.spacing(3)}}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size='small'
                        className={classes.input}
                        label="Entity type"
                        placeholder="Entity type"
                      />
                    )}
                  />
                <Autocomplete
                    id={'tag:id'}
                    freeSolo
                    value={state.tagSelected}
                    options={state.tagSelected.curies}
                    onChange={handleAutocomplete}
                    onInputChange={handleAutocomplete}
                    getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                    groupBy={(option) => option.type ? option.type : null }
                    style={{marginBottom: theme.spacing(1)}}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size='small'
                        className={classes.input}
                        label="Entity ID"
                        placeholder="Entity ID"
                      />
                    )}
                  />
              </>
            }
          </Paper>
        </ClickAwayListener>
      </Popper>

      { state.entitiesList.length > 0 &&
        <Card className={classes.paperPadding} >
          <Taggy text={state.inputText} spans={state.entitiesList} 
            ents={ents} onClick={clickTag} onHighlight={highlightCallback}  />
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
        return <Box key={'stmt:' + index}>
          <Grid container spacing={2} key={index} style={{marginBottom: theme.spacing(1), marginTop: theme.spacing(1)}}>
            <Grid item xs={4}>
              <Autocomplete
                key={'s:'+index}
                id={'s:'+index}
                freeSolo
                
                value={state.statements[index].s}
                options={state.entitiesList}
                onChange={handleAutocomplete}
                onInputChange={handleAutocomplete}
                getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                groupBy={(option) => option.type ? option.type : null }
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
                value={state.statements[index].p}
                options={state.predicatesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                // options={state.propertiesList}
                onChange={handleAutocomplete}
                onInputChange={handleAutocomplete}
                getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                // groupBy={(option) => option.type ? option.type : null }
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
                value={state.statements[index].o}
                options={state.entitiesList}
                onChange={handleAutocomplete}
                onInputChange={handleAutocomplete}
                getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                groupBy={(option) => option.type ? option.type : null }
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
          </Grid>
          { state.templateSelected !== 'Plain RDF' && state.statements[index].props &&
            state.statements[index].props.map((prop: any, pindex: number) => { 
              return <Grid container spacing={2} key={'prop' + index + prop + pindex} style={{marginLeft: theme.spacing(5), marginBottom: theme.spacing(1)}}>
              {console.log('In JSX', prop)}
              <Grid item xs={4}>
                <Autocomplete
                  id={'prop:' + index + ':p:'+pindex}
                  freeSolo
                  value={state.statements[index].props[pindex].p}
                  options={state.propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                  onChange={handleAutocomplete}
                  onInputChange={handleAutocomplete}
                  getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small'
                      className={classes.input}
                      label="Property"
                      placeholder="Property"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Autocomplete
                  id={'prop:' + index + ':o:'+pindex}
                  freeSolo
                  value={state.statements[index].props[pindex].o}
                  options={state.entitiesList}
                  onChange={handleAutocomplete}
                  onInputChange={handleAutocomplete}
                  // onKeyPress={handleAutocomplete}
                  getOptionLabel={(option: any) => getAutocompleteLabel(option)}
                  groupBy={(option) => option.type ? option.type : null }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small'
                      className={classes.input}
                      label="Value"
                      placeholder="Value"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title={<Typography style={{textAlign: 'center'}}>Delete the statement</Typography>}>
                  <IconButton onClick={() => handleRemoveProp(index, pindex)} color="default">
                      <RemoveIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            })
          }
          { state.templateSelected !== 'Plain RDF' && 
          <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
            <Button 
              // onClick={() => addProperty(event, index)}
              onClick={addProperty}
              id={"addProp:" + index}
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<AddIcon />}
              style={{marginLeft: theme.spacing(5), marginRight: theme.spacing(4), textTransform: 'none'}}
              color="inherit" >
                Add a property to this statement
            </Button>
            <Typography>
              Validate statement against: 
            </Typography>
            <Autocomplete
              id={'shex:' + index}
              // freeSolo
              options={biolinkShex.shapes}
              onChange={handleAutocomplete}
              onInputChange={handleAutocomplete}
              getOptionLabel={(option: any) => `${option.label} (${option.id})`}
              groupBy={(option) => option.type}
              style={{width: '400px', marginLeft: theme.spacing(2)}}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  size='small'
                  className={classes.input}
                  label="ShEx shape"
                  placeholder="ShEx shape"
                />
              )}
            />
          </div>
          }
        </Box>
      })}
      <Button onClick={addStatement}
        variant="contained" 
        className={classes.saveButton} 
        startIcon={<AddIcon />}
        style={{textTransform: 'none', marginTop: theme.spacing(1)}}
        color="info" >
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
              onClick={shexValidation}
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<ShexIcon />}
              style={{marginRight: theme.spacing(2)}}
              color="warning" >
                Validate with ShEx
            </Button>
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
              color="error" >
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

      { user.id &&
        <Card className={classes.paperPadding} style={{textAlign: 'center'}}>
          {/* { !user.id &&
            <Typography>
              🔒️ You need to login with ORCID to publish Nanopublications
            </Typography>
          } */}
          { user.id && user.keyfiles_loaded && 
            <Typography>
              ✅ Your authentication keys are successfully loaded, you can start publishing Nanopublications
            </Typography>
          }

          { user.id && !user.keyfiles_loaded && 
            <>
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
            </>
          }
        </Card>
      }

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
