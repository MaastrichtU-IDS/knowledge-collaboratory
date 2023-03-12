import React from "react";
import axios from 'axios';
import { Typography, Paper, Checkbox, FormControlLabel, Button, Card } from "@mui/material";


import { settings, genericContext } from '../utils/settings';
import { FormSettings } from './StyledComponents';
import Icon from './Icon';

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import hljsDefineTurtle from '../utils/highlightjs-turtle';
hljs.registerLanguage("turtle", hljsDefineTurtle)

// import { rdfToRdf } from '../utils/utils';

const PublishNanopubButtons = ({
  user,
  generateRDF,
  entitiesList,
  inputSource,
  nanopubGenerated,
  nanopubPublished,
  errorMessage,
  ...args
}: any) => {

  const [state, setState] = React.useState({
    shaclValidate: true,
    loading: false,
    open: false,
    nanopubGenerated: nanopubGenerated,
    nanopubPublished: nanopubPublished,
    dialogOpen: false,
    published_nanopub: '',
    errorMessage: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);



  const handleDownloadRDF  = (event: React.FormEvent) => {
    // Trigger JSON-LD file download
    event.preventDefault();
    const stmtJsonld: any = generateRDF()
    // rdfToRdf(stmtJsonld)
    //   .then((formattedRdf: any) => {
    //     console.log(formattedRdf);
    //   })
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stmtJsonld, null, 4)));
    element.setAttribute('download', 'annotation.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  const publishSignedNanopub  = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user.error) {
      const access_token = user['access_token']
      axios.post(
          `${settings.apiUrl}/publish-last-signed`,
          null,
          {
            headers: { Authorization: `Bearer ${access_token}` },
            // params: requestParams
          }
        )
        .then(res => {
          updateState({
            open: true,
            nanopubPublished: true,
            published_nanopub: res.data
          })
        })
        .catch(error => {
          updateState({
            nanopubPublished: false,
            errorMessage: 'Error publishing the Nanopublication: ' + error
          })
          console.log(error)
        })
        .finally(() => {
          setTimeout(function() {
            hljs.highlightAll();
          }, 200);
        })
    } else {
      console.log('You need to be logged in with ORCID to publish a Nanopublication')
    }
  }

  const handleShaclValidate  = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({shaclValidate: event.target.checked})
  };

  const generateNanopub  = (event: React.FormEvent, publish: boolean = false) => {
    event.preventDefault();
    updateState({ errorMessage: "", published_nanopub: "" })
    const stmtJsonld: any = generateRDF()
    if (!user.error) {
      // console.log('Publishing!', publish, stmtJsonld)
      const requestParams: any = {
        publish: publish
      }
      requestParams['shacl_validation'] = state.shaclValidate
      if (inputSource) {
        requestParams['source'] = inputSource
      }
      const access_token = user['access_token']
      axios.post(
          `${settings.apiUrl}/assertion`,
          stmtJsonld,
          {
            headers: { Authorization: `Bearer ${access_token}` },
            params: requestParams
          }
        )
        .then(res => {
          updateState({
            open: true,
            nanopubGenerated: true,
            nanopubPublished: false,
            published_nanopub: res.data
          })
        })
        .catch(error => {
          updateState({
            errorMessage: `Error generating the Nanopublication:\n${error.response.data.detail}`,
            nanopubGenerated: false,
            nanopubPublished: false,
          })
          console.log(error.response.data.detail)
        })
        .finally(() => {
          setTimeout(function() {
            hljs.highlightAll();
          }, 200);
        })
    } else {
      console.log('You need to be logged in with ORCID to publish a Nanopublication')
    }
  }


  const handleUploadKeys  = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    // @ts-ignore
    formData.append("publicKey", event.currentTarget.elements.publicKey.files[0]);
    // @ts-ignore
    formData.append("privateKey", event.currentTarget.elements.privateKey.files[0]);
    axios.post(
        settings.apiUrl + '/upload-keys',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user["access_token"]}`,
            "Content-Type": "multipart/form-data",
            "type": "formData"
          }
        }
      )
      .then(res => {
        updateState({
          open: true,
        })
      })
      .catch(error => {
        updateState({
          open: false,
          errorMessage: 'Error while uploading keys, please retry. And feel free to create an issue on our GitHub repository if the issue persists.'
        })
        console.log('Error while uploading keys', error)
      })
      .finally(() => {
        window.location.reload();
      })
  }

  const handleGenerateKeys  = (event: any) => {
    event.preventDefault();

    const access_token = user['access_token']
    axios.get(
        settings.apiUrl + '/generate-keys',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      )
      .then(res => {
        updateState({
          open: true,
        })
      })
      .catch(error => {
        updateState({
          open: false,
          errorMessage: 'Error while uploading keys, please retry. And feel free to create an issue on our GitHub repository if the issue persists.'
        })
        console.log('Error while uploading keys', error)
      })
      .finally(() => {
        window.location.reload();
      })
  }


  return (
    <>
      <form>
        <FormSettings>
          {/* Button to download the JSON-LD */}
          <div style={{width: '100%', textAlign: 'center'}}>
            <Button
              onClick={handleDownloadRDF}
              variant="contained"
              color='success'
              startIcon={<Icon name="download" />}
              style={{marginRight: '16px'}}
              disabled={entitiesList.length < 1}
            >
                Download RDF
            </Button>
            <Button
              onClick={(event) => generateNanopub(event, false)}
              variant="contained"
              className="button"
              startIcon={<Icon name="fact_check" />}
              disabled={!user.id}
              style={{marginRight: '16px'}}
              color="info" >
                Generate Nanopublication
            </Button>
            <FormControlLabel
              control={
                <Checkbox checked={state.shaclValidate} onChange={handleShaclValidate} id='shacl-validate' />
              }
              label="Validate with BioLink SHACL shapes"
            />
            { state.nanopubGenerated &&
              <Button
                onClick={publishSignedNanopub}
                variant="contained"
                className="button"
                startIcon={<Icon name="backup" />}
                disabled={!state.nanopubGenerated}
                color="warning" >
                  Publish Nanopublication
              </Button>
            }
            { !user.id &&
              <Typography style={{marginTop: '16px'}}>
                🔒️ You need to login with your ORCID to generate Nanopublications
              </Typography>
            }
          </div>
        </FormSettings>
      </form>

      { state.nanopubPublished &&
        <Paper elevation={4} style={{backgroundColor: '#81c784', padding: '16px', marginBottom:'24px', marginTop:'24px'}}>
          ✅&nbsp;&nbsp;Nanopublication successfully published
        </Paper>
      }

      { state.errorMessage &&
        <Paper elevation={4}
          style={{backgroundColor: "#e57373", padding: '8px', marginTop: '24px', marginBottom: '24px'}}
          // @ts-ignore
          sx={{ display: state.errorMessage.length > 0 }}
        >
          <pre style={{whiteSpace: "pre-wrap"}}>
            ⚠️&nbsp;&nbsp;{state.errorMessage}
          </pre>
        </Paper>
      }

      { user.id &&
        <Card className="paperMargin" style={{textAlign: 'center'}}>
          { user.keyfiles_loaded &&
            <Typography>
              ✅ Your keys have been loaded successfully, you can start publishing Nanopublications
            </Typography>
          }

          { !user.keyfiles_loaded &&
            <>
              <Typography style={{marginBottom: '8px'}}>
                🔑 Before publishing nanopubs, you need to first generate a private/public key pair,
                and then publish an introduction nanopub to link this key pair to your ORCID.<br/>
                We can automate this process for you, upon clicking the button above we will
                generate a key pair, and publish a nanopublication to link it to your ORCID:
              </Typography>
              {/* <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px'}}> */}
              <div style={{width: '100%', textAlign: 'center', marginBottom: '32px'}}>
                <Button
                  onClick={handleGenerateKeys}
                  id={"addProp:"}
                  variant="contained"
                  className="button"
                  startIcon={<Icon name="vpn_key" />}
                  style={{textTransform: 'none'}}
                  color="secondary" >
                    Generate the keys, and link them to my ORCID on the Nanopublication network
                </Button>
              </div>
              <Typography>
                📤️ Or, if you already have registered a key pair with your ORCID
                in the nanopublication network, you can upload these keys directly:
              </Typography>
              <form encType="multipart/form-data" action="" onSubmit={handleUploadKeys}
                  style={{display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%'}}>
                <Typography style={{marginTop: '8px'}}>
                  Select the <b>Public</b> key:&nbsp;&nbsp;
                  <input type="file" id="publicKey" />
                </Typography>
                <Typography style={{marginTop: '8px'}}>
                  Select the <b>Private</b> key:&nbsp;&nbsp;
                  <input type="file" id="privateKey" />
                </Typography>

                <Button type="submit"
                  variant="contained"
                  className="button"
                  startIcon={<Icon name="file_upload" />}
                  style={{textTransform: 'none', marginTop: '8px'}}
                  color="secondary" >
                    Upload your keys
                </Button>
              </form>
            </>
          }
        </Card>
      }

      {state.published_nanopub &&
        <pre style={{whiteSpace: 'pre-wrap'}}>
          <code className="language-turtle">
            {state.published_nanopub}
          </code>
        </pre>
      }
    </>
  );
}
export default PublishNanopubButtons;