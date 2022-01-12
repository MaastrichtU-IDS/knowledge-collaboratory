import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText  } from "@mui/material";
import WebappIcon from '@mui/icons-material/Computer';
import ApiIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Biotech';
import SearchIcon from '@mui/icons-material/Search';
import PublishIcon from '@mui/icons-material/Outbox';
// import AssessmentIcon from '@mui/icons-material/CheckCircle';

import {getUrlHtml} from '../settings'


const useStyles = makeStyles((theme: any) => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  },
  mainText: {
    textAlign: 'left', 
    marginBottom: '20px'
    // margin: theme.spacing(4, 0)
  }
}))


export default function About() {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    project_license: '',
    language_autocomplete: [],
  });
  // const form_category_dropdown = React.createRef(); 

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" className={classes.mainText} style={{marginBottom: theme.spacing(2)}}>
        About
      </Typography>

      <Typography variant="body1" className={classes.mainText}>
        The Knowledge Collaboratory is a web service to query and publish Nanopublications for the NCATS Biomedical Data Translator project.
      </Typography>

      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SearchIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Browse Nanopublications</b> through the web UI, or query them using the <b>Translator Reasoner API (TRAPI)</b> specifications
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PublishIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Publish Nanopublications</b> after login with ORCID, and uploading your authentication keys to the server
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="body1" className={classes.mainText}>
        Developed and hosted by the <a href="https://www.maastrichtuniversity.nl/research/institute-data-science" className={classes.link} target="_blank" rel="noopener noreferrer">Institute of Data Science</a> at Maastricht University.
      </Typography>


      <Typography variant="h4" className={classes.mainText} style={{margin: theme.spacing(2,0)}}>
        How it works
      </Typography>

      <Typography variant="body1" className={classes.mainText}>
        The Knowledge Collaboratory consists in an OpenAPI service and a user-friendly web UI to query the Nanopublications network, 
        store Nanopublication authentication keys, and publish Nanopublications.
      </Typography>

      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ApiIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Backend API</b>: an OpenAPI built with Python and FastAPI
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <WebappIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Webapp frontend</b>: a website built with TypeScript and React
          </ListItemText>
        </ListItem>
      </List>


    </Container>
  )
}