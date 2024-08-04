import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AlertProvider from "./backend/AlertService";
import { AuthProvider } from "./backend/AuthContext";
import PrivateRoute from "./backend/PrivateRoute";
import DashboardLayout from "./dashboards/DashboardLayout";
import PageLayout from "./pages/PageLayout";
import Home from "./pages/Home/Home";
import Guide from "./pages/Guide/Guide";
import Contact from "./pages/Contact/Contact";
import Products from "./pages/Products/Products";
import ProductPage from "./pages/Products/ProView/View";
import Services from "./pages/Services/Services";
import ViewService from "./pages/Services/ViewService";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/Footer/Footer";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    background: {
      default: "#E3E1D9",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
    },
    background: {
      default: "#00072d",
    },
  },
});

function App() {
  return (
    <>
      <Themed />
    </>
  );
}

function Themed() {
  const [mode, setMode] = React.useState(() => {
    const storedTheme = sessionStorage.getItem("isLight");
    return storedTheme === null ? true : storedTheme === "true";
  });

  const handleTheme = () => {
    setMode((prevMode) => {
      const newMode = !prevMode;
      sessionStorage.setItem("isLight", newMode);
      return newMode;
    });
  };

  React.useEffect(() => {
    const storedTheme = sessionStorage.getItem("isLight");
    if (storedTheme !== null) {
      setMode(storedTheme === "true");
    }
  }, []);

  return (
    <ThemeProvider theme={mode ? lightTheme : darkTheme}>
      <AlertProvider>
        <CssBaseline />
        <Router>
          <Routings handleMode={handleTheme} />
        </Router>
      </AlertProvider>
    </ThemeProvider>
  );
}

function Routings({ handleMode }) {
  return (
    <>
      <AuthProvider>
        <PageLayout>
          <Routes>
            <Route exact path="/" element={<><NavigationBar handleMode={handleMode} /><Home/><Footer /></>} />
            <Route path="/guide" element={<><NavigationBar handleMode={handleMode} /><Guide/><Footer /></>} />
            <Route path="/contact" element={<><NavigationBar handleMode={handleMode} /><Contact/><Footer /></>} />
            <Route path="/products" element={<><NavigationBar handleMode={handleMode} /><Products/><Footer /></>} />
            <Route path="/products/:id" element={<><NavigationBar handleMode={handleMode} /><ProductPage/><Footer /></>} />
            <Route path="/services" element={<><NavigationBar handleMode={handleMode} /><Services/><Footer /></>} />
            <Route path="/services/:id" element={<><NavigationBar handleMode={handleMode} /><ViewService/><Footer /></>} />
          </Routes>          
        </PageLayout>
        <PrivateRoute>
          <Routes>
            <Route path="/dashboard" element={<DashboardLayout handleMode={handleMode} />} />
          </Routes>
        </PrivateRoute>
      </AuthProvider>
    </>
  );
}

export default App;