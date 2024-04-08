import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Routings from './components/Routings';
import Maintain from './components/Maintain';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary:{
      main:'#000000'
    },
    background: {
      default: '#FFFFFF', // blue to black gradient
    },
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:{
      main:'#FFFFFF'
    },
    background: {
      default: 'linear-gradient(to bottom, #0000FF, #FFFFFF)', // blue to white gradient
    },
  }
})

function App() {
  const web_status = true;
  if (web_status) {
    return (
      <div>
        <Themed />
      </div>
    );
  }
  else {
    return (<Maintain />)
  }
}

function Themed() {
  const [mode, setMode] = React.useState(false)
  const handleTheme = () => {
    setMode(!mode)
  }
  return (
    <ThemeProvider theme={mode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Routings handleMode={handleTheme} />
    </ThemeProvider>
  )
}

export default App;

// import React, { useState, useEffect } from 'react';
// import Routings from './components/Routings';
// import { ThemeProvider } from 'styled-components';

// Define your theme
// const lightTheme = {
//   body: '#FFF',
//   text: '#363537',
// };

// const darkTheme = {
//   body: '#363537',
//   text: '#FAFAFA',
// };

// const ToggleButton = ({ theme, toggleTheme }) => {
//   return (
//     <button onClick={toggleTheme}>
//       {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
//     </button>
//   );
// };

// const App = () => {
//   const [theme, setTheme] = useState('light');

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme); // Store user preference
//   };

//   useEffect(() => {
//     const storedTheme = localStorage.getItem('theme');
//     if (storedTheme) {
//       setTheme(storedTheme);
//     }
//   }, []);

//   return (
//     <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
//       <div className="App">
//         <div style={{ marginTop: '60px'}}>
//           <ToggleButton theme={theme} toggleTheme={toggleTheme} />
//         </div>
//         <Routings/>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default App;
