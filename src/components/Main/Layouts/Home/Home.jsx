import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';
import { Box, Grid } from '@mui/material';

function Home() {

  return (
    <>
      <Box>
        {/** this is implented only for destop view */}
        <Grid container spacing={2} >
          <Grid item xs={2} sm={4} md={12} lg={12}>
            <Slidshow />
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={4} >
          <Grid item md={1}>
            <SearchAndFilters />
            <Categories />
          </Grid>
          <Grid item md={3}>
            <ProductsContents />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Home;
