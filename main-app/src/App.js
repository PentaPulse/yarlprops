import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AlertProvider from "./api/AlertService";
import { AuthProvider, useAuth } from "./api/AuthContext";
import PrivateRoute from "./api/PrivateRoute";
import { collection, getDocs, query, where } from 'firebase/firestore';
import Home from "./pages/Home/Home";
//import Guide from "./pages/Guide/Guide";
import Contact from "./pages/Contact/Contact";
import Products from "./pages/Products/Products";
import { ProductPage } from "./pages/Products/Products";
import Services, { ServicePage } from "./pages/Services/Services";
import { Box } from "@mui/material";
import { RentalsPage } from "./pages/Rentals/Rentals";
import Rentals from "./pages/Rentals/Rentals";
import DashboardLayout from "./dashboards/DashboardLayout";
import { db } from "./api/firebase";
import MerchantProducts from "./dashboards/Merchant/MerchantProducts";
import MerchantRentals from "./dashboards/Merchant/MerchantRentals";
import MerchantServices from "./dashboards/Merchant/MerchantServices";
import MerchantOrders from "./dashboards/Merchant/MerchantOrders";
import CustomerOrders from "./dashboards/Customer/CustomerOrders";
import CustomerFeedback from "./dashboards/Customer/CustomerFeedback";
import CustomerMsgCenter from "./dashboards/Customer/CustomerMsgCenter";
import MerchantOverview from "./dashboards/Merchant/MerchantOverview";
import Profile from "./dashboards/UserProfile";
import CustomerOverview from './dashboards/Customer/CustomerOverview'
import Guide from "./pages/Guide/Guide";
import PageLayout from "./pages/PageLayout";

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
          <Route path="*" element={<PageRoutes handleMode={handleMode} />} />
          <Route path="/p/*" element={<PageRoutes handleMode={handleMode} />} />
          <Route path="/d/*" element={<PrivateRoute><DashboardRoutes handleMode={handleMode} /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

function PageRoutes({ handleMode }) {
  return (
    <>
      <Box sx={{ marginTop: '12vh' }}>
        <PageLayout handleMode={handleMode}>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:cat" element={<Products />} />
          <Route path="products/:search" element={<Products />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="rentals" element={<Rentals />} />
          <Route path="rentals/:cat" element={<Rentals />} />
          <Route path="rentals/:search" element={<Rentals />} />
          <Route path="rental/:id" element={<RentalsPage />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:cat" element={<Services />} />
          <Route path="services/:search" element={<Services />} />
          <Route path="service/:id" element={<ServicePage />} />
          <Route path="guide" element={<Guide/>}/>
          <Route path="contact" element={<Contact />} />
        </Routes>
        </PageLayout>
      </Box>
    </>
  )
}

function DashboardRoutes({handleMode}) {
  const { user } = useAuth();
  const [merchantList, setMerchantList] = React.useState([]);

  React.useEffect(() => {

    const fetchMerchantList = async () => {
      try {
        const q = await getDocs(query(collection(db, 'systemusers'), where('isMerchant', '==', true)));
        const list = q.docs.map((doc) => doc.data().uid);
        setMerchantList(list);
      } catch (e) { }
    };
    
    fetchMerchantList();
  }, []);
  return (
    <>
      <DashboardLayout handleMode={handleMode}>
        <Routes>
          {/* Common */}
          <Route path="overview" element={(merchantList.includes(user.uid) ? <MerchantOverview /> : <CustomerOverview />)} />
          <Route path="profile" element={<Profile />} />

          {/* Merch */}
          <Route path="myproducts" element={<MerchantProducts />} />
          <Route path="myrentals" element={<MerchantRentals />} />
          <Route path="myservices" element={<MerchantServices />} />
          <Route path="myorders" element={<MerchantOrders />} />

          {/* Customer */}
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="feedback" element={<CustomerFeedback />} />
          <Route path="mcentre" element={<CustomerMsgCenter />} />
        </Routes>
      </DashboardLayout>
    </>
  )
}