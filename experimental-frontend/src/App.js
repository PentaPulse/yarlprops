import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signin from './components/Signin';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getMPTheme from './components/theme/getMPTheme'
import { CssBaseline } from '@mui/material';
import FAQ from './pages/FAQ/FAQ'
import PageLayout from './pages/PageLayout';
import DashboardLayout from './dashboards/DashboardLayout';

export default function App() {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const MPTheme = createTheme(getMPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  return (
    <>
      <ThemeProvider theme={MPTheme}>
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route path='/signin' element={<Signin />} />
            <Route path='*' element={<PageRoutes />} />
            <Route path='/d' element={<DashboardLayout/>}/>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

function PageRoutes() {
  return (
    <>
      <PageLayout>
        <Routes>
          <Route path='/p/faq' element={<FAQ />} />
        </Routes>
      </PageLayout>
    </>
  )
}
