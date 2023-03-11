"use client";

import React, { useContext } from "react";
// import Link from 'next/link';
// import Image from 'next/image';
// import { Image } from '@astrojs/image/components';
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Tooltip, Icon as MuiIcon, IconButton, Box, ButtonBase } from '@mui/material';
import { Popper, ClickAwayListener, Typography, Paper, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";

import axios from 'axios';

import { settings } from '../utils/settings';
// import { useAuth } from 'oidc-react';
// @ts-ignore
import OAuth2Login from 'react-simple-oauth2-login';
import UserContext from '../utils/UserContext'
import Icon from '../components/Icon';


export default function NavBar() {
  const theme = useTheme();
  // const auth = useAuth();

  const { user, setUser }: any = useContext(UserContext)

  const [state, setState] = React.useState({
    currentUsername: null,
    accessToken: null,
    loggedIn: false
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // Settings for Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl]: any = React.useState(null);
  const showUserInfo = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    // setAnchorEl(anchorEl ? null : document.body);
    setOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(anchorEl ? null : anchorEl);
  };
  const id = open ? 'simple-popper' : undefined;


  const onSuccess = (response: any) => {
    getCurrentUser(response)
  };
  const onFailure = (response: any) => console.error(response);

  const logout = () => {
    localStorage.clear();
    setUser({})
    handleClickAway()
    // updateState({open: false})
    // window.location.reload();
  }

  const getCurrentUser = (configState: any) => {
    axios.get(settings.apiUrl + '/current-user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + configState['access_token']
      },
    })
      .then((res: any) => {
        let current_user = res.data
        // console.log('Current user:', current_user)
        current_user['access_token'] = configState['access_token']
        // setUser(current_user)
        if (!current_user.error) {
          current_user['access_token'] = configState['access_token']
          if (current_user['given_name'] || current_user['family_name']) {
            current_user['username'] = current_user['given_name'] + ' ' + current_user['family_name']
          } else if (current_user['name']) {
            current_user['username'] = current_user['name']
          } else {
            current_user['username'] = current_user['sub']
          }
          setUser(current_user)
          localStorage.setItem("knowledgeCollaboratorySettings", JSON.stringify(current_user));
        }
        // https://stackoverflow.com/questions/25686484/what-is-intent-of-id-token-expiry-time-in-openid-connect
        // If the token is expired, it should make another auth request, except this time with prompt=none in the URL parameter
        // Getting an error with prompt if not login

        // localStorage.setItem("knowledgeCollaboratorySettings", JSON.stringify(user));
        // window.location.reload();
      })
      .catch((error: any) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })
      // Also possible and lighter on the Auth API: just check the cookie
      // const username = configState['given_name'] + ' ' + configState['family_name']
      // updateState({ currentUsername: username, accessToken: configState['access_token'], loggedIn: true})
      // console.log('access_token before setUser')
      // console.log(configState)
      // setUser({
      //   username: username,
      //   access_token: configState['access_token'],
      //   id: configState['id'],
      // })
  }

  React.useEffect(() => {
    const localStorageConfig: any = localStorage.getItem("knowledgeCollaboratorySettings");
    // console.log(localStorageConfig)
    let configState: any = JSON.parse(localStorageConfig);
    if (configState && configState['access_token']) {
      getCurrentUser(configState)
    }
  // }, [user])
  }, [])


  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <a href="/" style={{alignItems: 'center', display: 'flex'}}>
          {/* <Tooltip title='☑️ Knowledge Collaboratory'> */}
            {/* <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" /> */}
            {/* <Image
              src="/icon.png"
              alt="Logo"
              width={32}
              height={32}
            /> */}
            KC
          {/* </Tooltip> */}
        </a>
        <a href="/" className="linkButton">
          {/* <Tooltip title='Browse Nanopublications'> */}
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="search" />&nbsp;Browse Nanopublications
            </Button>
          {/* </Tooltip> */}
        </a>
        <a href="/annotate" className="linkButton">
          {/* <Tooltip title='Annotate biomedical text, and publish the assertion as Nanopublication'> */}
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="local_offer" />&nbsp;Annotate biomedical text
            </Button>
          {/* </Tooltip> */}
        </a>
        <a href="/shape-publisher" className="linkButton">
          {/* <Tooltip title='Define and publish RDF nanopublications from SHACL shapes'> */}
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="dynamic_form" />&nbsp;Shape publisher
            </Button>
          {/* </Tooltip> */}
        </a>
        <div className="flexGrow"></div>

        {/* <Tooltip title='Access the OpenAPI documentation of the API used by this service'> */}
          <Button style={{color: '#fff', textTransform: 'none'}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            <MuiIcon style={{display: 'flex', marginRight: theme.spacing(1), padding: theme.spacing(0)}}>
              <img
                src="/openapi_logo.svg"
                alt="OpenAPI"
                width={18}
                height={18}
                // fill
              />
            </MuiIcon> API
          </Button>
        {/* </Tooltip> */}
        <a href="/about" className="linkButton">
          {/* <Tooltip title='About'> */}
            <Button style={{color: '#fff'}}>
            <Icon id="info" />
            </Button>
          {/* </Tooltip> */}
        </a>
        {/* <Tooltip title='Source code'> */}
          <Button style={{color: '#fff'}} target="_blank" href="https://github.com/MaastrichtU-IDS/knowledge-collaboratory">
            <MuiIcon style={{display: 'flex', marginRight: theme.spacing(1), padding: theme.spacing(0)}}>
              <img
                  src="/github.svg"
                  alt="GitHub"
                  width={18}
                  height={18}
                  // fill
                />
            </MuiIcon>
          </Button>
        {/* </Tooltip> */}

        {/* <UserContext.Consumer>
          {({ user }) => (
            { user.username &&
              <Button variant='contained' onClick={showUserInfo} color='secondary' size='small'
                  style={{textTransform: 'none'}}>
                🐧 {user.username}
              </Button>
            }
          )}
          </UserContext.Consumer> */}

          { user && user.username &&
              <Button variant='contained' onClick={showUserInfo} color='secondary' size='small'
                  style={{textTransform: 'none'}}>
                🐧 {user.username}
              </Button>
          }

          { !user || !user.username &&
            <OAuth2Login
              className="loginButton"
              authorizationUrl="https://orcid.org/oauth/authorize"
              // authorizationUrl="https://orcid.org/.well-known/openid-configuration"
              responseType="token"
              clientId={settings.orcidClientId}
              redirectUri={settings.frontendUrl}
              scope="/authenticate"
              onSuccess={onSuccess}
              onFailure={onFailure}>
                <Button variant='contained' color='secondary' component="span" size='small' style={{textTransform: 'none'}}>
                  Login with ORCID
                  {/* <Image src="/orcid_logo.svg" alt="ORCID" width={20} height={20} style={{marginLeft: theme.spacing(1)}} /> */}
                </Button>
            </OAuth2Login>
          }
          { user && user.username &&
            <Popper open={open} anchorEl={anchorEl}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Paper elevation={4} style={{padding: theme.spacing(2, 2), textAlign: 'left'}}>
                  <Typography style={{marginBottom: theme.spacing(1)}}>
                    Logged in with ORCID: {<a href={user.id}  target="_blank" rel="noopener noreferrer">{user.id}</a>}
                  </Typography>
                  <Typography style={{marginBottom: theme.spacing(1)}}>
                    Username: {user.username}
                  </Typography>
                  <Button onClick={logout} variant='contained' size='small' startIcon={<Icon id="logout" />}>
                    Logout
                  </Button>
                </Paper>
              </ClickAwayListener>
            </Popper>
          }

          {/* </Button> */}
          {/* </Tooltip> */}

        {/* <Tooltip title='Login with ORCID'>
          <Button href="http://localhost:8000/rest/login" style={{color: '#fff'}} >
            <LoginIcon />
          </Button>
        </Tooltip> */}
        {/* <Tooltip title='Login with ORCID'>
          <Button onClick={() => {auth.signIn()}} style={{color: '#fff'}} >
            <LoginIcon />
          </Button>
        </Tooltip> */}

      </Toolbar>
    </AppBar>
  );
}