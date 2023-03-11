import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Footer() {

  return (
      <footer style={{padding: '16px',
          marginTop: 'auto',
          color: 'white',
          // backgroundColor: theme.palette.primary.main
      }}>
        <Container maxWidth="md" style={{textAlign: 'center'}}>
          <Typography variant="body2" >
            This website is licensed under the MIT license
          </Typography>
        </Container>
      </footer>
  );
}