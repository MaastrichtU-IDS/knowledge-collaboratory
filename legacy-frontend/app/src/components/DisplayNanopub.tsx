import React from "react";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Typography, Card, Paper, IconButton, CardContent, CardActions, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../components/highlightjs-turtle';
hljs.registerLanguage("turtle", hljsDefineTurtle)

import {CytoscapeRdfGraph, rdfToCytoscape} from "../components/CytoscapeRdf";

const DisplayNanopub = ({
  np,
  npDict,
  index,
  usersPubkeys,
  ...args
}: any) => {

  const theme = useTheme();
  const useStyles = makeStyles(() => ({
    input: {
      background: "white",
      fontSize: "11px",
      fontFamily: "monospace",
    },
    paperPadding: {
      padding: theme.spacing(1, 1),
      margin: theme.spacing(1, 0),
    },
    link: {
      color: theme.palette.primary.dark,
      textDecoration: 'none',
      // color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
      },
    },
  }));
  const classes = useStyles();

  const [state, setState] = React.useState({
    npDict: npDict,
    shaclValidate: true,
    loading: false,
    open: false,
    dialogOpen: false,
    published_nanopub: '',
    errorMessage: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  const handleExpandClick = (e: any) => {
    const expand_nanopub = state.npDict[e.currentTarget.name]
    expand_nanopub['expanded'] = !expand_nanopub['expanded']
    updateState({npDict: {...state.npDict, [e.currentTarget.name]: expand_nanopub} });
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
    <Card elevation={4} className={classes.paperPadding} key={index}>
      <CardContent style={{paddingBottom: theme.spacing(1)}}>
        {/* General infos about the nanopub */}
        <Typography variant='h6'>
          <a href={np} className={classes.link} target="_blank" rel="noopener noreferrer">{np}</a>
        </Typography>
        <Typography variant='body2'>
          Published on the {npDict[np]['date']['value']}
          { usersPubkeys[npDict[np]['pubkey']['value']] &&
            <>
              &nbsp;by <a href={usersPubkeys[npDict[np]['pubkey']['value']]['user']['value']}
                  className={classes.link} target="_blank" rel="noopener noreferrer">
                {usersPubkeys[npDict[np]['pubkey']['value']]['name']['value']}
              </a>
            </>
          }
        </Typography>
      </CardContent>

      {/* Buttons to expand the nanopub RDF or graph */}
      <CardActions disableSpacing style={{padding: theme.spacing(0, 1), margin: theme.spacing(0, 0)}}>
        { npDict[np]['rdf'] &&
          <IconButton style={{fontSize: '14px'}}
            onClick={handleExpandClick}
            name={np}
            // aria-expanded={state.expanded_files[repo_obj.url]}
            aria-label="show more"
          >
            {!npDict[np]['expanded'] &&
              <>
                Display the Nanopublication RDF
                <ExpandMoreIcon />
              </>
            }
            {npDict[np]['expanded'] &&
              <>
                Hide the Nanopublication RDF
                <ExpandLessIcon />
              </>
            }
          </IconButton>
        }
        { npDict[np] && npDict[np]['cytoscape'] &&
          <IconButton style={{fontSize: '14px'}}
            onClick={handleExpandGraphClick}
            name={np}
            // aria-expanded={state.expanded_files[repo_obj.url]}
            aria-label="show more"
          >
            {!npDict[np]['expanded_graph'] &&
              <>
                Display the Nanopublication graph
                <ExpandMoreIcon />
              </>
            }
            {npDict[np]['expanded_graph'] &&
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
      { npDict[np] && npDict[np]['rdf'] &&
        <Collapse in={npDict[np]['expanded']} timeout="auto">
          <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
            <pre style={{whiteSpace: 'pre-wrap', margin: theme.spacing(0,0)}}>
              <code className="language-turtle">
                {npDict[np]['rdf']}
                {/* Adding <a> tags don't work in pre code tags */}
                {/* {npDict[np]['rdf'].replace(/<(http(s)?:\/\/\S*?)>/gm, '<a href="$1">$1</a>')} */}
              </code>
            </pre>
          </CardContent>
        </Collapse>
      }

      {/* Display graph when expanded */}
      { npDict[np]['cytoscape'] && npDict[np] &&
        <Collapse in={npDict[np]['expanded_graph']} timeout="auto" unmountOnExit>
          <CardContent style={{margin: theme.spacing(0,0), padding: theme.spacing(0,0)}}>
            <Paper elevation={2} className={classes.paperPadding} style={{ height: '80vh', textAlign: 'left' }}>
              <CytoscapeRdfGraph
                cytoscapeElems={npDict[np]['cytoscape']}
              />
            </Paper>
          </CardContent>
        </Collapse>
      }
    </Card>
  );
}
export default DisplayNanopub;