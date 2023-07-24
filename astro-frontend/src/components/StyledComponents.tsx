import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, FormControl} from '@mui/material';

// Styled components
export const Paragraph = styled(Typography)(({theme}) => ({
  ...theme.typography.body1,
  marginBottom: '8px',
  textAlign: 'justify'
})) as typeof Typography;

export const Title = styled(Typography)(({theme}) => ({
  ...theme.typography.h5,
  marginTop: '40px',
  marginBottom: '16px',
  textAlign: 'center',
  fontWeight: '300'
})) as typeof Typography;

export const FormSettings = styled(FormControl)(({theme}) => ({
  ...theme.components?.MuiFormControl,
  width: '100%',
  // textAlign: 'center',
  '& .MuiFormControl-root': {
    marginTop: '8px',
    marginBottom: '8px'
  },
  '& .MuiFormHelperText-root': {
    marginTop: '0px',
    marginBottom: '8px'
  }
})) as typeof FormControl;

// export const LinkOut = ({children, ...props}={}) => {
//
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
//   marginTop: '40px',
//   marginBottom: '16px',
//   textAlign: 'center',
//   fontWeight: '300',
// })) as typeof Typography;
