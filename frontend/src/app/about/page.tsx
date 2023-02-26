"use client";
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText  } from "@mui/material";
import WebappIcon from '@mui/icons-material/Computer';
import ApiIcon from '@mui/icons-material/Storage';
import SearchIcon from '@mui/icons-material/Search';
import PublishIcon from '@mui/icons-material/Outbox';


export default function About() {
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
      <Typography variant="h4" className="mainText" style={{marginBottom: theme.spacing(2)}}>
        About
      </Typography>

      <Typography variant="body1" className="mainText">
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
            <b>Browse Nanopublications</b> through the web UI, or query them using the <b>Translator Reasoner API (TRAPI)</b> specifications.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PublishIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Publish Nanopublications</b> after login with ORCID, and uploading your authentication keys to the server.
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="body1" className="mainText">
        Developed and hosted by the <a href="https://www.maastrichtuniversity.nl/research/institute-data-science" target="_blank" rel="noopener noreferrer">Institute of Data Science</a> at Maastricht University.
      </Typography>


      <Typography variant="h4" className="mainText" style={{margin: theme.spacing(2,0)}}>
        How it works
      </Typography>

      <Typography variant="body1" className="mainText">
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
            <b>Backend API</b>: an OpenAPI built with Python and FastAPI, to store the keys on the server, and run the process to publish a Nanopublication.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <WebappIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Webapp frontend</b>: a website built with TypeScript and React, to provide a user-friendly access to the Nanopublication network.
          </ListItemText>
        </ListItem>
      </List>


    </Container>
  )
}