import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import { Box, Container, Divider, Grid, Typography, Card, CardContent, CardActionArea, Button, CardMedia, CardActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WeekendIcon from '@mui/icons-material/Weekend';
import WatchIcon from '@mui/icons-material/Watch';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SpaIcon from '@mui/icons-material/Spa'; // 
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../api/firebase';
import DbError from '../../components/DbError/DbError';

export default function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Boarding', link: '/rentals/bordim', icon: <HomeIcon fontSize="large" /> },
    { name: 'Vehicles', link: '/rentals/vehicles', icon: <DirectionsCarIcon fontSize="large" /> },
    { name: 'Furniture', link: '/category/furniture', icon: <WeekendIcon fontSize="large" /> },
    { name: 'Accessories', link: '/category/accessories', icon: <WatchIcon fontSize="large" /> },
    { name: 'Electronics', link: '/category/electronics', icon: <LaptopIcon fontSize="large" /> },
    { name: 'Mobile Phones', link: '/category/mobile-phones', icon: <PhoneIphoneIcon fontSize="large" /> },
    { name: 'Foods', link: '/category/foods', icon: <FastfoodIcon fontSize="large" /> },
    { name: 'Salon', link: '/category/salon', icon: <SpaIcon fontSize="large" /> },
  ];

  const handleSeeAll = (page) => {
    navigate(`/p/${page}`);
  }

  return (
    <>
      <Grid container justifyContent='center' spacing={3} columns={12}>
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Slidshow />
        </Grid>
        <Grid item md={12}>
          <Container>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Categories
            </Typography>
            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 3,
                      },
                      mb: 2,
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
            <Typography variant='h5' sx={{ mb: '1rem' }}>Latest Products</Typography>
            <ProductList />
            <Box display='flex' justifyContent='flex-end' mr={4}>
              <Button onClick={() => handleSeeAll('products')}>See all</Button>
            </Box>
          </Container>
        </Grid>
        <Grid item md={12}>
          <Container>
            <Typography variant='h5' sx={{ mb: '1rem' }}>Latest Rentals</Typography>
            <RentalsList />
            <Box display='flex' justifyContent='flex-end' mr={4}>
              <Button onClick={() => handleSeeAll('rentals')}>See all</Button>
            </Box>
          </Container>
        </Grid>
        <Grid item md={12}>
          <Container>
            <Typography variant='h5' sx={{ mb: '1rem' }}>Latest Services</Typography>
            <ServicesList />
            <Box display='flex' justifyContent='flex-end' mr={4}>
              <Button onClick={() => handleSeeAll('services')}>See all</Button>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

function ProductList() {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/p/product/${pid}`);
  };

  React.useEffect(() => {
    const getProducts = async () => {
      const q = await getDocs(query(collection(db, 'products'), limit(3)))
      const productList = q.docs.map(doc => doc.data())
      setProducts(productList);
    };
    getProducts();
  }, []);

  return (
    <Container fixed>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
        {products.length === 0 ?
          <DbError items={3} />
          :
          products.map((product, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
              <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                <CardActionArea onClick={() => handleCardClick(product.pid)}>
                  <CardMedia
                    sx={{ height: '20rem' }}
                    image={product.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={product.name}
                  />
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant='h6' component='div' color='inherit'>
                      {product.title}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                    {(product.status === "For Sale") ? (<Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>For Sale</Button>) : ((product.status === "For Rent") ? (<Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>For Rent</Button>) : ((<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>Sold Out!</Button>)))}
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

function RentalsList() {
  const [rentals, setRentals] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (rid) => {
    navigate(`/p/rental/${rid}`);
  };

  React.useEffect(() => {
    const getRentals = async () => {
      const q = await getDocs(query(collection(db, 'rentals'), limit(3)))
      const rentalsList = q.docs.map(doc => doc.data())
      setRentals(rentalsList);
    };
    getRentals();
  }, []);

  return (
    <Container fixed>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
        {rentals.length === 0 ?
          <DbError items={3} />
          :
          rentals.map((rental, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
              <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                <CardActionArea onClick={() => handleCardClick(rental.pid)}>
                  <CardMedia
                    sx={{ height: '20rem' }}
                    image={rental.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={rental.name}
                  />
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant='h6' component='div' color='inherit'>
                      {rental.title}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                    {(rental.status === "For Sale") ? (<Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>For Sale</Button>) : ((rental.status === "For Rent") ? (<Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>For Rent</Button>) : ((<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>Sold Out!</Button>)))}
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
function ServicesList() {
  const [services, setServices] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/p/service/${pid}`);
  };

  React.useEffect(() => {
    const getServices = async () => {
      const q = await getDocs(query(collection(db, 'services'), limit(3)))
      const serviceList = q.docs.map(doc => doc.data())
      setServices(serviceList);
    };
    getServices();
  }, []);

  return (
    <Container fixed>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
        {services.length === 0 ?
          <DbError items={3} />
          :
          services.map((service, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
              <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                <CardActionArea onClick={() => handleCardClick(service.pid)}>
                  <CardMedia
                    sx={{ height: '20rem' }}
                    image={service.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={service.name}
                  />
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant='h6' component='div' color='inherit'>
                      {service.serviceName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}