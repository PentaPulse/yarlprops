import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AlertProvider from "./api/AlertService";
import { AuthProvider } from "./api/AuthContext";
import PrivateRoute from "./api/PrivateRoute";
import DashboardLayout from "./dashboards/DashboardLayout";
import Home from "./pages/Home/Home";
//import Guide from "./pages/Guide/Guide";
import Contact from "./pages/Contact/Contact";
import Products from "./pages/Products/Products";
import ProductPage from "./pages/Products/ProView/View";
import Services from "./pages/Services/Services";
import ViewService from "./pages/Services/ViewService";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Footer from "./components/Footer/Footer";
import { Box } from "@mui/material";
import AdminLogin from "./dashboards/Admin/AdminLogin";
import RentalsPage from "./pages/Rentals/Rental.pages";
import Rentals from "./pages/Rentals/Rental.pages";

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

export default function App() {
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
        <Routes>
          <Route path="/" element={<PageLayout handleMode={handleMode} />} />
          <Route path="/p/*" element={<PageLayout handleMode={handleMode} />} />
          <Route path="/d/*" element={<PrivateRoute><DashboardLayout handleMode={handleMode} /></PrivateRoute>} />
          <Route path="/adminLogin" element={<AdminLogin handleMode={handleMode}/>}/>
        </Routes>
      </AuthProvider>
    </>
  )
}

function PageLayout({handleMode}) {
  return (
    <>
      <Box sx={{ marginTop: '12vh' }}>
        <NavigationBar handleMode={handleMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="rentals" element={<Rentals />} />
          <Route path="rentals/:id" element={<RentalsPage />} />
          <Route path="services" element={<Services />} />
          <Route path="service/:id" element={<ViewService />} />
          <Route path="contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Box>
    </>
  )
}