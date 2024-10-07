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
const popularTimesData = {
  labels: ['9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm'],
  datasets: [
    {
      label: 'Products',
      backgroundColor: '#1E88E5',
      data: [30, 50, 40, 60],
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
  const [availableProductCount, setAvailbleProductCount] = useState(0)
  const [soldProductCount,setSoldProductCount]=useState(0)
  const rentedRentals = 100;
  const availableRentals = 200;
  const soldServices = 90;
  const availableServices = 110;
  const { user } = useAuth();

  useEffect(() => {
    const fetchAvailableProductCount = async () => {
      const q = query(collection(db, "products"), where("merchantId", "==", user.uid),where("status","==","For Sale"))
      try {
        const qSnapshot = await getDocs(q)
        setAvailbleProductCount(qSnapshot.size)
      } catch (e) {
        //console.error(e)
      }
    }

    fetchAvailableProductCount()
    const fetchSoldProductCount = async () => {
      const q = query(collection(db, "products"), where("merchantId", "==", user.uid),where("status","!=","For Sale"))
      try {
        const qSnapshot = await getDocs(q)
        setSoldProductCount(qSnapshot.size)
      } catch (e) {
        //console.error(e)
      }
    }

    fetchSoldProductCount()
  },[availableProductCount,soldProductCount,user.uid])

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
            <Pie data={createPieData(rentedRentals, availableRentals)} />
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
              Most Popular Times for Products, Rentals, and Services
            </Typography>
            <Bar data={popularTimesData} />
          </Paper>
        </Grid>

        {/* Summary and Comparisons */}
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: theme.palette.background }}>
            <Typography variant="h6" align="center" color={'inherit'}>
              Rentals Summary
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography>Total Rentals Rented: {rentedRentals}</Typography>
              <Typography>Total Rentals Available: {availableRentals}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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
