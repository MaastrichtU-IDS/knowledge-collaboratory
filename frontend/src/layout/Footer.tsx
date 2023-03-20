import React from 'react';
import {useTheme} from '@mui/material/styles';
import {Container, Typography} from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a style={{textDecoration: 'none', color: 'inherit'}} target="_blank" href="https://maastrichtuniversity.nl/ids">
        Institute of Data Science at Maastricht University
      </a>{' '}
      {'2020.'}
    </Typography>
  );
}

export default function Footer() {
  const theme = useTheme();

  return (
    <footer
      style={{
        padding: theme.spacing(2),
        marginTop: 'auto',
        color: 'white',
        backgroundColor: theme.palette.primary.main
      }}
    >
      <Container maxWidth="md" style={{textAlign: 'center'}}>
        <Typography variant="body2">
          This website is licensed under the&nbsp;
          <a
            target="_blank"
            style={{textDecoration: 'none', color: 'inherit'}}
            href="https://github.com/MaastrichtU-IDS/knowledge-collaboratory/blob/main/LICENSE"
          >
            MIT license
          </a>
        </Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
