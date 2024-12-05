import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../api/AuthContext';
import { db } from '../../api/firebase';

// Data for Pie Charts
const createPieData = (sold, available) => ({
  labels: ['Sold', 'Available'],
  datasets: [
    {
      data: [sold, available],
      backgroundColor: ['#1E88E5', '#000000'], // Blue and Black
      hoverBackgroundColor: ['#42A5F5', '#424242'],
    },
  ],
});

// Data for Bar Chart (Popular Times)
const popularRatingsData = {
  labels: ['5', '4', '3', '2','1'],
  datasets: [
    {
      label: 'Products',
      backgroundColor: '#1E88E5',
      data: [8, 50, 40, 60],
    },
    {
      label: 'Rentals',
      backgroundColor: '#000000',
      data: [45, 70, 35, 50],
    },
    {
      label: 'Services',
      backgroundColor: '#42A5F5',
      data: [20, 40, 60, 30],
    },
  ],
};

const MerchantOverview = () => {
  const theme=useTheme()
  const [availableProductCount, setAvailableProductCount] = useState(0)
  const [soldProductCount,setSoldProductCount]=useState(0)
  const [availableRentalCount,setAvailableRentalCount]=useState(0)
  const [soldRentalCount,setSoldRentalCount]=useState(0)
  const soldServices = 90;
  const availableServices = 110;
  const { user } = useAuth();

  useEffect(() => {
    const fetchItemCounts = async (itemType, available, status) => {
      const operator = available ? '==' : '!=';
      const q = query(
        collection(db, `${itemType}s`),
        where('merchantId', '==', user.uid),
        where('status', operator, status)
      );
  
      try {
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (e) {
        console.error("Error fetching item counts:", e);
        return 0;
      }
    };
  
    const updateitemCounts = async () => {
      //setAvailableProductCount(await fetchItemCounts('product', true, 'For Sale'));
      setAvailableProductCount(100000);
      //setSoldProductCount(await fetchItemCounts('product',false,'For Sale'))
      setSoldProductCount(100)
      setAvailableRentalCount(await fetchItemCounts('rental',true,'For Rent'))
      setSoldRentalCount(await fetchItemCounts('rental',false,'For Rent'))
    };
  
    updateitemCounts();
  }, [user.uid]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Merchant Overview
      </Typography>

      <Grid container spacing={4}>
        {/* Pie Charts */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Products (Sold vs Available)
            </Typography>
            <Pie data={createPieData(soldProductCount, availableProductCount)} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Rentals (Rented vs Available)
            </Typography>
            <Pie data={createPieData(soldRentalCount, availableRentalCount)} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Services (Sold vs Available)
            </Typography>
            <Pie data={createPieData(soldServices, availableServices)} />
          </Paper>
        </Grid>

        {/* Popular Times Bar Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Most Popular Products, Rentals, and Services
            </Typography>
            <Bar data={popularRatingsData} />
          </Paper>
        </Grid>

        {/* Summary and Comparisons */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Products Summary
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography>Total Products Sold: {soldProductCount}</Typography>
              <Typography>Total Products Available: {availableProductCount}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Rentals Summary
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography>Total Rentals Rented: {soldRentalCount}</Typography>
              <Typography>Total Rentals Available: {availableRentalCount}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Services Summary
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography>Total Services Sold: {soldServices}</Typography>
              <Typography>Total Services Available: {availableServices}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MerchantOverview;

//app.jsx
// Importing React library
//import React from 'react';

// Importing the MerchantOverview component
//import MerchantOverview from './components/MerchantOverview';

//function App() {
//return (
// <div>
// {/* Rendering the MerchantOverview component */}
// <MerchantOverview />
// </div>
// );
//}

// Exporting the App component as the default export
//export default App;
