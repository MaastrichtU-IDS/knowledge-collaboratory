import React, { useContext } from "react";
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Tooltip, IconButton, Box, ButtonBase } from '@mui/material';
import { Popper, ClickAwayListener, Typography, Paper, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import ApiIcon from '@mui/icons-material/Http';
import GraphqlIcon from '@mui/icons-material/Code';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentsIcon from '@mui/icons-material/CollectionsBookmark';
import PublishIcon from '@mui/icons-material/Outbox';
import axios from 'axios';

// @ts-ignore
import iconImage from '../../assets/icon.png';

import { getUrlHtml, settings } from '../settings';
import { useAuth } from 'oidc-react';
import OAuth2Login from 'react-simple-oauth2-login';
import UserContext from '../UserContext'

// const theme = useTheme();

// const useStyles = makeStyles(() => ({
//   menuButton: {
//     // color: theme.palette.common.white
//     color: '#fff'
//   },
//   linkButton: {
//     textTransform: 'none',
//     textDecoration: 'none',
//     color: '#fff'
//   },
//   linkLogo: {
//     // Seems to fit the 48px navbar height...
//     // height: '48px',
//     alignItems: 'center',
//     display: 'flex',
//   },
// }))
  
export default function NavBar() {
  const theme = useTheme();
  // const auth = useAuth();

  const useStyles = makeStyles(() => ({
    menuButton: {
      color: theme.palette.common.white
      // color: '#fff'
    },
    linkButton: {
      textTransform: 'none',
      textDecoration: 'none',
      color: '#fff'
    },
    linkLogo: {
      // Seems to fit the 48px navbar height...
      // height: '48px',
      alignItems: 'center',
      display: 'flex',
    },
  }))
  const classes = useStyles();

  const { user, setUser }: any = useContext(UserContext)

  const [state, setState] = React.useState({
    currentUsername: null,
    accessToken: null,
    loggedIn: false
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
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
    // console.log(response)
    // const tokenRes: any = JSON.stringify(response)
    // console.log('tokenRes')
    // console.log(response['access_token'])
    // console.log(response)

    axios.get(settings.restUrl + '/current-user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response['access_token']
      },
    })
      .then((res: any) => {
        console.log('got current user')
        let user = res.data
        user['access_token'] = response['access_token']
        console.log(user)
        setUser(user)
        localStorage.setItem("fairEnoughSettings", JSON.stringify(user));
        // window.location.reload();
        // TODO: refactor to use Context without reload
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

    // localStorage.setItem("fairEnoughSettings", JSON.stringify(response));
    // window.location.reload();
  };
  const onFailure = (response: any) => console.error(response);

  const logout = () => {
    localStorage.clear();
    setUser({})
    // window.location.reload();
  }

  React.useEffect(() => {
    const localStorageConfig: any = localStorage.getItem("fairEnoughSettings");
    // console.log(localStorageConfig)
    let configState: any = JSON.parse(localStorageConfig);
    if (configState && configState['access_token']) {
      axios.get(settings.restUrl + '/current-user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + configState['access_token']
        },
      })
        .then((res: any) => {
          let user = res.data
          if (!user.error) {
            user['access_token'] = configState['access_token']
            if (user['given_name'] || user['family_name']) {
              user['username'] = configState['given_name'] + ' ' + configState['family_name']
            } else if (user['name']) {
              user['username'] = user['name']
            }
            setUser(user)
          }
          // https://stackoverflow.com/questions/25686484/what-is-intent-of-id-token-expiry-time-in-openid-connect
          // If the token is expired, it should make another auth request, except this time with prompt=none in the URL parameter
          // Getting an error with prompt if not login
          
          // localStorage.setItem("fairEnoughSettings", JSON.stringify(user));
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
    // const { setSalad } = useContext(SaladContext)
  // }, [user])
  }, [])

  // const localStorageConfig = localStorage.getItem("fairEnoughSettings");
  //     if (localStorageConfig) {
  //       let configState: any = JSON.parse(localStorageConfig);
  //       access_token = configState.access_token;
  //     }

  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <Link to="/" className={classes.linkLogo}>
          <Tooltip title='☑️ Knowledge Collaboratory'>
            <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" />
          </Tooltip>
        </Link>
        <Link to="/" className={classes.linkButton}>
          <Tooltip title='Browse Nanopublications'>
            <Button style={{color: '#fff'}}>
              <SearchIcon />&nbsp;Browse Nanopubs
            </Button>
          </Tooltip>
        </Link>
        <Link to="/publish" className={classes.linkButton}>
          <Tooltip title='Publish Nanopublications'>
            <Button style={{color: '#fff'}}>
              <PublishIcon />&nbsp;Publish Nanopubs
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>

        <Tooltip title='Access the OpenAPI documentation of the API used by this website'>
          <Button style={{color: '#fff'}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            <ApiIcon style={{ marginRight: theme.spacing(1)}} />
            API
          </Button>
        </Tooltip>
        <Tooltip title='Access the GraphQL API'>
          <Button style={{color: '#fff'}} target="_blank" rel="noopener noreferrer"
          href={settings.graphqlUrl}>
            {/* + '?query=query%20%7B%0A%20%20evaluations%20%7B%0A%20%20%20%20title%0A%20%20%20%20resourceUri%0A%20%20%20%20collection%0A%20%20%20%20score%20%7B%0A%20%20%20%20%20%20totalScore%0A%20%20%20%20%20%20totalScoreMax%0A%20%20%20%20%20%20percent%0A%20%20%20%20%20%20totalBonus%0A%20%20%20%20%20%20totalBonusMax%0A%20%20%20%20%20%20bonusPercent%0A%20%20%20%20%7D%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20fairType%0A%20%20%20%20%20%20metricId%0A%20%20%20%20%20%20score%0A%20%20%20%20%20%20maxScore%0A%20%20%20%20%20%20bonusScore%0A%20%20%20%20%20%20maxBonus%0A%20%20%20%20%20%20logs%0A%20%20%20%20%7D%0A%20%20%20%20data%0A%20%20%7D%0A%7D' */}
            <GraphqlIcon style={{ marginRight: theme.spacing(1)}} />
            GraphQL
          </Button>
        </Tooltip>
        <Link to="/about" className={classes.linkButton}>
          <Tooltip title='About'>
            <Button style={{color: '#fff'}}>
              <InfoIcon />
            </Button>
          </Tooltip>
        </Link>
        <Tooltip title='Source code'>
          <Button style={{color: '#fff'}} target="_blank"
          href="https://github.com/MaastrichtU-IDS/fair-enough">
            <GitHubIcon />
          </Button>
        </Tooltip>

        {/* <Tooltip title='Login with ORCID'> */}
        {/* <Button variant='contained' color='primary' size='small' component="span"> */}
        {/* {} */}
        { user.username && 
            <Button variant='contained' onClick={showUserInfo} color='secondary' size='small' 
                style={{textTransform: 'none'}}>
              🐧 {user.username}
            </Button>
        }
        { !user.username && 
          // <Button variant='contained' color='secondary' size='small' component="span" style={{textTransform: 'none'}}>
          //   🔓️  LOGIN with ORCID
          <OAuth2Login
            className="MuiButton‑root MuiButton‑contained"
            authorizationUrl="https://orcid.org/oauth/authorize"
            responseType="token"
            clientId={process.env.ORCID_CLIENT_ID}
            clientSecret={process.env.ORCID_CLIENT_SECRET}
            redirectUri={settings.OauthRedirectUri}
            // redirectUri=""
            style={{textTransform: 'none', textDecoration: 'none'}}
            onSuccess={onSuccess}
            // hidden
            onFailure={onFailure}>
              <Button variant='contained' color='secondary' size='small' component="span" style={{textTransform: 'none'}}>
                🔓️  LOGIN with ORCID
              </Button>
          </OAuth2Login>
          }
        <Popper open={open} anchorEl={anchorEl}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper elevation={4} style={{padding: theme.spacing(2, 2), textAlign: 'left'}}>
                <Typography style={{marginBottom: theme.spacing(1)}}>
                  Logged in with ORCID: {getUrlHtml(user.id)}
                </Typography>
                <Typography style={{marginBottom: theme.spacing(1)}}>
                  Username: {user.username}
                </Typography>
                <Button onClick={logout} variant='contained' size='small'>
                  Logout
                </Button>
              </Paper>
            </ClickAwayListener>
          </Popper>    
        {/* </Button> */}
        {/* </Tooltip> */}

        {/* <Tooltip title='Login with ORCID'>
          <Button href="http://localhost/rest/login" style={{color: '#fff'}} >
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