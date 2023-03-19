"use client";

import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Popper, ClickAwayListener, Paper, Container, Box, CircularProgress, Tooltip, IconButton, Button, Card, FormControl, TextField, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Delete';
import axios from 'axios';

import { settings, genericContext } from '../utils/settings';
import { context, propertiesList, predicatesList, sentenceToAnnotate, ents } from '../utils/biolinkModel';
import UserContext from '../utils/UserContext'
import PublishNanopubButtons from '../components/PublishNanopubButtons';
import { FormSettings } from '../components/StyledComponents';
import AutocompleteEntity from '../components/AutocompleteEntity';
import DropdownButton from '../components/DropdownButton';
import Taggy from '../components/ReactTaggy';
import PubAnnotationProjects from '../components/PubAnnotationProjects';

// Define namespaces for building RDF URIs
const BIOLINK = 'https://w3id.org/biolink/vocab/'
const IDO = 'https://identifiers.org/'

const curieToUri = (curie: string) => {
  const namespace = curie.substring(0, curie.indexOf(":"))
  if (context[namespace]) {
    return context[namespace] + curie.substring(curie.indexOf(":") + 1)
  }
  return IDO + curie
}

const defaultPrompt = `From the text below, extract the entities, classify them and extract associations between those entities
Entities to extract should be of one of those types: "Chemical Entity", "Disease", "Gene", "Gene Product", "Organism Taxon"

Return the results as a YAML object with the following fields:
- entities: <the list of entities in the text, each entity is an object with the fields: label, type>
- associations: <the list of associations between entities in the text, each association is an object with the fields: "subject" for the subject entity, "predicate" for the relation (treats, affects, interacts with, causes, caused by, has evidence), "object" for the object entity>`

export default function AnnotateText() {
  const theme = useTheme();
  const { user }: any = useContext(UserContext)

  // useLocation hook to get URL params
  // let location = useLocation();
  const tagSelected: any = null
  const [state, setState] = React.useState({
    pubAnnotationProjects: [],
    // inputText: 'Amantadine hydrochloride capsules are indicated in the treatment of idiopathic Parkinson’s disease (Paralysis Agitans), postencephalitic parkinsonism and symptomatic parkinsonism which may follow injury to the nervous system by carbon monoxide intoxication.',
    inputText: '',
    inputSource: '',
    inputDocument: '',
    inputProject: '',
    editInputText: '',
    editPrompt: defaultPrompt,
    extractionModel: 'litcoin', // LitCoin 1, OpenAI 0
    templateSelected: 'RDF reified statements',
    extractClicked: false,
    entitiesList: [],
    // externalEntities: [],
    tagSelected: tagSelected,
    statements: [{'s': '', 'p': '', 'o': '', 'props': []}],
    loading: false,
    nanopubGenerated: false,
    nanopubPublished: false,
    errorMessage: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
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

    // Get projects: http://pubannotation.org/projects.json
    // Check a doc to annotate: http://pubannotation.org/projects/CyanoBase/docs/sourcedb/PubMed/sourceid/10903511
    // All docs for a sourcedb: http://pubannotation.org/projects/CyanoBase/docs/sourcedb/PubMed.json?page=2
    // All docs for a project: https://pubannotation.org/projects/CyanoBase/docs.json
    // Need to be paginated
    // In our annotations we want to record:
    // - source pubmed URL
    // - pubannotation URL (tao:part_of?)
    // - maybe the project in which this annotation is done?
    // The user can select one of the proposed PubAnnotation projects
    // We query the SPARQL endpoint to get the list of annotations done for this project
    // Count the number of annotations already published, divide this number by 10 (per page),
    // go to the right page and take the next annotation

    // Later: the user can see the completion of the different projects (call /projects.json)
    // Questions:
    // Is it possible to increase the amount of rows per page? From the default 10
    // Is it possible to easily get the total count of documents in a project?

  })

  // Order is important, litcoin needs to be last for the dropdown
  const extractionOptions = [
    "Extract entities with the OpenAI GPT-3.5 turbo model",
    "Extract entities with the OpenAI GPT-3 text-davinci-003 model",
    "Extract entities with the OpenAI GPT-3 code-davinci-002 code model",
    "Extract entities with the LitCoin model",
  ]
  const extractionIds = [
    "gpt-3.5-turbo",
    "text-davinci-003",
    "code-davinci-002",
    "litcoin",
  ]
  // "drug.DrugMechanism": "OntoGPT drug.DrugMechanism",
  // "ctd.ChemicalToDiseaseDocument": "OntoGPT ctd.ChemicalToDiseaseDocument",
  // "drug.DrugMechanism": "OntoGPT drug.DrugMechanism",
  // "biological_process.BiologicalProcess": "OntoGPT biological_process.BiologicalProcess",
  // "gocam.GoCamAnnotations": "OntoGPT gocam.GoCamAnnotations",
  // "treatment.DiseaseTreatmentSummary": "OntoGPT treatment.DiseaseTreatmentSummary",
  // "reaction.ReactionDocument": "OntoGPT reaction.ReactionDocument",

  const extractOpenAI = () => {
    fetch(`${settings.apiUrl}/openai-extract?prompt=${encodeURIComponent(state.editPrompt)}&model=${encodeURIComponent(state.extractionModel)}`, {
      // mode: "no-cors",
      method: "POST",
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
        // Authorization: `Bearer ${user['access_token']}`
      },
      body: JSON.stringify({
        text: state.editInputText,
        // prompt: state.editPrompt,
        // engine: state.extractionModel,
      })
    })
      .then(response => response.json())
      .then(async data => {

        console.log("Object extracted by OpenAI", data)
        const entities: any = []
        const statements: any = []
        // Prepare entities extracted, and retrieve their potential CURIEs with the SRI NameResolution API
        await Promise.all(
          data["entities"].map(async (extractedEntity: any, index: number) => {
            const label = extractedEntity["label"]
            const type = extractedEntity["type"].split(" ").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
            const start = state.editInputText.toLowerCase().indexOf(label.toLowerCase())
            const end = start + label.length
            const ent: any = {
              index: `${entities.length}:${start}:${end}:${label}`,
              text: label,
              token: label,
              type: type,
              start: start,
              end: end,
            }
            const entityCuries: any = await getEntityCuries(label)
            ent['curies'] = []
            if (entityCuries && Object.keys(entityCuries).length > 0) {
              Object.keys(entityCuries).map((curie: any) => {
                const addEnt: any = {
                  'curie': curie,
                  'label': entityCuries[curie][0],
                  'altLabel': entityCuries[curie][1],
                }
                ent['curies'].push(addEnt)
              })
              ent['id_curie'] = ent['curies'][0]["curie"]
              ent['id_label'] = ent['curies'][0]["label"]
              ent['id_uri'] = curieToUri(ent['id_curie'])
            }
            entities.push(ent)
          })
        )

        try {
          // Prepare statements extracted
          // o: { index: "chorea:1:57:63", text: "chorea", type: "DiseaseOrPhenotypicFeature", … }
          // p: { id: "https://w3id.org/biolink/vocab/treats", curie: "biolink:treats", label: "treats" }
          // s: { index: "Tetrabenazine:0:0:13", text: "Tetrabenazine", type: "ChemicalEntity", … }
          data["associations"].map((asso: any, index: number) => {
            const pred = asso["predicate"].replaceAll(" ", "_")
            const stmt: any = {
              p: {
                id: BIOLINK + pred, curie: "biolink:" + pred, label: pred
              }
            }
            entities.map( (ent: any, index:number) => {
              if (asso["subject"] == ent["text"]) {
                stmt["s"] = ent
              }
              if (asso["object"] == ent["text"]) {
                stmt["o"] = ent
              }
            })
            statements.push(stmt)
          })
        } catch (err) {
          console.log(`Error extracting statements: ${err}`)
        }
        updateState({
          loading: false,
          entitiesList: entities,
          statements: statements,
          extractClicked: true,
        })

      })
      .catch(error => {
        console.log('Error while extracting entities', error)
        let errMsg = `Error while extracting entities from the text.\nPlease retry later, and feel free to create an issue on our GitHub repository if the issue persists.`
        if (error.response) {
          errMsg = `Error while extracting entities from the text because ${error.response.data.detail}.\nPlease retry later, and feel free to create an issue on our GitHub repository if the issue persists.`
        }
        updateState({
          loading: false,
          errorMessage: errMsg,
          extractClicked: true,
        })
      })

  }

  const handleExtract  = (event: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
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
      console.log(`⚠️ Text is more than ${maxLengthRelExtract} characters, we will not extract relations with the LitCoin model (too long)`)
      extract_relations = false
    }
    if (state.extractionModel !== 'litcoin') {
      extractOpenAI()
    } else {
      // Extract with Litcoin model
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
              statements: res.data.statements
            })
          }
          // console.log("LITCOIN model returns", res.data)
        })
        .catch(error => {
          updateState({
            loading: false,
            errorMessage: `Error while extracting entities from the text because ${error.response.data.detail}.\nPlease retry later, and feel free to create an issue on our GitHub repository if the issue persists.`,
            extractClicked: true,
          })
        })
    }
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
  // const getUri  = (prop: any) => {
  //   if (prop['id_uri']) return prop.id_uri
  //   if (prop['id']) return prop.id
  //   return prop
  // }

  // Main function to generate JSON-LD RDF from the statements and entities provided through the tool
  const generateRDF  = () => {
    const stmtJsonld: any = []
    const taoAnnotations: any = []

    if (state.templateSelected === 'RDF reified statements') {
      stmtJsonld.push({
        '@id': 'https://w3id.org/biolink/infores/knowledge-collaboratory',
        '@type': 'biolink:InformationResource',
        'biolink:category': 'biolink:InformationResource',
        'biolink:id': 'infores:knowledge-collaboratory',
      })
      state.statements.map((stmt: any, index: number) => {
        // console.log("Iterating state.statements for generateRDF", stmt)
        // Generate spo statement
        const reifiedStmt: any = {
          [`@type`]: "biolink:Association",
          'biolink:category': "biolink:Association",
          "rdf:subject": {'@id': getPropValue(stmt.s)},
          "rdf:predicate": {'@id': getPropValue(stmt.p)},
          "rdf:object": {'@id': getPropValue(stmt.o)},
          // "rdf:subject": {'@id': stmt.s.id_curie},
          // "rdf:predicate": {'@id': stmt.p.curie},
          // "rdf:object": {'@id': stmt.o.id_curie},
          "biolink:id": `collaboratory:${stmt.s.id_curie}-${stmt.p.curie}-${stmt.o.id_curie}`,
          "biolink:aggregator_knowledge_source": {'@id': 'infores:knowledge-collaboratory'},
        }
        if (state.inputSource) {
          reifiedStmt[BIOLINK +'publications'] = {'@id': state.inputSource}
          stmtJsonld.push({
            '@id': state.inputSource,
            '@type': 'biolink:Publication',
            'biolink:category': 'biolink:Publication',
            'biolink:id': state.inputSource,
          })
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

    const docUri = (state.inputDocument) ? state.inputDocument : "http://purl.org/nanopub/temp/np#document"
    const taoDoc: any = {
      "@id": docUri,
      "@type": "tao:document_text",
      "tao:has_value": state.inputText,
    }
    if (state.inputSource) {
      taoDoc["rdfs:seeAlso"] = {"@id": state.inputSource}
    }
    if (state.inputProject) {
      taoDoc["tao:part_of"] = {"@id": state.inputProject}
    }
    taoAnnotations.push(taoDoc)

    // Generate triples for the entities
    state.entitiesList.map((entity: any) => {
      if (entity.id_uri && entity.type) {
        const entityJsonld: any = {
          '@id': entity.id_uri,
          '@type': `biolink:${entity.type}`,
          'biolink:id': entity.id_curie,
          'biolink:category': `biolink:${entity.type}`,
          'rdfs:label': entity.text,
        }
        taoAnnotations.push({
          "@type": "tao:text_span",
          "tao:begins_at": entity.start,
          "tao:ends_at": entity.end,
          "tao:has_value": entity.text,
          "tao:denotes": {"@id": entity.id_uri},
          "tao:part_of": {"@id": docUri},
        })
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
      '@context': genericContext,
      '@graph': stmtJsonld,
      '@annotations': {
        '@context': {
          "tao": "http://pubannotation.org/ontology/tao.owl#",
          "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        },
        '@graph': taoAnnotations,
      }
    }
  }


  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ [event.target.id]: event.target.value})
  }

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
    if (!stmts[stmtIndex]['props']) {
      stmts[stmtIndex]['props'] = []
    }
    stmts[stmtIndex]['props'].push({p: '', o: ''})
    updateState({statements: stmts})
  }

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
        start: start, end: end,
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
    updateState({statements: stmts})
  }

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        🏷️ Annotate biomedical text
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        This service uses extraction models to help you annotate biomedical text using the <a href='https://biolink.github.io/biolink-model/docs/' target="_blank" rel="noopener noreferrer">BioLink model</a>, and
        standard identifiers resolved using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator SRI Name Resolution API</a>, such as MONDO and PubChem.
        The annotations are represented with the <a href='https://www.w3.org/RDF' target="_blank" rel="noopener noreferrer">RDF</a> standard, using the <a href='https://vemonet.github.io/tao' target="_blank" rel="noopener noreferrer">TAO ontology</a>,
        also used by the <a href='http://pubannotation.org/' target="_blank" rel="noopener noreferrer">PubAnnotation</a> service.
        Generated annotations can be downloaded in the <a href='https://json-ld.org' target="_blank" rel="noopener noreferrer">JSON-LD</a> format, or published as <a href='https://nanopub.net' target="_blank" rel="noopener noreferrer">Nanopublications</a> after login with your ORCID.
      </Typography>
      {/* <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(1, 0)}}>
        🪄 A machine learning model automatically extracts biomedical entities and relations from the given text, classify them in different types from the BioLink model (chemical, disease, etc),
        and retrieve potential identifiers for those entities using the <a href='https://name-resolution-sri.renci.org/docs' target="_blank" rel="noopener noreferrer">NIH NCATS Translator SRI Name Resolution API</a>.
      </Typography> */}

      <PubAnnotationProjects
        onClick={ (document: any) => {
          updateState({
            inputText: document.text,
            editInputText: document.text,
            inputSource: document.source_url,
            inputDocument: document.target,
            inputProject: document.project,
          })
        }}
      />

      {/* <Typography variant='body1' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(2)}}>
        1. Provide a short text/claim to annotate (e.g. a drug indication):
      </Typography> */}

      <form onSubmit={handleExtract}>
        <FormSettings>
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
            InputProps={{ className: "input" }}
            InputLabelProps={{ required: false }}
          />

          <Box sx={{ display: 'flex', justifyContent: "center", width: '100%' }}>
            <TextField
              id='inputSource'
              label='Source URL (optional)'
              placeholder='Source URL (optional)'
              value={state.inputSource}
              variant="outlined"
              onChange={handleTextChange}
              size='small'
              style={{width: '100%', marginRight: theme.spacing(2)}}
              InputProps={{ className: "input" }}
              InputLabelProps={{ required: false }}
            />
            <TextField
              id='inputDocument'
              label='Annotation document URL (optional)'
              placeholder='Annotation document URL (optional)'
              value={state.inputDocument}
              variant="outlined"
              onChange={handleTextChange}
              size='small'
              style={{width: '100%'}}
              InputProps={{ className: "input" }}
              InputLabelProps={{ required: false }}
            />
          </Box>


          <div style={{width: '100%', textAlign: 'center', marginBottom: theme.spacing(2)}}>
            <DropdownButton
              options={extractionOptions}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, index: number) => {
                updateState({extractionModel: extractionIds[index]})
              }}
              // onClick={(event: any) => {
              //   handleExtract(event)
              // }}
              loggedIn={user.id}
            />
          </div>

          {/* { !user.id &&
            <Typography style={{marginBottom: theme.spacing(1), textAlign: "center"}}>
              🔒️ You need to login with your ORCID to use OpenAI models
            </Typography>
          } */}
          { state.extractionModel != 'litcoin' &&
            <TextField
              id='editPrompt'
              label='Prompt to use'
              placeholder='Prompt to use'
              value={state.editPrompt}
              required
              multiline
              variant="outlined"
              onChange={handleTextChange}
              size='small'
              InputProps={{ className: "input" }}
              InputLabelProps={{ required: false }}
            />
          }

        </FormSettings>
      </form>

      { state.loading &&
        <Box sx={{textAlign: 'center', margin: theme.spacing(10, 0)}} >
          <CircularProgress style={{textAlign: 'center'}} />
        </Box>
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
                  groupBy={(option: any) => (option.category ? option.category : null)}
                  style={{marginBottom: theme.spacing(2)}}
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
                />
                <AutocompleteEntity
                  label="Entity ID"
                  id="tag:id"
                  value={state.tagSelected}
                  options={state.tagSelected.curies}
                  // getOptionLabel={(option: any) => `${option.label}${option.altLabel ? `, ${option.altLabel}` : ''} (${option.curie})`}
                  style={{ marginBottom: theme.spacing(2) }}
                  onChange={async (event: any, newInputValue: any) => {
                    // console.log('autocomplete entity newInputValue', newInputValue);
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

                    // If newInputValue is str len() > 2: we search in SRI API
                    // and update the "curies" options from the result for the autocomplete
                    if (newInputValue && typeof newInputValue === 'string' && newInputValue.length > 2) {
                      const entityCuries = await getEntityCuries(newInputValue)
                      if (entityCuries && Object.keys(entityCuries).length > 0) {
                        tagSelected.curies = []
                        Object.keys(entityCuries).map((curie: any) => {
                          const addEnt: any = {
                            'curie': curie,
                            'label': entityCuries[curie][0],
                            'altLabel': entityCuries[curie][1],
                          }
                          tagSelected.curies.push(addEnt)
                        })
                        updateState({tagSelected: tagSelected})
                      }
                    }
                  }}
                />
                { state.templateSelected !== 'Plain RDF' && state.tagSelected.props &&
                  state.tagSelected.props.map((prop: any, pindex: number) => {
                    return <Grid container spacing={2} key={'prop:' + prop + pindex} style={{marginLeft: theme.spacing(5), marginBottom: theme.spacing(1)}}>
                    <Grid item xs={5}>
                      <AutocompleteEntity
                        label="Property"
                        id={'tag:prop:p:'+pindex}
                        validate="entity"
                        value={state.tagSelected.props[pindex].p}
                        options={propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
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
                        validate="entity"
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
                    className="button"
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
        <>
          <Typography variant='body1' style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
            💡 You can edit entities by clicking on their tag, or add new entities by highlighting the text corresponding to the entity. Potential identifiers are automatically retrieved for the highlighted text.
          </Typography>
          <Card className="paperPadding" >
            <Taggy text={state.inputText} spans={state.entitiesList}
              ents={ents} onClick={clickTag} onMouseOver={clickTag} onHighlight={highlightCallback} />
          </Card>

          {/* TODO: add button to add external entities not in the text? */}
          {/* <Button
            onClick={() => {
              const externalEntities: any = state.externalEntities;
              externalEntities.push({
                index: state.externalEntities.length,
                text: 'New entity ' + state.externalEntities.length,
                token: 'New entity ' + state.externalEntities.length,
                type: "NamedEntity",
                start: 0,
                end: `New entity ${state.externalEntities.length.toString()}`.length,
                curies: [], id_curie: "", id_label: "", id_uri: "",
                props: []
              });
              updateState({externalEntities: externalEntities})
            }}
            variant="contained"
            className="button"
            startIcon={<AddIcon />}
            style={{textTransform: 'none', marginTop: theme.spacing(1)}}
            color="inherit" >
              Add an external entity
          </Button>
          { state.externalEntities.map((ent: any, index: number) => {
            return <Taggy text={ent.text} spans={state.externalEntities}
              ents={ents} onClick={clickTag} onHighlight={highlightCallback}
            />
          })} */}

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
                  validate="entity"
                />
              </Grid>

              <Grid item xs={3}>
                <AutocompleteEntity
                  label="Predicate"
                  id={'p:'+index}
                  value={state.statements[index].p}
                  options={predicatesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                  onChange={(event: any, newInputValue: any) => {
                    addToStatements('p', newInputValue, index)
                  }}
                  validate="entity"
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
                  validate="entity"
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
                    options={propertiesList.sort((a: any, b: any) => -b.type[0].toUpperCase().localeCompare(a.type[0].toUpperCase()))}
                    onChange={(event: any, newInputValue: any) => {
                      addToStatements('p', newInputValue, index, pindex)
                    }}
                    validate="entity"
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
                    validate="entity"
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
                onClick={addProperty}
                id={"addProp:" + index}
                variant="contained"
                className="button"
                startIcon={<AddIcon />}
                style={{marginLeft: theme.spacing(5), marginRight: theme.spacing(4), marginBottom: theme.spacing(1), textTransform: 'none'}}
                color="inherit" >
                  Add a property to this statement
              </Button>
            </div>
            }
          </Box>
        })}
        <Button onClick={addStatement}
          variant="contained"
          className="button"
          startIcon={<AddIcon />}
          style={{textTransform: 'none', marginTop: theme.spacing(1)}}
          color="info" >
            Add a statement
        </Button>
      </>}

      { state.extractClicked &&
        <PublishNanopubButtons
          user={user}
          generateRDF={generateRDF}
          entitiesList={state.entitiesList}
          inputSource={state.inputSource}
          nanopubGenerated={state.nanopubGenerated}
          nanopubPublished={state.nanopubPublished}
          errorMessage={state.errorMessage}
        />
      }
    </Container>
  )
}
