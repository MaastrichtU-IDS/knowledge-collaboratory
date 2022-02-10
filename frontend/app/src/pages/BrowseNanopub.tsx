import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Typography, Container, Button, Card, CircularProgress, Snackbar, TextField, Box, InputBase, Paper, IconButton, Stack, Autocomplete, CardContent, CardActions, Collapse } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HideNanopubs from '@mui/icons-material/UnfoldLess';
import axios from 'axios';

import { settings } from '../settings';
// import UserContext from '../UserContext'

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../components/highlightjs-turtle';
hljs.registerLanguage("turtle", hljsDefineTurtle)

import {CytoscapeRdfGraph, rdfToCytoscape} from "../components/CytoscapeRdf";

import { Graph } from "perfect-graph";
// yarn add perfect-graph@0.0.158 colay@0.0.68 colay-ui@0.0.145 immer@9.0.12 react@^17.0.2 react-dom@^17.0.2
// yarn add react@^17.0.2 react-dom@^17.0.2

export default function BrowseNanopub() {
  const theme = useTheme();
  // const { user }: any = useContext(UserContext)

  const useStyles = makeStyles(() => ({
    link: {
      color: theme.palette.primary.dark,
      textDecoration: 'none',
      // color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
      },
    },
    paperSearch: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '35ch'
    },
    searchInput: {
      marginLeft: theme.spacing(1),
      fontSize: '16px',
      flex: 1,
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
      padding: theme.spacing(1, 1),
      margin: theme.spacing(1, 0),
    },
    paperTitle: {
      fontWeight: 300,
      marginBottom: theme.spacing(1),
    }
  }))
  const classes = useStyles();

  const users_pubkeys: any = {}
  const nanopub_obj: any = {}
  const users_orcid: any = {}
  const filter_user: any = {}
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    loading_nanopubs: false,
    filter_user: filter_user,
    filter_text: '',
    search: '',
    results_count: 10,
    nanopub_list: [],
    nanopub_obj: nanopub_obj,
    prefixes: {},
    users_list: [],
    users_pubkeys: users_pubkeys,
    users_orcid: users_orcid,
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);
  
  
  React.useEffect(() => {
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let searchText = params.get('search');
    // http://grlc.nanopubs.lod.labs.vu.nl/api/local/local/get_all_users
    // Returns csv with columns: user 	name 	intronp 	date 	pubkey

    updateState({
      loading_nanopubs: true
    })

    // First call to get users
    axios.get(settings.nanopubGrlcUrl + '/get_all_users', 
      { 
        headers: {
          "accept": "application/json",
        }
      })
        .then(res => {
          const users_pubkeys: any = {}
          const users_orcid: any = {}
          const users_list = []
          for (const user of res.data['results']['bindings']) {
            // Remove bad ORCID URLs
            if (!user['user']['value'].startsWith('https://orcid.org/https://orcid.org/')) {
              if (!user['name']) {
                user['name'] = {'value': user['user']['value']}
              }
              users_pubkeys[user['pubkey']['value']] = user
              users_orcid[user['user']['value']] = user
            }
          }
          for (const user of Object.keys(users_orcid)) {
            // users_pubkeys[user['pubkey']['value']] = user
            // users_orcid[user['user']['value']] = user
            users_list.push(users_orcid[user])
          }
          console.log(users_pubkeys);
          updateState({
            users_list: users_list,
            users_pubkeys: users_pubkeys,
            users_orcid: users_orcid
          })
          // console.log(res.data['results']['bindings']);

          getNanopubs('')
        })
        .catch(error => {
          console.log(error)
        })

    // TODO: search for text with users pubkey with results in JSON
    // http://grlc.nanopubs.lod.labs.vu.nl/api/local/local/find_valid_signed_nanopubs_with_text?pubkey=aaaa&text=covid
    // curl -X GET "http://grlc.nanopubs.lod.labs.vu.nl/api/local/local/find_valid_signed_nanopubs_with_text?text=covid" -H  "accept: application/json"
    //   { "head": { "link": [], "vars": ["np", "graphpred", "subj", "pred", "v", "date", "pubkey", "superseded", "retracted"] },
    // "results": { "distinct": false, "ordered": true, "bindings": [
    //   { "np": { "type": "uri", "value": "http://purl.org/np/RAcp3CnDDmfxN9HAdeGMTTIZZtGknEhV2-BZrNX0i4cPA" }	, "graphpred": { "type": "uri", "value": "http://www.nanopub.org/nschema#hasAssertion" }	, "subj": { "type": "uri", "value": "http://purl.org/np/RAcp3CnDDmfxN9HAdeGMTTIZZtGknEhV2-BZrNX0i4cPA#EduSocDL" }	, "pred": { "type": "uri", "value": "http://www.w3.org/2000/01/rdf-schema#label" }	, "v": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "Data Linking across Social and Educational Sciences on COVID-19" }	, "date": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#dateTime", "value": "2020-10-05T14:20:03.409Z" }	, "pubkey": { "type": "typed-literal", "datatype": "http://www.w3.org/2001/XMLSchema#string", "value": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCK4NfUi+AdFS8l/WeyiKQmCyFyjrjfGnpHvUvdGUlkg2+FkOY3+31U4a4SdeLUdhf4hnxL8kQOjD8BuggdBkuwUoMA0RXPv+RblmlF5INhXDJvxTqeUMLj1EVuOtotpl//NVFZ3BE0zeuscT35szmX4L+2m14Z/PqreP2lMzbj3wIDAQAB" }},
  }, [])


  const getNanopubs = (search: string = '') => {
    let get_nanopubs_url = settings.nanopubGrlcUrl + '/find_valid_signed_nanopubs?'
    if (search) {
      if (search.startsWith('http://') || search.startsWith('https://')) {
        get_nanopubs_url = settings.nanopubGrlcUrl + '/find_valid_signed_nanopubs_with_uri?ref=' + search
      } else {
        get_nanopubs_url = settings.nanopubGrlcUrl + '/find_valid_signed_nanopubs_with_text?text=' + search
      }
    }
    // if (user.id) {
    //   // If user is logged in, by default 
    //   const user_pubkey = state.users_orcid[user.id]['pubkey']['value']
    //   get_nanopubs_url = settings.nanopubGrlcUrl + '/find_valid_signed_nanopubs?pubkey=' + user_pubkey
    // }
    if (state.filter_user.pubkey) {
      get_nanopubs_url = get_nanopubs_url + '&pubkey=' + encodeURIComponent(state.filter_user.pubkey.value)
    }

    console.log(get_nanopubs_url);

    // Get the list of signed nanopubs
    axios.get(get_nanopubs_url,
      { 
        headers: {
          "accept": "application/json",
        }
      })
        .then(res => {
          const nanopub_list = res.data['results']['bindings']
          const nanopub_obj: any = {}
          let np_count = 0
          for (const nanopub of nanopub_list) {
            // Fix purl URIs to use https (cant query http from https with js)
            const np_uri = nanopub['np']['value'].replace('http://purl.org/np/', 'https://purl.org/np/')
            nanopub_obj[np_uri] = nanopub

            np_count++
            if (np_count >= state.results_count) {
              break;
            }
          }
          updateState({
            nanopub_obj: nanopub_obj,
            nanopub_list: nanopub_list,
            loading_nanopubs: false
          })
          // console.log(nanopub_list);
          Object.keys(nanopub_obj).map((nanopub_url: any) => {
            // Finally iterate over the list of nanopubs to get their RDF content
            axios.get(nanopub_url, 
            { 
              headers: {
                "accept": "application/trig",
                // "accept": "application/json",
              }
            }
            )
              .then(res => {
                nanopub_obj[nanopub_url]['rdf'] = res.data
                nanopub_obj[nanopub_url]['expanded'] = false
                nanopub_obj[nanopub_url]['expanded_graph'] = false
                // TODO: add cytoscape elements list here
                nanopub_obj[nanopub_url]['cytoscape'] = rdfToCytoscape(nanopub_obj[nanopub_url]['rdf'])
                console.log(nanopub_obj[nanopub_url]['cytoscape']);
                updateState({
                  nanopub_obj: nanopub_obj,
                })
              })
              .catch(error => {
                console.log(error)
              })
              .finally(() => {
                hljs.highlightAll();
              })
          })
        })
        .catch(error => {
          console.log(error)
        })
  }


  const handleSearch  = (event: any) => {
    event.preventDefault();
    updateState({
      nanopub_obj: {},
      loading_nanopubs: true
    })
    getNanopubs(state.search)
  }

  const searchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ search: event.target.value })
  }
  const handleExpandClick = (e: any) => {
    const expand_nanopub = state.nanopub_obj[e.currentTarget.name]
    expand_nanopub['expanded'] = !expand_nanopub['expanded']
    updateState({nanopub_obj: {...state.nanopub_obj, [e.currentTarget.name]: expand_nanopub} });
    setTimeout(function() {
      hljs.highlightAll();
    }, 200);
  };
  const handleExpandGraphClick = (e: any) => {
    const expand_nanopub = state.nanopub_obj[e.currentTarget.name]
    expand_nanopub['expanded_graph'] = !expand_nanopub['expanded_graph']
    updateState({nanopub_obj: {...state.nanopub_obj, [e.currentTarget.name]: expand_nanopub} });
  };
  const hideAllNanopubs = () => {
    Object.keys(state.nanopub_obj).map((np: any) => {
      const expand_nanopub = state.nanopub_obj[np]
      expand_nanopub['expanded'] = false
      updateState({nanopub_obj: {...state.nanopub_obj, [np]: expand_nanopub} });
    })
  }

  return(
    <Container className='mainContainer' >
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        🔍️ Browse Nanopublications
      </Typography>

      {/* TODO: try default perfect-graph */}
      {/* <Graph
        style={{ width: 600, height: 400 }}
        nodes={[
          { id: '1', position: { x: 10, y: 10 } },
          { id: '2', position: { x: 300, y: 100 } },
        ]}
        edges={[{ id: '51', source: '1', target: '2' }]}
      /> */}

      {/* Filtering options */}
      {/* <Box display="flex" style={{margin: theme.spacing(0, 0)}}> */}
      <Stack direction="row" spacing={2} justifyContent="center" style={{margin: theme.spacing(2, 0 )}}>
        {/* Search box */}
        <form onSubmit={handleSearch}>
          <Paper component="form" className={classes.paperSearch}>
            <InputBase
              className={classes.searchInput} inputProps={{ 'aria-label': 'search input' }}
              placeholder={"🔍️ Search text/URI in Nanopublications"}
              onChange={searchChange}
            />
            <IconButton aria-label="search button" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </form>

        <Autocomplete
          id="filter-user"
          options={state.users_list}
          // options={state.users_list.sort((a: any, b: any) => -b.firstLetter.localeCompare(a.firstLetter))}
          getOptionLabel={(option: any) => option.name.value}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label={"👤 Filter per user (" + state.users_list.length + " users)"} />}
          onChange={(event, newInputValue: any) => {
            updateState({
              filter_user: newInputValue
            })
          }}
          style={{ backgroundColor: '#ffffff' }}
        />

        <TextField
          id="results-count"
          value={state.results_count}
          onChange={(e: any) => {updateState({results_count: e.target.value})}}
          label="Max number of results"
          type="number"
          variant="outlined"
          style={{ backgroundColor: '#ffffff' }}
        />
      </Stack>

      { !state.loading_nanopubs &&
        <Typography>
          {Object.keys(state.nanopub_obj).length} nanopublications found
          { state.results_count == Object.keys(state.nanopub_obj).length &&
            <>
              &nbsp;(limit maximum 🔥)
            </>
          }
          <Button onClick={hideAllNanopubs}
            variant="contained" 
            className={classes.saveButton} 
            startIcon={<HideNanopubs />}
            style={{textTransform: 'none', margin: theme.spacing(1, 2)}}
            color="inherit" >
              Hide all Nanopublications content
          </Button>
        </Typography>
      }

      { state.loading_nanopubs &&
        <Box sx={{textAlign: 'center', margin: theme.spacing(10, 0)}} >
          <CircularProgress style={{textAlign: 'center'}} />
        </Box>
      }

      {/* Iterate over nanopubs and display them */}
      { Object.keys(state.nanopub_obj).map((np: any, key: number) => (
        <Card elevation={4} className={classes.paperPadding} key={key}>
          <CardContent style={{paddingBottom: theme.spacing(1)}}>
            <Typography variant='h6'>
              <a href={np} className={classes.link} target="_blank" rel="noopener noreferrer">{np}</a>
            </Typography>
            <Typography variant='body2'>
              Published on the {state.nanopub_obj[np]['date']['value']}
              { state.users_pubkeys[state.nanopub_obj[np]['pubkey']['value']] &&
                <>
                  &nbsp;by <a href={state.users_pubkeys[state.nanopub_obj[np]['pubkey']['value']]['user']['value']} 
                      className={classes.link} target="_blank" rel="noopener noreferrer">
                    {state.users_pubkeys[state.nanopub_obj[np]['pubkey']['value']]['name']['value']}
                  </a>
                </>
              }
            </Typography>
          </CardContent>

          {/* (option: any) => option.name.value} */}
          <CardActions disableSpacing style={{padding: theme.spacing(0, 1), margin: theme.spacing(0, 0)}}>
            {state.nanopub_obj[np]['rdf'] &&
              <IconButton style={{fontSize: '14px'}}
                onClick={handleExpandClick}
                name={np}
                // aria-expanded={state.expanded_files[repo_obj.url]}
                aria-label="show more"
              >
                {!state.nanopub_obj[np]['expanded'] &&
                  <>
                    Display the Nanopublication
                    <ExpandMoreIcon />
                  </>
                }
                {state.nanopub_obj[np]['expanded'] &&
                  <>
                    Hide the Nanopublication
                    <ExpandLessIcon />
                  </>
                }
              </IconButton>
            }
            { state.nanopub_obj[np]['cytoscape'] &&
              <IconButton style={{fontSize: '14px'}}
                onClick={handleExpandGraphClick}
                name={np}
                // aria-expanded={state.expanded_files[repo_obj.url]}
                aria-label="show more"
              >
                {!state.nanopub_obj[np]['expanded_graph'] &&
                  <>
                    Display the graph
                    <ExpandMoreIcon />
                  </>
                }
                {state.nanopub_obj[np]['expanded_graph'] &&
                  <>
                    Hide the graph
                    <ExpandLessIcon />
                  </>
                }
              </IconButton>
            }
          </CardActions>

          <Collapse in={state.nanopub_obj[np]['expanded_graph']} timeout="auto" unmountOnExit>
            <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
              <Paper elevation={2} className={classes.paperPadding} style={{ height: '80vh', textAlign: 'left' }}>
                <CytoscapeRdfGraph 
                  rdf={state.nanopub_obj[np]['rdf']} 
                  cytoscapeElems={state.nanopub_obj[np]['cytoscape']}
                />
              </Paper>
            </CardContent>
          </Collapse>

          <Collapse in={state.nanopub_obj[np]['expanded']} timeout="auto" unmountOnExit>
            <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
              <pre style={{whiteSpace: 'pre-wrap', margin: theme.spacing(0,0)}}>
                <code className="language-turtle">
                  {state.nanopub_obj[np]['rdf']}
                </code>
              </pre>
            </CardContent>
          </Collapse>

        </Card>
      ))}

    </Container>
  )
}
