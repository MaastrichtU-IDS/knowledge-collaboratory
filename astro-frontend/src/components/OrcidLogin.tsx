import React, {useContext} from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Image } from '@astrojs/image/components';
import {AppBar, Toolbar, Button, Tooltip, Icon as MuiIcon, IconButton, Box, ButtonBase} from '@mui/material';
import {Popper, ClickAwayListener, Typography, Paper, Checkbox, FormControlLabel, FormHelperText} from '@mui/material';
import {useStore} from '@nanostores/react';
import {userProfile} from '../utils/nanostores';

import axios from 'axios';

import {settings} from '../utils/settings';
// import { useAuth } from 'oidc-react';
// @ts-ignore
import OAuth2Login from 'react-simple-oauth2-login';
import Icon from './Icon';

const OrcidLogin = ({np, npDict, index, usersPubkeys, ...args}: any) => {
  // const auth = useAuth();

  const $userProfile = useStore(userProfile);

  const [state, setState] = React.useState({
    currentUsername: null,
    accessToken: null,
    loggedIn: false
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

  // Settings for Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl]: any = React.useState(null);
  const showUserInfo = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    // setAnchorEl(anchorEl ? null : document.body);
    setOpen(prev => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(anchorEl ? null : anchorEl);
  };
  const id = open ? 'simple-popper' : undefined;

  const onSuccess = (response: any) => {
    getCurrentUser(response);
  };
  const onFailure = (response: any) => console.error(response);

  const logout = () => {
    localStorage.clear();
    userProfile.set({});
    handleClickAway();
  };

  const getCurrentUser = (configState: any) => {
    console.log('CURRENT USER ACCESS TOKEN', configState);
    axios
      .get(settings.apiUrl + '/current-user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + configState['access_token']
        }
      })
      .then((res: any) => {
        let current_user = res.data;
        // console.log('Current user:', current_user)
        current_user['access_token'] = configState['access_token'];
        if (!current_user.error) {
          current_user['access_token'] = configState['access_token'];
          if (current_user['given_name'] || current_user['family_name']) {
            current_user['username'] = current_user['given_name'] + ' ' + current_user['family_name'];
          } else if (current_user['name']) {
            current_user['username'] = current_user['name'];
          } else {
            current_user['username'] = current_user['sub'];
          }
          userProfile.set(current_user);
          localStorage.setItem('knowledgeCollaboratorySettings', JSON.stringify(current_user));
        } else {
          // The token stored might not be valid anymore, deleting it to avoid spamming the API
          localStorage.removeItem('knowledgeCollaboratorySettings');
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
      });
  };

  React.useEffect(() => {
    const localStorageConfig: any = localStorage.getItem('knowledgeCollaboratorySettings');
    let configState: any = JSON.parse(localStorageConfig);
    if (configState && configState['access_token']) {
      getCurrentUser(configState);
    }
    // }, [user])
  }, []);

  return (
    <>
      {!$userProfile ||
        (!$userProfile.username && (
          <OAuth2Login
            authorizationUrl="https://orcid.org/oauth/authorize"
            // authorizationUrl="https://orcid.org/.well-known/openid-configuration"
            responseType="token"
            clientId={settings.orcidClientId}
            redirectUri={settings.frontendUrl}
            scope="/authenticate"
            onSuccess={onSuccess}
            onFailure={onFailure}
            className="loginButton"
            // expiresIn={604800} // 7 days
          >
            <Button
              variant="contained"
              color="success"
              component="span"
              size="small"
              style={{textTransform: 'none', fontSize: '12px'}}
            >
              Login with ORCID
              <img
                src={`${settings.basePath}/orcid_logo.svg`}
                alt="ORCID"
                width={20}
                height={20}
                style={{marginLeft: '8px'}}
              />
            </Button>
          </OAuth2Login>
        ))}

      {$userProfile && $userProfile.username && (
        <Button variant="contained" onClick={showUserInfo} color="success" size="small" style={{textTransform: 'none'}}>
          🐧 {$userProfile.username}
        </Button>
      )}

      {$userProfile && $userProfile.username && (
        <Popper open={open} anchorEl={anchorEl}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper elevation={4} style={{padding: '16px 16px', textAlign: 'left'}}>
              <Typography style={{marginBottom: '8px'}}>
                Logged in with ORCID:{' '}
                {
                  <a href={$userProfile.id} target="_blank" rel="noopener noreferrer">
                    {$userProfile.id}
                  </a>
                }
              </Typography>
              <Typography style={{marginBottom: '8px'}}>Username: {$userProfile.username}</Typography>
              <Button
                onClick={logout}
                variant="contained"
                color="inherit"
                size="small"
                startIcon={<Icon name="logout" />}
              >
                Logout
              </Button>
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
};

export default OrcidLogin;
