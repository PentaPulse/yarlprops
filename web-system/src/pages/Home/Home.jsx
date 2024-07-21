import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import { Box,  Container,  Divider, Grid, Typography } from '@mui/material';
import { Link} from 'react-router-dom';
import ProductList from './ProductList'
import ServiceList from './ServiceList';

function Home() {
  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Divider />
        <Grid item md={12}>
          <Container>
          <Typography variant='h5' >Latest Products</Typography>
          <ProductList />
          <Box display='flex' justifyContent='flex-end' mr={4}>
            <Link to='/products'>See all</Link>
          </Box>
          </Container>
        </Grid>
        <Grid item md={12}>
          <Container>
          <Typography variant='h5' >Latest Services</Typography>
          <ServiceList/>
          <Box display='flex' justifyContent='flex-end' mr={4}>
            <Link to='/services'>See all</Link>
          </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  )
}

export default Home;