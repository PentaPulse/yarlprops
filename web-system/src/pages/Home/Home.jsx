import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import { Box, Container, Divider, Grid, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';
import ServiceList from './ServiceList';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WeekendIcon from '@mui/icons-material/Weekend';
import WatchIcon from '@mui/icons-material/Watch';

function Home({ setMaintain }) {
  const categories = [
    { name: 'Boarding', link: '/category/boarding', icon: <HomeIcon fontSize="large" /> },
    { name: 'Vehicles', link: '/category/vehicles', icon: <DirectionsCarIcon fontSize="large" /> },
    { name: 'Furniture', link: '/category/furniture', icon: <WeekendIcon fontSize="large" /> },
    { name: 'Accessories', link: '/category/accessories', icon: <WatchIcon fontSize="large" /> },
  ];

  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Grid item md={12}>
          <Container>
            <Typography variant='h5' sx={{ mb: 2 }}> {/* Added bottom margin */}
              Categories
            </Typography>
            <Grid container spacing={3}> {/* Adjusted spacing */}
              {categories.map((category, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 3, // Elevation level 3
                      },
                      mb: 2 // Added bottom margin between cards
                    }}
                  >
                    <CardActionArea component={Link} to={category.link}>
                      <CardContent>
                        <Box display='flex' flexDirection='column' alignItems='center'>
                          {category.icon}
                          <Typography variant='h6' gutterBottom>
                            {category.name}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>
        <Divider />
        <Grid item md={12}>
          <Container>
            <Typography variant='h5'>Latest Products</Typography>
            <ProductList setMaintain={setMaintain} />
            <Box display='flex' justifyContent='flex-end' mr={4}>
              <Link to='/products'>See all</Link>
            </Box>
          </Container>
        </Grid>
        <Grid item md={12}>
          <Container>
            <Typography variant='h5'>Latest Services</Typography>
            <ServiceList />
            <Box display='flex' justifyContent='flex-end' mr={4}>
              <Link to='/services'>See all</Link>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
