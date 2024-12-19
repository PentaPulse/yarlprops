import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useAuth } from '../../api/AuthContext';
import { db } from '../../api/firebase';
import { fetchItemCounts, fetchServicesCount } from '../../api/db/items';
import { fetchRatingData } from '../../api/db/ratings';

// Data for Pie Charts
const createPieData = (sold, available) => ({
  labels: ['Sold', 'Available'],
  datasets: [
    {
      data: [sold, available],
      backgroundColor: ['#1E88E5', '#000000'],
    },
  ],
});

const createServicePieData = (total) => ({
  labels: ['Total'],
  datasets: [
    {
      data: [total],
      backgroundColor: ['#1E88E5'], 
    },
  ],
});

// Data for Bar Chart (Popular Times)

const MerchantOverview = () => {
  const theme=useTheme()
  const [availableProductCount, setAvailableProductCount] = useState(0)
  const [soldProductCount,setSoldProductCount]=useState(0)
  const [availableRentalCount,setAvailableRentalCount]=useState(0)
  const [soldRentalCount,setSoldRentalCount]=useState(0)
  const [productsRatingData,setProductsRatingData]=useState([])
  const [rentalsRatingData,setRentalsRatingData]=useState([])
  const [servicesRatingData,setServicesRatingData]=useState([])
  const [totalServices,setTotalServices]=useState(0)
  const { user } = useAuth();

  const popularRatingsData = {
    labels: ['0','1','2','3','4','5'],
    datasets: [
      {
        label: 'Products',
        backgroundColor: '#1E88E5',
        data: productsRatingData,
      },
      {
        label: 'Rentals',
        backgroundColor: '#000000',
        data: rentalsRatingData,
      },
      {
        label: 'Services',
        backgroundColor: '#42A5F5',
        data: servicesRatingData,
      },
    ],
  };

    useEffect(() => {  
    const updateitemCounts = async () => {
      setAvailableProductCount(await fetchItemCounts(user.uid,'product', true, 'For Sale'));
      setSoldProductCount(await fetchItemCounts(user.uid,'product',false,'For Sale'))
      setAvailableRentalCount(await fetchItemCounts(user.uid,'rental',true,'For Rent'))
      setSoldRentalCount(await fetchItemCounts(user.uid,'rental',false,'For Rent'))
      setTotalServices(await fetchServicesCount(user.uid))
    };

    const fetchRatings=async()=>{
      setProductsRatingData(await fetchRatingData(user.uid,'products'))
      setRentalsRatingData(await fetchRatingData(user.uid,'rentals'))
      setServicesRatingData(await fetchRatingData(user.uid,'services'))
    }
    fetchRatings()
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
              Services (Total Available)
            </Typography>
            <Pie data={createServicePieData(totalServices)} />
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
              <Typography>Total Services: {totalServices}</Typography>
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
