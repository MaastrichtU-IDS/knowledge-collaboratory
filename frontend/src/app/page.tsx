"use client";

import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Container, CircularProgress, TextField, Box, InputBase, Paper, IconButton, Stack, Autocomplete } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

import { settings } from '../utils/settings';
import { CytoscapeRdfGraph, rdfToCytoscape } from "../components/CytoscapeRdf";
import DisplayNanopub from '../components/DisplayNanopub';

export default function BrowseNanopub() {
  const theme = useTheme();
  // const { user }: any = useContext(UserContext)

  const resourceTypesList: any = [
    {label: 'PREDICT reference dataset', uri: 'http://purl.org/np/RAWWaT9M_Nd8cVm_-amJErz60Ak__tkS6ROi2P-swdmMw'},
    {label: 'Off-Label drug indication dataset', uri: 'http://purl.org/np/RAaZp4akBZI6FuRzIpeksyYxTArOtxqmhuv9on-YssEzA'},
    {label: 'Claims published with Annotate biomedical text', uri: 'https://w3id.org/biolink/infores/knowledge-collaboratory'},
    {label: 'All nanopublications', uri: 'All nanopublications',},
  ]
  const users_pubkeys: any = {}
  const nanopub_obj: any = {}
  const users_orcid: any = {}
  const filter_user: any = {}
  const filterPerResource: any = {}
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
    filterPerResource: filterPerResource
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // const initNanopubObj: any = {}
  const [nanopubObj, setNanopubObj] = React.useState([])


  React.useEffect(() => {
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let searchText = params.get('search');
    // http://grlc.nanopubs.lod.labs.vu.nl/api/local/local/get_all_users
    // Returns csv with columns: user, name, intronp, date, pubkey
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
          // console.log(users_pubkeys);
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
    const knowledgeProvider = 'https://w3id.org/biolink/infores/knowledge-collaboratory'
    const assertionBlocks = []
    const provBlocks = []

    if (search) {
      assertionBlocks.push(`             ?association ?pred ?v .
      FILTER(contains(lcase(str(?v)), lcase("${search}") ) )`)
      // Using Virtuoso full text search (misses URIs):
      // assertionBlocks.push(`            { ?association ?pred ?v . ?v luc:npIdx "${search}" . }
      // UNION
      // { ?association ?pred ?v .  ?v <bif:contains> "${search}" . }`)
    }

    let filterNpIndexBlock = ''
    if (state.filterPerResource && Object.keys(state.filterPerResource).length > 0) {
      if (state.filterPerResource.uri === "https://w3id.org/biolink/infores/knowledge-collaboratory") {
        // Only claims published with the collaboratory tools
        provBlocks.push(`?np_assertion prov:wasQuotedFrom ?wasQuotedFrom .`)
      } else if (state.filterPerResource.uri !== "All nanopublications") {
        // assertionBlocks.push(`?association biolink:primary_knowledge_source <${state.filterPerResource.uri}> .`)
        filterNpIndexBlock = `graph ?indexAssertionGraph {
          {
            <${state.filterPerResource.uri}> npx:appendsIndex* ?index .
            ?index npx:includesElement ?np .
          } UNION {
            <${state.filterPerResource.uri}> npx:includesElement ?np .
          }
        }`
      }
    } else {
      // By default we show all nanopubs in the Knowledge Collaboratory
      assertionBlocks.push(`?association biolink:aggregator_knowledge_source <${knowledgeProvider}> .`)
    }

    let assertionGraphBlock = ''
    if (assertionBlocks.length > 0) {
      assertionGraphBlock = `graph ?assertionGraph {
        ${assertionBlocks.join('\n')}
      }`
    }

    let provGraphBlock = ''
    if (provBlocks.length > 0) {
      provGraphBlock = `graph ?provGraph {
        ${provBlocks.join('\n')}
      }`
    }

    let filterPubkey = ''
    if (state.filter_user && state.filter_user.pubkey) {
      filterPubkey = `FILTER contains(?pubkey, "${state.filter_user.pubkey.value}")`
    }

    const getLatestNanopubsQuery = `prefix np: <http://www.nanopub.org/nschema#>
      prefix npa: <http://purl.org/nanopub/admin/>
      prefix npx: <http://purl.org/nanopub/x/>
      prefix xsd: <http://www.w3.org/2001/XMLSchema#>
      prefix dct: <http://purl.org/dc/terms/>
      prefix biolink: <https://w3id.org/biolink/vocab/>
      prefix luc: <http://www.ontotext.com/owlim/lucene#>
      prefix bif: <http://www.openlinksw.com/schemas/bif#>
      prefix npx: <http://purl.org/nanopub/x/>

      SELECT DISTINCT ?np ?date ?pubkey WHERE {
        GRAPH npa:graph {
          ?np npa:hasHeadGraph ?h .
          ?np dct:created ?date .
          ?np npa:hasValidSignatureForPublicKey ?pubkey.
        }
        GRAPH ?h {
          ?np np:hasAssertion ?assertionGraph ;
            np:hasPublicationInfo ?pubInfoGraph ;
            np:hasProvenance ?provGraph .
        }
        ${assertionGraphBlock}
        ${provGraphBlock}
        ${filterNpIndexBlock}
        FILTER not exists {
          GRAPH npa:graph {
            ?newversion npa:hasHeadGraph ?nh .
            ?newversion npa:hasValidSignatureForPublicKey ?pubkey .
          }
          GRAPH ?nh {
            ?newversion np:hasPublicationInfo ?ni .
          }
          GRAPH ?ni {
            ?newversion npx:supersedes ?np .
          }
        }
        FILTER not exists {
          GRAPH npa:graph {
            ?retraction npa:hasHeadGraph ?rh .
            ?retraction npa:hasValidSignatureForPublicKey ?pubkey .
          }
          GRAPH ?rh {
            ?retraction np:hasAssertion ?ra .
          }
          GRAPH ?ra {
            ?somebody npx:retracts ?np .
          }
        }
        ${filterPubkey}
      } ORDER BY desc(?date) LIMIT ` + state.results_count

    get_nanopubs_url = `${settings.nanopubSparqlUrl}?query=${encodeURIComponent(getLatestNanopubsQuery)}`
    console.log(`Search: sending SPARQL query to ${settings.nanopubSparqlUrl}`)
    console.log(getLatestNanopubsQuery)

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
          Object.keys(nanopub_obj).map((nanopub_url: any) => {
            // Finally iterate over the list of nanopubs to get their RDF content
            axios.get(nanopub_url,
            {
              headers: {
                "accept": "application/trig",
              }
            })
              .then(res => {
                nanopub_obj[nanopub_url]['rdf'] = res.data
                nanopub_obj[nanopub_url]['expanded'] = false
                nanopub_obj[nanopub_url]['expanded_graph'] = false
                nanopub_obj[nanopub_url]['cytoscape'] = rdfToCytoscape(nanopub_obj[nanopub_url]['rdf'])
                setNanopubObj({...nanopub_obj});
                updateState({
                  nanopub_obj: nanopub_obj,
                })
              })
              .catch(error => {
                console.log(error)
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
  // const hideAllNanopubs = () => {
  //   Object.keys(state.nanopub_obj).map((np: any) => {
  //     const expand_nanopub = state.nanopub_obj[np]
  //     expand_nanopub['expanded'] = false
  //     updateState({nanopub_obj: {...state.nanopub_obj, [np]: expand_nanopub} });
  //   })
  // }

  return(
    <Container className='mainContainer' >
      <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(1, 0)}}>
        🔍️ Browse Nanopublications
      </Typography>

      {/* Filtering options */}
      <Stack direction="row" spacing={2} justifyContent="center" style={{margin: theme.spacing(2, 0 )}}>
        {/* Search box */}
        <form onSubmit={handleSearch}>
          <Paper style={{padding: theme.spacing(1), display: 'flex', alignItems: 'center', width: '35ch'}}>
            <InputBase
              style={{marginLeft: theme.spacing(1), fontSize: '13px', flex: 1,}}
              inputProps={{ 'aria-label': 'search input' }}
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

        <Autocomplete
          id="filter-resource"
          options={resourceTypesList}
          // options={state.users_list.sort((a: any, b: any) => -b.firstLetter.localeCompare(a.firstLetter))}
          getOptionLabel={(option: any) => option.label}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label={"📂 Filter per knowledge source"} />}
          onChange={(event, newInputValue: any) => {
            updateState({
              filterPerResource: newInputValue
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
          🗃️ {Object.keys(state.nanopub_obj).length} nanopublications found
          {/* { state.results_count == Object.keys(state.nanopub_obj).length &&
            <>
              &nbsp;(limit maximum 🔥)
            </>
          } */}
        </Typography>
      }

      { state.loading_nanopubs &&
        <Box sx={{textAlign: 'center', margin: theme.spacing(10, 0)}} >
          <CircularProgress style={{textAlign: 'center'}} />
        </Box>
      }

      {/* Iterate over nanopubs and display them */}
      { Object.keys(state.nanopub_obj).map((np: any, key: number) => (
        <DisplayNanopub
          np={np}
          npDict={state.nanopub_obj}
          usersPubkeys={state.users_pubkeys}
          index={key}
          key={key}
        />
      ))}
    </Container>
  )
}
