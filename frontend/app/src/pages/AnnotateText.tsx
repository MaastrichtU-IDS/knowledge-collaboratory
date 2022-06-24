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
// @ts-ignore
import Taggy from 'react-taggy'

import { settings, context, samples, propertiesList, predicatesList, sentenceToAnnotate, biolinkShex, ents, genericContext } from '../settings';
import { rdfToRdf } from '../utils';
import UserContext from '../UserContext'
import AutocompleteEntity from '../components/AutocompleteEntity';

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../components/highlightjs-turtle';
// import { gridColumnsSelector } from '@mui/x-data-grid';
hljs.registerLanguage("turtle", hljsDefineTurtle)

// Define namespaces for building RDF URIs
const BIOLINK = 'https://w3id.org/biolink/vocab/'
const IDO = 'https://identifiers.org/'
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#'


const curieToUri = (curie: string) => {
  const namespace = curie.substring(0, curie.indexOf(":"))
  if (context[namespace]) {
    return context[namespace] + curie.substring(curie.indexOf(":") + 1)
  }
  return IDO + curie
}


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
    paperPadding: {
      padding: theme.spacing(2, 2),
      margin: theme.spacing(2, 2),
    },
  }))
  const classes = useStyles();

  // useLocation hook to get URL params
  let location = useLocation();
  const tagSelected: any = null
  const [state, setState] = React.useState({
    // inputText: 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.',
    inputText: '',
    inputSource: '',
    editInputText: '',
    templateSelected: 'RDF reified statements',
    extractClicked: false,
    entitiesList: [],
    relationsList: [],
    tagSelected: tagSelected,
    statements: [{'s': '', 'p': '', 'o': '', 'props': [], shex: ''}],
    predicatesList: predicatesList,
    propertiesList: propertiesList,
    loading: false,
    // loadingEntity: false,
    open: false,
    nanopubGenerated: false,
    nanopubPublished: false,
    dialogOpen: false,
    // np_jsonld: samples['Drug indication with the BioLink model'],
    // sample_selected: 'Drug indication with the BioLink model',
    published_nanopub: '',
    errorMessage: '',
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

  }, [])


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
      })
      .catch(error => {
        updateState({
          open: false,
          errorMessage: 'Error while uploading keys, please retry. And feel free to create an issue on our GitHub repository if the issue persists.'
        })
        console.log('Error while uploading keys', error)
      })
      .finally(() => {
        window.location.reload();
      })
  }


  const handleExtract  = (event: React.FormEvent) => {
    event.preventDefault();
    updateState({
      loading: true, 
      errorMessage: '',
      inputText: state.editInputText,
      entitiesList: [],
      statements: [],
      nanopubGenerated: false,
      nanopubPublished: false,
    })
    let extract_relations = true
    const maxLengthRelExtract = 1000
    if (state.editInputText.length > maxLengthRelExtract) {
      // We don't extract relations if text too long
      console.log(`⚠️ Text is more than ${maxLengthRelExtract} characters, we will not extract relations (too long)`)
      extract_relations = false
      // updateState({
      //   loading: false, 
      //   errorMessage: "Input text is too large for the machine learning model, try submitting less than 1000 characters"
      // })
    }
    axios.post(
        settings.apiUrl + '/get-entities-relations', 
        {'text': state.editInputText}, 
        {'params': {'extract_relations': extract_relations}}
      )
      .then(res => {
        updateState({
          loading: false,
          entitiesList: res.data.entities,
          extractClicked: true,
        })
        if (res.data.statements) {
          updateState({
            relationsList: res.data.relations,
            statements: res.data.statements
          })
        }
      })
      .catch(error => {
        updateState({
          loading: false,
          errorMessage: 'Error while extracting entities from the text, please retry. And feel free to create an issue on our GitHub repository if the issue persists.',
          extractClicked: true,
        })
        console.log('Error while extracting entities', error)
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
    if (prop['text']) {
      return prop.text
    }
    return prop
  }
  const checkIfUri = (text: string) => {
    return /^https?:\/\/[-_\/#:\?=\+%\.0-9a-zA-Z]+$/i.test(text)
  }

  const generateRDF  = () => {
    const stmtJsonld: any = []
    const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'

    if (state.templateSelected === 'RDF reified statements') {
      state.statements.map((stmt: any, index: number) => {
        console.log("Iterating state.statements for generateRDF", stmt)
        // Generate spo statement
        const reifiedStmt: any = {
          // '@id': 'https://w3id.org/collaboratory/association/' + index,
          [`@type`]: `${rdf}Statement`,
          [`${rdf}subject`]: {'@id': getPropValue(stmt.s)},
          [`${rdf}predicate`]: {'@id': getPropValue(stmt.p)},
          [`${rdf}object`]: {'@id': getPropValue(stmt.o)},
        }
        // Add props to the statement
        if (stmt.props) {
          stmt.props.map((prop: any, pindex: number) => {
            const addProp = getPropValue(prop.p)
            const addValue = getPropValue(prop.o)
            if (addProp && addValue) {
              if (!reifiedStmt[addProp]) {
                reifiedStmt[addProp] = []
              } 
              if (checkIfUri(addValue)) {
                reifiedStmt[addProp].push({'@id': addValue})
              } else {
                reifiedStmt[addProp].push(addValue)
              }
            }
          })
        }
        stmtJsonld.push(reifiedStmt)
      })

    } else {
      // If Plain RDF mode enabled (disabled atm)
      state.statements.map((stmt: any) => {
        stmtJsonld.push({
          '@id': getPropValue(stmt.s),
          [getPropValue(stmt.p)]: getPropValue(stmt.o)
        })
      })
    }

    // Generate triples for the entities
    state.entitiesList.map((entity: any) => {
      if (entity.id_uri && entity.type) {
        const entityJsonld = {
          '@id': entity.id_uri,
          '@type': BIOLINK + entity.type,
          [RDFS + 'label']: entity.id_label,
        }
        // Generate the props of the entity
        if (entity.props) {
          entity.props.map((prop: any, pindex: number) => {
            const addProp = getPropValue(prop.p)
            const addValue = getPropValue(prop.o)
            if (addProp && addValue) {
              if (!entityJsonld[addProp]) {
                entityJsonld[addProp] = []
              } 
              if (checkIfUri(addValue)) {
                // Quick check if URI
                entityJsonld[addProp].push({'@id': addValue})
              } else {
                entityJsonld[addProp].push(addValue)
              }
            }
          })
        }
        stmtJsonld.push(entityJsonld)
      }
    })
    return {
      '@graph': stmtJsonld,
      '@context': genericContext
    }
  }


  const handleDownloadRDF  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    // var element = document.createElement('a');
    const stmtJsonld: any = generateRDF()
    console.log(rdfToRdf(stmtJsonld))
    rdfToRdf(stmtJsonld)
      .then((formattedRdf) => {
        console.log(formattedRdf);
      })

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


  const generateNanopub  = (event: React.FormEvent, publish: boolean = false) => {
    event.preventDefault();
    const stmtJsonld: any = generateRDF()
    if (!user.error) {
      console.log('Publishing!', publish, stmtJsonld)
      const requestParams: any = {
        publish: publish
      }
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
            nanopubGenerated: true,
            nanopubPublished: false,
            published_nanopub: res.data
          })
        })
        .catch(error => {
          updateState({
            errorMessage: 'Error generating the Nanopublication.',
            nanopubGenerated: false,
            nanopubPublished: false,
          })
          console.log(error)
        })
        .finally(() => {
          hljs.highlightAll();
        })
    } else {
      console.log('You need to be logged in with ORCID to publish a Nanopublication')
    }
  }

  const publishSignedNanopub  = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user.error) {
      const access_token = user['access_token']
      axios.post(
          `${settings.apiUrl}/publish-last-signed`,
          null, 
          { 
            headers: { Authorization: `Bearer ${access_token}` },
            // params: requestParams
          } 
        )
        .then(res => {
          updateState({
            open: true,
            nanopubPublished: true,
            published_nanopub: res.data
          })
        })
        .catch(error => {
          updateState({
            nanopubPublished: true,
            errorMessage: 'Error publishing the Nanopublication.'
          })
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
    if (!stmts[stmtIndex]['props']) {
      stmts[stmtIndex]['props'] = []
    }
    stmts[stmtIndex]['props'].push({p: '', o: ''})
    updateState({statements: stmts})
  }

  // const triplesTemplates = ["RDF reified statements", "Plain RDF"]
  // const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   updateState({templateSelected: event.target.value})
  // }

  const handleRemoveStmt = (index: number) => {
    // TODO: entities that are not anymore relevant are removed when a statement is removed
    const stmts = state.statements
    stmts.splice(index, 1);
    updateState({statements: stmts})
  }

  const addEntityProperty = (event: React.FormEvent, editEnt: any)=> {
    // event.preventDefault();
    const entitiesList: any = state.entitiesList
    if (!editEnt['props']) {
      editEnt['props'] = []
    }
    editEnt['props'].push({p: '', o: ''})
    const entityIndex = entitiesList.findIndex((ent: any) => ent.index === editEnt.index)
    entitiesList[entityIndex] = editEnt
    updateState({entitiesList: entitiesList, tagSelected: editEnt})
  }
  const handleRemoveEntity = (index: any) => {
    const entitiesList = state.entitiesList
    // Delete the entity with the same index
    entitiesList.splice(entitiesList.findIndex((ent: any) => ent.index === index), 1);
    updateState({entitiesList: entitiesList, tagSelected: null})
    handleClickAway()
  }
  const handleRemoveProp = (stmtIndex: number, pindex: number) => {
    const stmts = state.statements
    stmts[stmtIndex].props.splice(pindex, 1);
    updateState({statements: stmts})
  }
  const handleRemoveEntityProp = (editEnt: any, pindex: number) => {
    const entitiesList: any = state.entitiesList
    editEnt.props.splice(pindex, 1);
    // editEnt.props.splice(entitiesList.findIndex((ent: any) => ent.index === editEnt.index), 1);
    const entityIndex = entitiesList.findIndex((ent: any) => ent.index === editEnt.index)
    entitiesList[entityIndex] = editEnt
    updateState({entitiesList: entitiesList, tagSelected: editEnt})
  }

  const clickTag = (event: any, tag: any, elemIndex: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((prev) => !prev);
    // tag['id'] = tag['type']
    console.log('clickTag', tag)
    updateState({tagSelected: tag})
  }

  const getEntityCuries = async (text: string) => {
    const data = await axios.post(
      'https://name-resolution-sri.renci.org/lookup', 
      {},
      {
        'params': {
          'string': text,
          'offset': 0,
          'limit': 30,
        }
      }
    )
    .then(res => {
      return res.data
    })
    .catch(error => {
      console.log(error)
      return null
    })
    return data
  }

  const highlightCallback = async (event: any, text: string, spanIndex: number, start: number, end: number) => {
    const entIndex = `${text}:${spanIndex}:${start}:${end}`
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((prev) => !prev);
    if (text.length > 1 && state.entitiesList.findIndex((ent: any) => ent.index === entIndex) === -1) {
      const curies: any = []
      const newEntity = {
        index: entIndex,
        text: text, 
        token: text, 
        type: "NamedEntity", 
        start: state.inputText.indexOf(text), 
        end: state.inputText.indexOf(text) + text.length,
        curies: curies, id_curie: "", id_label: "", id_uri: "",
        props: []
      }
      const entityCuries = await getEntityCuries(text)
      if (entityCuries && Object.keys(entityCuries).length > 0) {
        Object.keys(entityCuries).map((curie: any) => {
          const addEnt: any = {
            'curie': curie, 
            'label': entityCuries[curie][0], 
            'altLabel': entityCuries[curie][1],
          }
          newEntity['curies'].push(addEnt)
        })
        newEntity['id_curie'] = Object.keys(entityCuries)[0]
        newEntity['id_label'] = entityCuries[newEntity['id_curie']][0]
        newEntity['id_uri'] = curieToUri(newEntity['id_curie'])
      }
      if (state.entitiesList.findIndex((ent: any) => ent.index === entIndex) == -1) {
        const entitiesList: any = state.entitiesList
        entitiesList.push(newEntity)
        updateState({tagSelected: newEntity, entitiesList: entitiesList})
      }
    }
  }

  const addToStatements = (property: string, newInputValue: any, index: any, pindex: any = null) => {
    const stmts: any = state.statements
    console.log('newInputValue', newInputValue)
    if (newInputValue) {
      if (pindex == null) {
        if (typeof newInputValue === 'object' || checkIfUri(newInputValue)) {
          stmts[index][property] = newInputValue as string
        }
      } else {
        if (typeof newInputValue === 'object' || checkIfUri(newInputValue)) {
          stmts[index]['props'][pindex][property] = newInputValue as string
        }
      }
    }
    console.log(stmts)
    updateState({statements: stmts})
  }

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        🏷️ Annotate biomedical text
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        This service helps you annotate biomedical text using the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a>, and
        standard identifiers resolved using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator SRI Name Resolution API</a>, such as MONDO and PubChem. 
        The annotations are represented using the <a href='https://www.w3.org/RDF' target="_blank" rel="noopener noreferrer">RDF</a> standard. They can be downloaded in the JSON-LD format, or published as Nanopublications.
        {/* A machine learning model automatically extracts biomedical entities from the given text, classify them in different types from the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a> (chemical, disease, etc), and retrieve potential standard identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator Name Resolution API</a>. */}
      </Typography>
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 A machine learning model automatically extracts biomedical entities and relations from the given text, classify them in different types from the BioLink model (chemical, disease, etc), 
        and retrieve potential identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator SRI Name Resolution API</a>.
      </Typography> */}
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 You can then compose the statements representing the different assertions present in the text using standard identifiers and properties from the BioLink model.
      </Typography> */}
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🗜️ In the last step you will define the model used to generate the statements, reified associations enable you to attach additional properties to each statement.
      </Typography> */}
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        📥️ Finally you can either download the statements as RDF, or directly publish them in a Nanopublication. 
      </Typography> */}

      <Typography variant='body1' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(2)}}>
        1. Provide a short text/claim to annotate (e.g. a drug indication):
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
      { state.errorMessage &&
        <Paper elevation={4} 
          style={{backgroundColor: "#e57373", padding: theme.spacing(2), marginBottom:theme.spacing(3)}}
          // @ts-ignore
          sx={{ display: state.errorMessage.length > 0 }}
        >
          ⚠️&nbsp;&nbsp;{state.errorMessage}
        </Paper>
      }

      <Popper open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={4} style={{minWidth: theme.spacing(100), padding: theme.spacing(2, 2), textAlign: 'left'}}>
            { state.tagSelected && 
              <>
                <Typography variant='h5' style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
                  {state.tagSelected.token}
                  <Tooltip title={<Typography style={{textAlign: 'center'}}>Delete the entity</Typography>}>
                    <IconButton onClick={() => handleRemoveEntity(state.tagSelected.index)} 
                      style={{marginLeft: theme.spacing(1), alignContent: 'right'}} color="default">
                        <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <AutocompleteEntity
                  label="Entity type"
                  id="tag:type"
                  value={state.tagSelected.type}
                  options={ents}
                  onChange={(event: any, newInputValue: any) => {
                    const tagSelected: any = state.tagSelected
                    if (newInputValue && newInputValue != tagSelected.type) {
                      const entitiesList: any = state.entitiesList
                      const entityIndex = entitiesList.findIndex((ent: any) => ent.index === tagSelected.index)
                      entitiesList[entityIndex].type = newInputValue.type
                      tagSelected.type = newInputValue.type
                      updateState({tagSelected: tagSelected, entitiesList: entitiesList})
                    }
                  }}
                  groupBy={(option: any) => (option.category ? option.category : null)}
                  style={{marginBottom: theme.spacing(2)}}
                />
                <AutocompleteEntity
                  label="Entity ID"
                  id="tag:id"
                  value={state.tagSelected}
                  options={state.tagSelected.curies}
                  // getOptionLabel={(option: any) => `${option.label}${option.altLabel ? `, ${option.altLabel}` : ''} (${option.curie})`}
                  onChange={(event: any, newInputValue: any) => {
                    const entitiesList: any = state.entitiesList
                    const tagSelected = state.tagSelected
                    const entityIndex = entitiesList.findIndex((ent: any) => ent.index === tagSelected.index)
                    if (newInputValue && (typeof newInputValue === 'object' || checkIfUri(newInputValue))) {
                      if (newInputValue.curie) {
                        entitiesList[entityIndex].id_curie = newInputValue.curie
                        entitiesList[entityIndex].id_label = newInputValue.label
                        entitiesList[entityIndex].id_uri = curieToUri(newInputValue.curie)
                        tagSelected.id_curie = newInputValue.curie
                        tagSelected.id_label = newInputValue.label
                        tagSelected.id_uri = curieToUri(newInputValue.curie)
                      } else {
                        delete entitiesList[entityIndex].id_curie
                        delete entitiesList[entityIndex].id_label
                        entitiesList[entityIndex].id_uri = newInputValue
                        delete tagSelected.id_curie
                        delete tagSelected.id_label
                        tagSelected.id_uri = newInputValue
                      }
                      updateState({tagSelected: tagSelected, entitiesList: entitiesList})
                    }
                  }}
                  style={{marginBottom: theme.spacing(2)}}
                />
                { state.templateSelected !== 'Plain RDF' && state.tagSelected.props &&
                  state.tagSelected.props.map((prop: any, pindex: number) => { 
                    return <Grid container spacing={2} key={'prop:' + prop + pindex} style={{marginLeft: theme.spacing(5), marginBottom: theme.spacing(1)}}>
                    <Grid item xs={5}>
                      <AutocompleteEntity
                        label="Property"
                        id={'tag:prop:p:'+pindex}
                        value={state.tagSelected.props[pindex].p}
                        options={state.propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                        onChange={(event: any, newInputValue: any) => {
                          // if (newInputValue && newInputValue != tagSelected.type) {
                          if (typeof newInputValue === 'object' || checkIfUri(newInputValue)) {
                            const entitiesList: any = state.entitiesList
                            const tagSelected = state.tagSelected
                            tagSelected.props[pindex]['p'] = newInputValue
                            const entityIndex = entitiesList.findIndex((ent: any) => ent.index === pindex)
                            entitiesList[entityIndex] = tagSelected
                            updateState({entitiesList: entitiesList, tagSelected: tagSelected})
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={5}>
                      <AutocompleteEntity
                        label="Value"
                        id={'tag:prop:o:'+pindex}
                        value={state.tagSelected.props[pindex].o}
                        options={state.entitiesList}
                        onChange={(event: any, newInputValue: any) => {
                          if (typeof newInputValue === 'object' || checkIfUri(newInputValue)) {
                            const entitiesList: any = state.entitiesList
                            const tagSelected = state.tagSelected
                            tagSelected.props[pindex]['o'] = newInputValue
                            const entityIndex = entitiesList.findIndex((ent: any) => ent.index === pindex)
                            entitiesList[entityIndex] = tagSelected
                            updateState({entitiesList: entitiesList, tagSelected: tagSelected})
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={<Typography style={{textAlign: 'center'}}>Delete the statement</Typography>}>
                        <IconButton onClick={() => handleRemoveEntityProp(state.tagSelected, pindex)} color="default">
                            <RemoveIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  })
                }

                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                  <Button 
                    onClick={(event: any) => addEntityProperty(event, state.tagSelected)}
                    id={"addProp:"}
                    variant="contained" 
                    className={classes.saveButton} 
                    startIcon={<AddIcon />}
                    style={{marginLeft: theme.spacing(5), marginRight: theme.spacing(4), textTransform: 'none'}}
                    color="inherit" >
                      Add a property to this entity
                  </Button>
                </div>
              </>
            }
          </Paper>
        </ClickAwayListener>
      </Popper>

      { state.extractClicked &&
      // { state.entitiesList.length > 0 &&
        <> 
          <Typography variant='body1' style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
            💡 You can edit entities by clicking on their tag, or add new entities by highlighting the text corresponding to the entity. Potential identifiers are automatically retrieved for the highlighted text.
          </Typography>
          <Card className={classes.paperPadding} >
            <Taggy text={state.inputText} spans={state.entitiesList} 
              ents={ents} onClick={clickTag} onHighlight={highlightCallback}  />
          </Card>
        </>
      }

      { state.entitiesList.length > 0 &&
      <>
        <Typography variant='body1' style={{marginBottom: theme.spacing(2), marginTop: theme.spacing(6)}}>
          2. Define the statements that represent the assertions made in the text, you can add properties to provide more context:
        </Typography>

        { state.statements.map((stmtRow: any, index: number) => { 
          return <Box key={'stmt:' + index}>
            <Grid container spacing={2} key={index} style={{marginBottom: theme.spacing(1), marginTop: theme.spacing(1)}}>
              <Grid item xs={4}>
                <AutocompleteEntity
                  label="Subject"
                  id={'s:'+index}
                  value={state.statements[index].s}
                  options={state.entitiesList}
                  onChange={(event: any, newInputValue: any) => {
                    addToStatements('s', newInputValue, index)
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <AutocompleteEntity
                  label="Predicate"
                  id={'p:'+index}
                  value={state.statements[index].p}
                  options={state.predicatesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                  onChange={(event: any, newInputValue: any) => {
                    addToStatements('p', newInputValue, index)
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteEntity
                  label="Object"
                  id={'o:'+index}
                  value={state.statements[index].o}
                  options={state.entitiesList}
                  onChange={(event: any, newInputValue: any) => {
                    addToStatements('o', newInputValue, index)
                  }}
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
              state.statements[index].props.map((prop: any, pindex: number): any => { 
                return <Grid container spacing={2} key={'prop' + index + prop + pindex} style={{marginLeft: theme.spacing(5), marginBottom: theme.spacing(1)}}>
                <Grid item xs={4}>
                  <AutocompleteEntity
                    label="Property"
                    id={'prop:' + index + ':p:'+pindex}
                    // @ts-ignore
                    value={state.statements[index].props[pindex].p}
                    options={state.propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                    onChange={(event: any, newInputValue: any) => {
                      addToStatements('p', newInputValue, index, pindex)
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <AutocompleteEntity
                    label="Value"
                    id={'prop:' + index + ':o:'+pindex}
                    // @ts-ignore
                    value={state.statements[index].props[pindex].o}
                    options={state.entitiesList}
                    onChange={(event: any, newInputValue: any) => {
                      addToStatements('o', newInputValue, index, pindex)
                    }}
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
              <AutocompleteEntity
                label="ShEx shape"
                id={'shex:' + index}
                value={state.statements[index].shex}
                freesolo={undefined}
                options={biolinkShex.shapes}
                getOptionLabel={(option: any) => `${option.label} (${option.id})`}
                onChange={(event: any, newInputValue: any) => {
                  const stmts: any = state.statements
                  if (newInputValue) {
                    if (newInputValue.id) {
                      stmts[index]['shex'] = newInputValue.id as string
                    } else {
                      stmts[index]['shex'] = newInputValue as string
                    }
                    updateState({statements: stmts})
                  }
                }}
                style={{width: '400px', marginLeft: theme.spacing(2)}}
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
      </>}

      {/* <Typography variant='body1' style={{marginTop: theme.spacing(3), marginBottom: theme.spacing(2)}}>
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
      </TextField> */}

      { state.extractClicked &&
        <form>
          <FormControl className={classes.settingsForm}>
            {/* Button to download the JSON-LD */}
            <div style={{width: '100%', textAlign: 'center'}}>
              <Button 
                onClick={shexValidation}
                variant="contained" 
                className={classes.saveButton} 
                startIcon={<ShexIcon />}
                style={{marginRight: theme.spacing(2)}}
                disabled={state.entitiesList.length < 1}
                color="warning" >
                  Validate with ShEx
              </Button>
              <Button 
                onClick={handleDownloadRDF}
                variant="contained" 
                className={classes.saveButton} 
                startIcon={<DownloadIcon />}
                style={{marginRight: theme.spacing(2)}}
                disabled={state.entitiesList.length < 1}
                color="secondary" >
                  Download RDF
              </Button>
              <Button
                onClick={(event) => generateNanopub(event, false)}
                variant="contained" 
                className={classes.saveButton} 
                startIcon={<GenerateIcon />}
                disabled={!user.id}
                style={{marginRight: theme.spacing(2)}}
                color="info" >
                  Generate Nanopublication
              </Button>
              { state.nanopubGenerated &&
                <Button
                  onClick={publishSignedNanopub}
                  variant="contained" 
                  className={classes.saveButton} 
                  startIcon={<PublishIcon />}
                  disabled={!state.nanopubGenerated}
                  color="error" >
                    Publish Nanopublication
                </Button>
              }
              { !user.id &&
                <Typography style={{marginTop: theme.spacing(2)}}>
                  🔒️ You need to login with your ORCID to generate Nanopublications
                </Typography>
              }
            </div>
          </FormControl>
        </form>
      }

      { state.nanopubPublished &&
        <Paper elevation={4} style={{backgroundColor: '#81c784', padding: theme.spacing(2), marginBottom:theme.spacing(3), marginTop:theme.spacing(3)}}>
          ✅&nbsp;&nbsp;Nanopublication successfully published
        </Paper>
      }

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
                🔑 You need to upload the authentication keys linked to your ORCID to publish Nanopublications (public and private encryption keys). 
                If you have not yet created your authentication keys, or linked them to your ORCID, then follow the instructions to complete your profile with the <a href='https://github.com/peta-pico/nanobench/blob/master/INSTALL.md' target="_blank" rel="noopener noreferrer">Nanobench tool</a>.
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
