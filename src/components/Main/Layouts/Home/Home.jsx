import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';
import { Divider, Grid, Pagination, TextField } from '@mui/material';

function Home() {
  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Divider />
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item md={3}>
          <Categories />
        </Grid>
        <Grid item md={9}>
          <ProductsContents searchTerm={searchTerm}/>
          <Pagination sx={{ width: '100%' }} count={10} />
        </Grid>
      </Grid>
    </>
  )
}

export default Home;

function Search() {
  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </>
  )
}