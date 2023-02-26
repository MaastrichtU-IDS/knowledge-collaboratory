"use client";
import React, {useEffect} from "react";
import { useTheme } from "@mui/material/styles";
import { Autocomplete, TextField, Button, Stack, Box } from "@mui/material";
import axios from 'axios';


const PubAnnotationProjects = ({
  onClick,
  id,
  value,
  // groupBy=(option: any) => (option.type ? option.type : null),
  ...args
}: any) => {
  const theme = useTheme();
  const [state, setState] = React.useState({
    projects: [],
    projectSelected: {
      author: "", created_at: "", license: "",
      maintainer: "", name: "", updated_at: "",
    },
    loadedDocs: [],
    loadDoc: {url: "", sourcedb: "", sourceid: ""},
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


  useEffect(() => {
    axios.get("http://pubannotation.org/projects.json",
      {
        headers: {
          "accept": "application/json",
        }
      })
        .then(res => {
          console.log(res.data)
          updateState({
            projects: res.data,
          })
        })
        .catch(error => {
          console.log(error)
        })
  }, []);

  const onChange = (event: any, newInputValue: any) => {
    if (newInputValue) {
      console.log("PROJECT AUTOCOMPLETE", newInputValue)
      updateState({projectSelected: newInputValue})
    }
  }

  const onClickLoad = () => {
    console.log("onClickLoad", state.projectSelected.name)
    axios.get(`https://pubannotation.org/projects/${state.projectSelected.name}/docs.json`,
      {
        headers: {
          "accept": "application/json",
        }
      })
        .then(res => {
          getDocToAnnotate(res.data)
        })
        .catch(error => {
          console.log(error)
        })
  }

  const getDocToAnnotate = async (loadedDocs: any) => {
    // TODO: get the number of annotations already done for this project
    // And fetch the annotation for this number + 1 (get the right page by /10)
    const annotateDoc = loadedDocs[0]
    const res = await axios.get(`${annotateDoc.url}.json`)
      // {
      //   headers: {
      //     "accept": "application/json",
      //   }
      // })
      //   .then(res => {
      //     console.log(res.data)
      //     return res.data
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    res.data['project'] = `https://pubannotation.org/projects/${state.projectSelected.name}`
    onClick(res.data)
    return res.data
  }

  const label = "Select a PubAnnotation project to load a document to annotate"

  return (
    // <Stack direction="row" spacing={2} style={{width: 'auto'}}>
    <Box sx={{ display: 'flex', justifyContent: "center", width: '100%', marginTop: theme.spacing(2) }}>
      <Autocomplete
        key={id}
        id={id}
        freeSolo
        value={value}
        options={state.projects}
        onChange={onChange}
        onInputChange={onChange}
        // Automatically update the state value, but cause issue with default values
        // (using label as value instead of the fulle object)
        getOptionLabel={(option: any) => {
          return option.name
        }}
        // groupBy={groupBy}
        style={{width: '60%', marginRight: theme.spacing(2)}}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            className="input"
            key={label}
            label={label}
            placeholder={label}
            // error={validate == 'entity' && !checkIfEntity(value)}
            // helperText={validate == 'entity' && !checkIfEntity(value) && "This value is not valid, make sure the selected entity has an identifier, or provid a valid URI."}
            // TODO: only works at init
            // try Controller hook? https://stackoverflow.com/questions/69295842/error-validation-with-material-ui-autcomplete-react-hook-form
          />
        )}
        {...args}
      />
      <Button onClick={() => { onClickLoad() }}
        variant="contained"
        className="button"
        // startIcon={<AddIcon />}
        color="info" >
          Load a document from this project
      </Button>
    </Box>
  );
}
export default PubAnnotationProjects;