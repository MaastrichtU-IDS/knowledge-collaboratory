import React, {useReducer} from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {View} from 'react-native'

import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

// Change theme color and typography here
const theme = createTheme({
  palette: {
    primary: {light: '#6ec6ff', main: '#2196f3', dark: '#0069c0'}, // blue
    secondary: {light: '#76d275', main: '#43a047', dark: '#00701a'} // green
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
    // success: { light: '#ffe0b2', main: '#a5d6a7', dark: '#00600f' }, // green
    // info: { light: '#b3e5fc', main: '#81d4fa', dark: '#00600f' }, // blue
    // warning: { light: '#c8e6c9', main: '#ffcc80', dark: '#00600f' }, // orange
    // error: { light: '#ffcdd2', main: '#ef9a9a', dark: '#e57373' }, // red
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Arial"',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontSize: 11
  }
  // spacing: 2
})

// context for User
function reducer(state: any, item: any) {
  return item
}

export default function Layout({children}: {children: React.ReactNode}) {
  const [user, setUser]: any = useReducer(reducer, [])

  return (
    <ThemeProvider theme={theme}>
      {/* <div className="mainView"> */}
      <View style={{minHeight: '100vh', height: '100%', backgroundColor: '#eceff1'}}>
        <Navbar />
        {children}
        <Footer />
      </View>
      {/* </div> */}
    </ThemeProvider>
  )
}
