import * as React from 'react';
import Slidshow from './Slideshow/Slidshow';
import { Box, Container, Divider, Grid, Typography, Card, CardContent, CardActionArea, Button, CardMedia, CardActions, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WeekendIcon from '@mui/icons-material/Weekend';
import WatchIcon from '@mui/icons-material/Watch';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SpaIcon from '@mui/icons-material/Spa'; // 
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../api/firebase';
import DbError from '../../components/DbError/DbError';

export default function Home() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const FontSize = isSmallScreen ? '0.9rem' : '1.2rem';

  const categories = [
    { name: 'Boarding', link: '/p/rentals/Bordim', icon: <HomeIcon fontSize="large" /> },
    { name: 'Furniture', link: '/products/Furnitures', icon: <WeekendIcon fontSize="large" /> },
    { name: 'Foods', link: '/services/Food', icon: <FastfoodIcon fontSize="large" /> },
    { name: 'Accessories', link: '/products/accessories', icon: <WatchIcon fontSize="large" /> },
    { name: 'Vehicles', link: '/rentals/Vehicles', icon: <DirectionsCarIcon fontSize="large" /> },
    { name: 'Salon', link: '/services/Saloon', icon: <SpaIcon fontSize="large" /> },
  ];

  const handleSeeAll = (page) => {
    navigate(`/p/${page}`);
  }

  return (
    <>
    <Box>
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
                <Grid item key={index} xs={4} sm={3} md={2} lg={2}> 
                {/* xs={12} sm={6} md={4} */}
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
                          <Typography variant='h6' sx={{ fontSize: FontSize }} gutterBottom>
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
    </Box>
  </>
  );
}

{/* Latest Products Row */}

function ProductList() {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/p/product/${pid}`);
  };

  React.useEffect(() => {
    const getProducts = async () => {
      const q = await getDocs(query(collection(db, 'products'), limit(4)))
      const productList = q.docs.map(doc => doc.data())
      setProducts(productList);
    };
    getProducts();
  }, []);

  return (
    <Container 
      fixed
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }} sx={{ justifyContent: "left", alignItems: "center"}} columns={24}>
        {products.length === 0 ?
          <DbError home={true} />
          :
          products.map((product, index) => (
            <Grid item key={index} xs={24} sm={12} md={8} lg={6}>
              <Card 
                sx={{ 
                  width: '100%', // Takes full width within its grid space
                  height: 'auto',               
                  // minHeight: '280px', Minimum height, but allows it to expand
                  maxHeight: '300px',
                  minWidth: '230px',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative', 
                }}>

                <CardActionArea onClick={() => handleCardClick(product.pid)}>
                  <CardMedia
                    sx={{ height: '230px', objectFit: 'cover' }}
                    image={product.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={product.name}
                  />
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography gutterBottom variant='h6' component='div'>
                      {product.title}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                    {(product.status === "For Sale") ? (
                      <Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>
                        For Sale
                      </Button>
                    ) : ((product.status === "For Rent") ? (
                      <Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>
                        For Rent
                      </Button>
                    ) : (
                      (<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>
                        Sold Out!
                      </Button>
                    )))}
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

{/* Latest Rentals Row */}

function RentalsList() {
  const [rentals, setRentals] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (rid) => {
    navigate(`/p/rental/${rid}`);
  };

  React.useEffect(() => {
    const getRentals = async () => {
      const q = await getDocs(query(collection(db, 'rentals'), limit(4)))
      const rentalsList = q.docs.map(doc => doc.data())
      setRentals(rentalsList);
    };
    getRentals();
  }, []);

  return (
    <Container 
      fixed
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }} sx={{ justifyContent: "left", alignItems: "center"}} columns={24}>
        {rentals.length === 0 ?
          <DbError home={true} />
          :
          rentals.map((rental, index) => (
            <Grid item key={index} xs={24} sm={12} md={8} lg={6}>
              <Card 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  minWidth: '230px',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  fulWidth: 'true'
              }}>
                <CardActionArea onClick={() => handleCardClick(rental.rid)}>
                  <CardMedia
                    sx={{ height: '230px', objectFit: 'cover' }}
                    image={rental.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={rental.name}
                  />
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography gutterBottom variant='h6' component='div'>
                      {rental.title}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                    {(rental.status === "For Sale") ? (
                      <Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>
                        For Sale
                      </Button>
                      ) : ((rental.status === "For Rent") ? (
                      <Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>
                        For Rent
                      </Button>
                      ) : ((
                      <Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>
                        Sold Out!
                      </Button>)))}
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

{/* Latest Services Row */}

function ServicesList() {
  const [services, setServices] = React.useState([]);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/p/service/${pid}`);
  };

  React.useEffect(() => {
    const getServices = async () => {
      const q = await getDocs(query(collection(db, 'services'), limit(4)))
      const serviceList = q.docs.map(doc => doc.data())
      setServices(serviceList);
    };
    getServices();
  }, []);

  return (
    <Container 
      fixed
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }} sx={{ justifyContent: "left", alignItems: "center"}} columns={24}>
        {services.length === 0 ?
          <DbError home={true} />
          :
          services.map((service, index) => (
            <Grid item key={index} xs={24} sm={12} md={8} lg={6}>
              <Card 
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  minWidth: '230px',           
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative', 
              }}>
                <CardActionArea onClick={() => handleCardClick(service.sid)}>
                  <CardMedia
                    sx={{ height: '230px', objectFit: 'cover' }}
                    image={service.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={service.name}
                  />
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography gutterBottom variant='h6' component='div'>
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

{/* <Container fixed>
      <Grid container spacing={{ xs: 3, md: 6, lg: 10 }} sx={{ justifyContent: "left"}} columns={24}>
        {services.length === 0 ?
          <DbError items={3} />
          :
          services.map((service, index) => (
            <Grid item key={index} xs={24} sm={12} md={8} lg={6}>
              <Card 
                sx={{ 
                  width: '270px', // Fixed width for the card
                  height: '300px', // Fixed height for the card
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
                  },
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative', 
              }}>
                <CardActionArea onClick={() => handleCardClick(service.sid)}>
                  <CardMedia
                    sx={{ height: '230px', objectFit: 'cover' }}
                    image={service.images[0] || 'https://picsum.photos/id/11/200/300'}
                    title={service.name}
                  />
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography gutterBottom variant='h6' component='div'>
                      {service.serviceName}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container> */}