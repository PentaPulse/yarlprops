import * as React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Maintain from './Maintain';
import CssBaseline from '@mui/material/CssBaseline';
import AlertProvider from './backend/AlertService';
import { AuthProvider } from './backend/AuthContext';
import PrivateRoute from './backend/PrivateRoute';
import DashboardLayout from './dashboards/DashboardLayout';
import PageLayout from './pages/PageLayout';
import Home from './pages/Home/Home';
import Guide from './pages/Guide/Guide';
import Contact from './pages/Contact/Contact';
import Products from './pages/Products/Products';
import ProductPage from './pages/Products/ProView/View';
import Services from './pages/Services/Services';
import ViewService from './pages/Services/ViewService'

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
      default: '#000435',
    },
  },
});

function App() {
  const [status,setStatus]=React.useState(false)
  if (!status) {
    return (
      <div>
        <Themed setMaintain={setStatus}/>
      </div>
    );
  } else {
    return (<Maintain />);
  }
}

function Themed({setMaintain}) {
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
          <Routings handleMode={handleTheme} setMaintain={setMaintain} handleDashboardLayouttate={() => setDash(sessionStorage.getItem('dash'))} dash={dash} />
        </Router>
      </AlertProvider>
    </ThemeProvider>
  );
}

function Routings({ handleMode ,setMaintain}) {
  return (
    <>
      <AuthProvider>
        <PageLayout handleMode={handleMode} >
          <Routes>
            <Route exact path='/' element={<Home setMaintain={setMaintain}/>} />
            <Route path='/guide' element={<Guide />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path='/services' element={<Services/>}/>
            <Route path='/services/:id' element={<ViewService/>}/>
            <Route path='/dashboard' element={<PrivateRoute><DashboardLayout handleMode={handleMode} /></PrivateRoute>} />
          </Routes>
        </PageLayout>
      </AuthProvider>
    </>
  )
}

export default App;
