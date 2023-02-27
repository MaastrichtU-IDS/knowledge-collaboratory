"use client";

import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, FormControl } from "@mui/material";


// Styled components
export const Paragraph = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  marginBottom: theme.spacing(1),
  textAlign: 'justify',
}))as typeof Typography;


export const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  fontWeight: '300',
})) as typeof Typography;


export const FormSettings = styled(FormControl)(({ theme }) => ({
  ...theme.components?.MuiFormControl,
  width: '100%',
  // textAlign: 'center',
  '& .MuiFormControl-root': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  '& .MuiFormHelperText-root': {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
  },
})) as typeof FormControl;


// export const LinkOut = ({children, ...props}={}) => {
//   const theme = useTheme();

//   return (
//     <a
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         color: theme.palette.primary.dark,
//         textDecoration: 'none',
//         // color: 'inherit',
//         '&:hover': {
//           color: theme.palette.primary.main,
//           textDecoration: 'none',
//         }
//       }}
//       {...props}
//     >{children}</a>
//   )
// }
// export const LinkOut = styled(a)(({ theme }) => ({
//   ...theme.typography.h5,
//   marginTop: theme.spacing(5),
//   marginBottom: theme.spacing(2),
//   textAlign: 'center',
//   fontWeight: '300',
// })) as typeof Typography;
