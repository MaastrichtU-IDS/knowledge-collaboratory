import React from "react";
import { AppBar, Toolbar, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import ShapePublisherIcon from '@mui/icons-material/DynamicForm';
import AnnotateIcon from '@mui/icons-material/LocalOffer';

export default function NavBar() {


  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <a href="/" style={{alignItems: 'center', display: 'flex'}}>
            KC
        </a>
        <a href="/" className="linkButton">
            <Button style={{color: '#fff', textTransform: 'none', marginLeft: '16px'}}>
              <SearchIcon />&nbsp;Browse page
            </Button>
        </a>
        <div className="flexGrow"></div>
        <a href="/about" className="linkButton">
            <Button style={{color: '#fff'}}>
              <InfoIcon />
            </Button>
        </a>
        <Button style={{color: '#fff'}} target="_blank" href="https://github.com/MaastrichtU-IDS/knowledge-collaboratory">
          GH
        </Button>

      </Toolbar>
    </AppBar>
  );
}