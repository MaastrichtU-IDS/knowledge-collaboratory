"use client";

import React, { useContext } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Tooltip, Icon, IconButton, Box, ButtonBase } from '@mui/material';
import { Popper, ClickAwayListener, Typography, Paper, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
// import GraphqlIcon from '@mui/icons-material/Code';
// import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
// import AssessmentsIcon from '@mui/icons-material/CollectionsBookmark';
import ShapePublisherIcon from '@mui/icons-material/DynamicForm';
import AnnotateIcon from '@mui/icons-material/LocalOffer';
import axios from 'axios';

import { settings } from '../utils/settings';
// import { useAuth } from 'oidc-react';
// @ts-ignore
import OAuth2Login from 'react-simple-oauth2-login';
import UserContext from '../utils/UserContext'
import OrcidLogin from '../components/OrcidLogin';


export default function Navbar() {
  const theme = useTheme();

  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <Link href="/" style={{alignItems: 'center', display: 'flex'}}>
          <Tooltip title='☑️ Knowledge Collaboratory'>
            {/* <img src="/icon.png" style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" /> */}
            <Image
              src="icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          </Tooltip>
        </Link>
        <Link href="/" className="linkButton">
          <Tooltip title='Browse Nanopublications'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <SearchIcon />&nbsp;Browse Nanopublications
            </Button>
          </Tooltip>
        </Link>
        <Link href="/annotate" className="linkButton">
          <Tooltip title='Annotate biomedical text, and publish the assertion as Nanopublication'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <AnnotateIcon />&nbsp;Annotate biomedical text
            </Button>
          </Tooltip>
        </Link>
        <Link href="/shape-publisher" className="linkButton">
          <Tooltip title='Define and publish RDF nanopublications from SHACL shapes'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <ShapePublisherIcon />&nbsp;Shape publisher
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>

        <OrcidLogin />

        <Tooltip title='Access the OpenAPI documentation of the API used by this service'>
          <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(1)}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            <Icon style={{display: 'flex', marginRight: theme.spacing(1), padding: theme.spacing(0)}}>
              {/* <img src={ApiIcon}/> */}
              <Image
                src="/openapi_logo.svg"
                alt="OpenAPI"
                width={18}
                height={18}
                // fill
              />
            </Icon> API
          </Button>
        </Tooltip>
        <Link href="/about" className="linkButton">
          <Tooltip title='About'>
            <Button style={{color: '#fff'}}>
              <InfoIcon />
            </Button>
          </Tooltip>
        </Link>
        <Tooltip title='Source code'>
          <Button style={{color: '#fff'}} target="_blank" href="https://github.com/MaastrichtU-IDS/knowledge-collaboratory">
            <GitHubIcon />
          </Button>
        </Tooltip>

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
{/*
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
              expiresIn={604800} // 7 days
              onSuccess={onSuccess}
              onFailure={onFailure}>
                <Button variant='contained' color='secondary' component="span" size='small' style={{textTransform: 'none'}}>
                  Login with ORCID
                  <Image src="/orcid_logo.svg" alt="ORCID" width={20} height={20} style={{marginLeft: theme.spacing(1)}} />
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
                  <Button onClick={logout} variant='contained' size='small' startIcon={<LogoutIcon />}>
                    Logout
                  </Button>
                </Paper>
              </ClickAwayListener>
            </Popper>
          } */}

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