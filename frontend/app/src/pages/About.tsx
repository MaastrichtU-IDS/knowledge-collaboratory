import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText  } from "@mui/material";
import EvaluationIcon from '@mui/icons-material/NetworkCheck';
import CollectionIcon from '@mui/icons-material/PlaylistAddCheck';
import AssessmentIcon from '@mui/icons-material/Biotech';
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
        Knowledge Collaboratory is a web service to evaluate how much online resources follow to the <a href="https://www.go-fair.org/fair-principles" className={classes.link} target="_blank" rel="noopener noreferrer">FAIR principles ♻️</a> (Findable, Accessible, Interoperable, Reusable).
      </Typography>

      <Typography variant="body1" className={classes.mainText}>
        Developed and hosted by the <a href="https://www.maastrichtuniversity.nl/research/institute-data-science" className={classes.link} target="_blank" rel="noopener noreferrer">Institute of Data Science</a> at Maastricht University.
      </Typography>

      <Typography variant="body1" className={classes.mainText}>
        This platform take inspiration from existing FAIR evaluation implementations: the <a href="https://fairsharing.github.io/FAIR-Evaluator-FrontEnd/#!/" className={classes.link} target="_blank" rel="noopener noreferrer">FAIR evaluator</a>, 
        FAIRsFAIR's <a href="https://f-uji.net/" className={classes.link} target="_blank" rel="noopener noreferrer">F-UJI</a>, 
        and <a href="https://foops.linkeddata.es/FAIR_validator.html" className={classes.link} target="_blank" rel="noopener noreferrer">FOOPS!</a> ontology validator.
      </Typography>
      

      <Typography variant="h4" className={classes.mainText} style={{margin: theme.spacing(2,0)}}>
        How it works
      </Typography>


      <Typography variant="body1" className={classes.mainText}>
        An <b>evaluation</b> runs a <b>collection</b> of <b>assessments</b> against the resource to evaluate.
      </Typography>

      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EvaluationIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Evaluations</b> can be created by anyone without authentication. An evaluation takes the URI of the resource to evaluate, and a collection of assessments to run against this resource. 
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CollectionIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <b>Collections</b> can be created through the API after authenticating with ORCID. A collection is a sorted list of assessments
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AssessmentIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText> 
            <b>Assessments</b> are tests written in Python that can be part of a collection. 
            Each assessment run some tests against the resource to evaluate, 
            record the results, and pass the results to the next assessment in the collection. 
            To create a test you will need to add a python file in the folder <a href="https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments" className={classes.link} target="_blank" rel="noopener noreferrer">backend/app/assessments</a> and
            send us a pull request
          </ListItemText>
        </ListItem>
      </List>


    </Container>
  )
}