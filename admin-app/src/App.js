import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AlertProvider from "./api/AlertService";
import { AuthProvider } from "./api/AuthContext";
import PrivateRoute from "./api/PrivateRoute";
import { LoginLayout } from "./components/Sign/LoginLayout";
import DashboardLayout from "./dashboard/DashboardLayout";
import Admins from "./dashboard/Admins";
import Products from "./dashboard/Products";
import Rentals from "./dashboard/Rentals";
import Services from "./dashboard/Services";
import ContactusRequests from "./dashboard/ContactusReqs";
import Overview from "./dashboard/Overview";

import Profile from "./dashboard/Profile";
import Customers from "./dashboard/Customers";
import Merchants from "./dashboard/Merchants";
import NotificationsPanel from "./dashboard/NotificationsPanel";
import SiteManager from "./dashboard/SiteManager";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    background: {
      default: "#3D52A0",
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
          <Route path="/" element={<LoginLayout handleMode={handleMode} />} />
          <Route path="/*" element={<PrivateRoute><DashboardRoutes handleMode={handleMode} /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

function DashboardRoutes({ handleMode }) {
  return (
    <>
      <DashboardLayout handleMode={handleMode}>
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<NotificationsPanel />} />
          <Route path="adminlist" element={<Admins />} />
          <Route path="merchantlist" element={<Merchants />} />
          <Route path="customerlist" element={<Customers />} />
          <Route path="productlist" element={<Products />} />
          <Route path="rentallist" element={<Rentals />} />
          <Route path="servicelist" element={<Services />} />
          <Route path="contactreqs" element={<ContactusRequests />} />
          <Route path="site" element={<SiteManager/>} />   
        </Routes>
      </DashboardLayout>
    </>
  )
}