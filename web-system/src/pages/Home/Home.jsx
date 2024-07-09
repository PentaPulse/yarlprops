import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import ProductsContents from './ProContent/ProductsContents';
import { Box, Divider, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

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
        <Grid item md={12}>
          <ProductsContents searchTerm={searchTerm} />
          <Box display='flex' justifyContent='flex-end' mr={4}>
            <Link to='/products'>See all</Link>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Home;