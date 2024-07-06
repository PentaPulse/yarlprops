import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Routings from './components/Routings';
import Maintain from './components/Maintain';
import CssBaseline from '@mui/material/CssBaseline';
import AlertProvider from './backend/SnackbarContext';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000'
    },
    background: {
      default: '#E3E1D9',
    },
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF'
    },
    background: {
      default: '#222255',
    },
  },
});

function App() {
  const web_status = true;
  if (web_status) {
    return (
      <div>
        <Themed />
      </div>
    );
  } else {
    return (<Maintain />);
  }
}

function Themed() {
  const [mode, setMode] = React.useState(() => {
    const storedTheme = sessionStorage.getItem('isLight');
    return storedTheme === null ? true : storedTheme === 'true';
  });

  const [dash, setDash] = React.useState(true)
  

  const handleTheme = () => {
    setMode((prevMode) => {
      const newMode = !prevMode;
      sessionStorage.setItem('isLight', newMode);
      return newMode;
    });
  };

  React.useEffect(() => {
    const storedTheme = sessionStorage.getItem('isLight');
    if (storedTheme !== null) {
      setMode(storedTheme === 'true');
    }
  }, []);

  return (
    <ThemeProvider theme={mode ? lightTheme : darkTheme}>
      <AlertProvider>
      <CssBaseline />
      <Router>
        <Routings handleMode={handleTheme} handleDashboardState={()=>setDash(sessionStorage.getItem('dash'))} dash={dash}/>
      </Router>

      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
