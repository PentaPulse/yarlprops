import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Routings from './components/Routings';
import Maintain from './components/Maintain';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000'
    },
    background: {
      default: '#91a6ff', 
    },
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF'
    },
    background: {
      default: 'linear-gradient(to bottom, #0000FF, #FFFFFF)', 
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
    const newTheme = mode ? 'dark' : 'light';
    localStorage.setItem('isLight', newTheme);
  };
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('isLight');
    if (storedTheme) {
      setMode(storedTheme);
    }
  }, []);
  return (
    <ThemeProvider theme={mode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Routings handleMode={handleTheme} />
    </ThemeProvider>
  )
}

export default App;