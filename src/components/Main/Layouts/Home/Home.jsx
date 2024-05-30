import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Divider, Grid, Pagination, TextField } from '@mui/material';

function Home() {

  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Divider />
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Search />
        </Grid>
        <Grid item md={3}>
          <Categories />
        </Grid>
        <Grid item md={9}>
          <ProductsContents />
          <Pagination count={10} />
        </Grid>
      </Grid>
    </>
  )
}

export default Home;

function Search() {
  return (
    <>
      <TextField sx={{ height: '2rem', width: '90%' }}></TextField>
      <Button sx={{ backgroundColor: '', height: '3.5rem',textAlign:'center',width:'10%' }}>
        <SearchIcon />
      </Button>
    </>
  )
}