import React, { createContext, useReducer } from "react";
import { View } from "react-native";
import { HashRouter } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import { ThemeProvider } from '@mui/styles';
// import { createTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';

import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";
import AnnotateText from "./src/pages/AnnotateText";
import About from "./src/pages/About";
import BrowseNanopub from "./src/pages/BrowseNanopub";
import ShapePublisher from "./src/pages/ShapePublisher";
import UserContext from "./src/UserContext";
// import { AuthProvider, useAuth } from 'oidc-react';

import './src/App.css';


// Change theme color and typography here
const theme = createTheme({
  palette: {
    // primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' }, // blue
    primary: { light: '#6ec6ff', main: '#2196f3', dark: '#0069c0' }, // lighter blue
    // secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' }, // green
    secondary: { light: '#76d275', main: '#43a047', dark: '#00701a' }, // lighter green
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // secondary: { light: '#ffcc80', main: '#ffa726', dark: '#c88719' }, // Orange
    // secondary: { light: '#ff7043', main: '#ff5722', dark: '#087f23' }, // Orange
    // red: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
    // success: { light: '#ffe0b2', main: '#a5d6a7', dark: '#00600f' }, // green
    // info: { light: '#b3e5fc', main: '#81d4fa', dark: '#00600f' }, // blue
    // warning: { light: '#c8e6c9', main: '#ffcc80', dark: '#00600f' }, // orange
    // error: { light: '#ffcdd2', main: '#ef9a9a', dark: '#e57373' }, // red
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontSize": 11
  },
  // spacing: 2
  // overrides: {
  //   MuiTooltip: {
  //       tooltip: {
  //           fontSize: "1em",
  //       },
  //   },
  // },
});

// Fix React router:
// https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
// We use an express server
// app.use('/mysub-application1', express.static(path.resolve(__dirname, `../public`)))
// app.get('/mysub-application1/*', (req,res) => { //this is required to support any client side routing written in react.
//  res.sendFile(path.join(__dirname, '../../public', 'index.html'))
// })

// context for User
function reducer(state: any, item: any) {
  // return [...state, item]
  // return {...state, item}
  return item
}

const App = () => {

  // const [user, setUser]: any = useReducer(reducer, {});
  const [user, setUser]: any = useReducer(reducer, []);

  return (<ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user, setUser }}>
      {/* <AuthProvider {...oidcConfig}> */}
        <Router basename="/">
        {/* <HashRouter> */}
          <View style={{height: '100%', backgroundColor: '#eceff1'}}>
            <NavBar />

            <Route path="/about" component={About} />
            <Route path="/annotate" component={AnnotateText} />
            <Route path="/shape-publisher" component={ShapePublisher} />
            <Route exact path="/" component={BrowseNanopub} />
            <Footer />
          </View>
        {/* </HashRouter> */}
        </Router>
      </UserContext.Provider>
      {/* </AuthProvider> */}
    </ThemeProvider>
  )};
export default App;
