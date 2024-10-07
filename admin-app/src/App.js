import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AlertProvider from "./api/AlertService";
import { AuthProvider } from "./api/AuthContext";
import PrivateRoute from "./api/PrivateRoute";
import { LoginLayout } from "./dashboards/Admin/LoginLayout";
import DashboardLayout from "./dashboards/DashboardLayout";
import Admins from "./dashboards/Admin/Admins";
import AdminProducts from "./dashboards/Admin/AdminProducts";
import AdminRentals from "./dashboards/Admin/AdminRentals";
import AdminServices from "./dashboards/Admin/AdminServices";
import ContactusRequests from "./dashboards/Admin/ContactusReqs";
import AdminOverview from "./dashboards/Admin/AdminOverview";
import Profile from "./dashboards/UserProfile";
import AdminCustomers from "./dashboards/Admin/AdminCustomers";
import AdminMerchants from "./dashboards/Admin/AdminMerchants";
import { AdminMessages } from "./dashboards/Admin/AdminMessages";

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
          <Route path="/" element={<LoginLayout handleMode={handleMode}/>}/>
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
          {/* Common */}
          <Route path="overview" element={<AdminOverview />} />
          <Route path="profile" element={<Profile />} />

          {/* Admin */}
          <Route path="adminlist" element={<Admins />} />
          <Route path="amsgs" element={<AdminMessages />} />
          <Route path="merchantlist" element={<AdminMerchants />} />
          <Route path="customerlist" element={<AdminCustomers />} />
          <Route path="productlist" element={<AdminProducts />} />
          <Route path="rentallist" element={<AdminRentals />} />
          <Route path="servicelist" element={<AdminServices />} />
          <Route path="contactreqs" element={<ContactusRequests />} />

        </Routes>
      </DashboardLayout>
    </>
  )
}