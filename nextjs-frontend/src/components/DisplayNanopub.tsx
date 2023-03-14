"use client";

import React from "react";
import { useTheme } from "@mui/material/styles";
import { Typography, Card, Paper, IconButton, CardContent, CardActions, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../utils/highlightjs-turtle';
hljs.registerLanguage("turtle", hljsDefineTurtle)

import {CytoscapeRdfGraph, rdfToCytoscape} from "../components/CytoscapeRdf";
// import { CytoscapeRdf } from "cytoscape-rdf";
// import "cytoscape-rdf";


const DisplayNanopub = ({
  np,
  npDict,
  index,
  usersPubkeys,
  ...args
}: any) => {

  const theme = useTheme();

  const [state, setState] = React.useState({
    npDict: npDict,
    shaclValidate: true,
    loading: false,
    open: false,
    dialogOpen: false,
    published_nanopub: '',
    errorMessage: '         ',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  const handleExpandClick = (e: any) => {
    const expand_nanopub = state.npDict[e.currentTarget.name]
    expand_nanopub['expanded'] = !expand_nanopub['expanded']
    updateState({npDict: {...state.npDict, [e.currentTarget.name]: expand_nanopub} });
    console.log("expand_nanopub", expand_nanopub )
    console.log("handleExpandClick", e.currentTarget.name, state.npDict)
    setTimeout(function() {
      hljs.highlightAll();
    }, 200);
  };
  const handleExpandGraphClick = (e: any) => {
    const expand_nanopub = state.npDict[e.currentTarget.name]
    expand_nanopub['expanded_graph'] = !expand_nanopub['expanded_graph']
    updateState({npDict: {...state.npDict, [e.currentTarget.name]: expand_nanopub} });
  };

  return (
    <Card elevation={4} style={{padding: theme.spacing(1, 1), margin: theme.spacing(1, 0)}} key={index}>
      <CardContent style={{paddingBottom: theme.spacing(1)}}>
        {/* General infos about the nanopub */}
        <Typography variant='h6'>
          <a href={np} target="_blank" rel="noopener noreferrer">{np}</a>
          {/* <a href={np} className={classes.link} target="_blank" rel="noopener noreferrer">{np}</a> */}
        </Typography>
        <Typography variant='body2'>
          Published on the {state.npDict[np]['date']['value']}
          { usersPubkeys[state.npDict[np]['pubkey']['value']] &&
            <>
              {/* &nbsp;by <a href={usersPubkeys[npDict[np]['pubkey']['value']]['user']['value']}
                  className={classes.link} target="_blank" rel="noopener noreferrer"></a> */}
              &nbsp;by <a href={usersPubkeys[state.npDict[np]['pubkey']['value']]['user']['value']}
                  target="_blank" rel="noopener noreferrer">
                {usersPubkeys[state.npDict[np]['pubkey']['value']]['name']['value']}
              </a>
            </>
          }
        </Typography>
      </CardContent>

      {/* Buttons to expand the nanopub RDF or graph */}
      <CardActions disableSpacing style={{padding: theme.spacing(0, 1), margin: theme.spacing(0, 0)}}>
        { state.npDict[np]['rdf'] &&
          <IconButton style={{fontSize: '14px'}}
            onClick={handleExpandClick}
            name={np}
            // aria-expanded={state.expanded_files[repo_obj.url]}
            aria-label="show more"
          >
            {!state.npDict[np]['expanded'] &&
              <>
                Display the Nanopublication RDF
                <ExpandMoreIcon />
              </>
            }
            {state.npDict[np]['expanded'] &&
              <>
                Hide the Nanopublication RDF
                <ExpandLessIcon />
              </>
            }
          </IconButton>
        }
        { state.npDict[np] && state.npDict[np]['cytoscape'] &&
          <IconButton style={{fontSize: '14px'}}
            onClick={handleExpandGraphClick}
            name={np}
            // aria-expanded={state.expanded_files[repo_obj.url]}
            aria-label="show more"
          >
            {!state.npDict[np]['expanded_graph'] &&
              <>
                Display the Nanopublication graph
                <ExpandMoreIcon />
              </>
            }
            {state.npDict[np]['expanded_graph'] &&
              <>
                Hide the Nanopublication graph
                <ExpandLessIcon />
              </>
            }
          </IconButton>
        }
      </CardActions>

      {/* Display RDF when expanded */}
      {/* unmountOnExit */}
      { state.npDict[np] && state.npDict[np]['rdf'] &&
        <Collapse in={state.npDict[np]['expanded']} timeout="auto">
          <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
            <pre style={{whiteSpace: 'pre-wrap', margin: theme.spacing(0,0)}}>
              <code className="language-turtle">
                {state.npDict[np]['rdf']}
                {/* Adding <a> tags don't work in pre code tags */}
                {/* {npDict[np]['rdf'].replace(/<(http(s)?:\/\/\S*?)>/gm, '<a href="$1">$1</a>')} */}
              </code>
            </pre>
          </CardContent>
        </Collapse>
      }

      {/* Display graph when expanded */}
      { state.npDict[np]['cytoscape'] && state.npDict[np] &&
        <Collapse in={state.npDict[np]['expanded_graph']} timeout="auto" unmountOnExit>
          <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
            <Paper elevation={2} style={{ height: '80vh', textAlign: 'left', padding: theme.spacing(1, 1), margin: theme.spacing(1, 0) }}>
              <CytoscapeRdfGraph
                cytoscapeElems={state.npDict[np]['cytoscape']}
              />
              {/* <cytoscape-rdf
                elements={state.npDict[np]['cytoscape']}
              /> */}
              {/* <cytoscape-rdf url={np + ".trig"} /> */}
            </Paper>
          </CardContent>
        </Collapse>
      }
    </Card>
  );
}
export default DisplayNanopub;