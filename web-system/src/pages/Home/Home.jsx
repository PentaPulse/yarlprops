import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import ProductsContents from './ProContent/ProductsContents';
import { Box, Divider, Grid,  Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Divider />
        <Grid item md={12}>
          <Typography variant='h4' >Latest Products</Typography>
          <ProductsContents/>
          <Box display='flex' justifyContent='flex-end' mr={4}>
            <Link to='/products'>See all</Link>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Typography variant='h4' >Latest Services</Typography>
          <ProductsContents/>
          <Box display='flex' justifyContent='flex-end' mr={4}>
            <Link to='/services'>See all</Link>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Home;