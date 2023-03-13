import React, {useEffect} from 'react';
import {useTheme} from '@mui/material/styles';
import {Autocomplete, TextField, Button, Typography, Box} from '@mui/material';
import axios from 'axios';
import {settings} from '../utils/settings';

const PubAnnotationProjects = ({
  onClick,
  id,
  value,
  // groupBy=(option: any) => (option.type ? option.type : null),
  ...args
}: any) => {
  const [state, setState] = React.useState({
    projects: [],
    projectSelected: {
      author: '',
      created_at: '',
      license: '',
      maintainer: '',
      name: '',
      updated_at: '',
      url: '',
      countPublished: ''
    },
    countPublished: -1,
    loadedDocs: [],
    loadDoc: {url: '', sourcedb: '', sourceid: ''},
    loading: false,
    open: false,
    dialogOpen: false,
    published_nanopub: '',
    errorMessage: '         '
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback(
    (update: any) => {
      stateRef.current = {...stateRef.current, ...update};
      setState(stateRef.current);
    },
    [setState]
  );

  useEffect(() => {
    axios
      .get('https://pubannotation.org/projects.json', {
        headers: {
          accept: 'application/json'
        }
      })
      .then(res => {
        console.log(res.data);
        updateState({
          projects: res.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const onChange = async (event: any, newInputValue: any) => {
    console.log('newInputValue', newInputValue);
    if (newInputValue && newInputValue.name) {
      newInputValue['url'] = `https://pubannotation.org/projects/${newInputValue.name}`;
      // TODO: get the number of annotations already done for this project
      // And fetch the annotation for this number + 1 (get the right page by /10)
      const getAlreadyPublishedQuery = `prefix np: <http://www.nanopub.org/nschema#>
        prefix npa: <http://purl.org/nanopub/admin/>
        prefix npx: <http://purl.org/nanopub/x/>
        prefix xsd: <http://www.w3.org/2001/XMLSchema#>
        prefix dct: <http://purl.org/dc/terms/>
        prefix biolink: <https://w3id.org/biolink/vocab/>
        prefix tao: <http://pubannotation.org/ontology/tao.owl#>

        SELECT (count(DISTINCT ?s) AS ?count) WHERE {
          ?s tao:part_of <${newInputValue['url']}>
      }`;
      const alreadyPublished = await axios.get(
        `${settings.nanopubSparqlUrl}?query=${encodeURIComponent(getAlreadyPublishedQuery)}`
      );
      const countPublished = parseInt(alreadyPublished.data.results.bindings[0].count.value);
      updateState({projectSelected: newInputValue, countPublished: countPublished});
    }
  };

  const onClickLoad = async () => {
    const page = state.countPublished == 0 ? 1 : state.countPublished / 10;
    const numberInPage = state.countPublished == 0 ? 0 : state.countPublished % 10;

    axios
      .get(`${state.projectSelected.url}/docs.json?page=${page}`, {
        headers: {
          accept: 'application/json'
        }
      })
      .then(res => {
        getDocToAnnotate(res.data[numberInPage]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getDocToAnnotate = async (annotateDoc: any) => {
    const res = await axios.get(`${annotateDoc.url.replace('http://', 'https://')}.json`);
    res.data['project'] = state.projectSelected.url;
    onClick(res.data);
    return res.data;
  };

  const label = 'Select a PubAnnotation project to load a document to annotate';

  return (
    <>
      <Box sx={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '16px', marginBottom: '16px'}}>
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
            return option.name;
          }}
          // groupBy={groupBy}
          style={{width: '60%', marginRight: '16px'}}
          renderInput={params => (
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
        <Button
          onClick={() => {
            onClickLoad();
          }}
          variant="contained"
          className="button"
          // startIcon={<AddIcon />}
          color="info"
        >
          Load a document from this project
        </Button>
      </Box>
      {state.countPublished >= 0 && (
        <Typography variant="body1" style={{textAlign: 'center', marginBottom: '16px'}}>
          📝 {state.countPublished} documents have been annotated for the{' '}
          <a href={state.projectSelected.url} target="_blank" rel="noopener noreferrer">
            {state.projectSelected.name}
          </a>{' '}
          PubAnnotation project
        </Typography>
      )}
    </>
  );
};
export default PubAnnotationProjects;
