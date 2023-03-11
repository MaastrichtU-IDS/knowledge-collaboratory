import React, { useContext } from "react";
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Tooltip } from '@mui/material';
// import { Image } from '@astrojs/image/components';

import { settings } from '../utils/settings';
import Icon from '../components/Icon';
import OrcidLogin from '../components/OrcidLogin';


export default function NavBar() {
  const theme = useTheme();

  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <a href={`${settings.base}/`} style={{alignItems: 'center', display: 'flex'}}>
          <Tooltip title='☑️ Knowledge Collaboratory'>
            <img
              src="/icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          </Tooltip>
        </a>
        <a href={`${settings.base}/`} className="linkButton">
          <Tooltip title='Browse Nanopublications'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="search" />&nbsp;Browse Nanopublications
            </Button>
          </Tooltip>
        </a>
        <a href="annotate" className="linkButton">
          <Tooltip title='Annotate biomedical text, and publish the assertion as Nanopublication'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="local_offer" />&nbsp;Annotate biomedical text
            </Button>
          </Tooltip>
        </a>
        {/* <a href="/shape-publisher" className="linkButton">
          <Tooltip title='Define and publish RDF nanopublications from SHACL shapes'>
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
              <Icon id="dynamic_form" />&nbsp;Shape publisher
            </Button>
          </Tooltip>
        </a> */}

        <div className="flexGrow"></div>

        <Tooltip title='Access the OpenAPI documentation of the API used by this service'>
          <Button style={{color: '#fff', textTransform: 'none'}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            <img
              src={`${settings.base}/openapi_logo.svg`}
              alt="OpenAPI"
              width={18}
              height={18}
              // fill
            />
          </Button>
        </Tooltip>
        <a href="/about" className="linkButton">
          <Tooltip title='About'>
            <Button style={{color: '#fff'}}>
              <Icon id="info" />
            </Button>
          </Tooltip>
        </a>

        <Tooltip title='Source code'>
          <Button style={{color: '#fff'}} target="_blank" href="https://github.com/MaastrichtU-IDS/knowledge-collaboratory">
            <img
              className="whiteSvgIcon"
              src={`${settings.base}/github.svg`}
              alt="GitHub"
              width={20}
              height={20}
              // fill
            />
          </Button>
        </Tooltip>

        <OrcidLogin />

      </Toolbar>
    </AppBar>
  );
}