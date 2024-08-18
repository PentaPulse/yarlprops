import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, useTheme, Box } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { fetchSelectedService } from '../../api/db/services';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function ViewService() {
  const [service, setService] = useState(null);
  const { id } = useParams();
  const theme = useTheme();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceData = await fetchSelectedService(id);
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  if (!service) {
    return <CircularProgress />;
  }

  return (
      <Container sx={{ backgroundColor: theme.palette.background.default }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Service Image */}
            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              {/* <CardMedia
                component="img"
                image={service.images[0]}
                alt={service.name}
                sx={{ height: '52vh', borderRadius: '0px'}}
              /> */}
              {/* Small Image Slide Show */}
              <Carousel>
                {service.images.map((image, index) => (
                  <Box key={index}>
                    <CardMedia
                      component="img"
                      image={image}
                      alt={`slide ${index}`}
                      sx={{ height: '80vh', borderRadius: '25px', p: '15px' }}
                    />
                  </Box>
                ))}
              </Carousel> 
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              <CardContent sx={{ my:'30px'}}>
                {/* Service Details */}
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{service.serviceName}</Typography>
                <Box sx={{ mx: '1.9rem', mt: '1rem' }}>
                  <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography>
                  <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                    {service.serviceDescription.map((description, index) => (
                        <li key={index}>{description}</li>
                    ))}
                    <li>Location: {service.serviceLocation}</li>
                  </ul>
                </Box>
                <Box sx={{ mx: '1rem', mt: '4.5rem' }}>
                  {/* Seller Details */}
                  <Typography variant="h5" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Service Provider's Details</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-user"></i> Name</Typography>
                  <Typography>{service.spName}</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-location-dot"></i> Location</Typography>
                  <Typography>{service.Location}</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-phone"></i> Contact No</Typography>
                  <Typography>{service.telephone}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={0} sx={{ mt: '0.5rem' }}>
          <Grid item>
            <Button variant="contained" component={Link} to="/services" startIcon={<ChevronLeftIcon/>}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
  );
}

export default ViewService;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchSelectedService } from '../../backend/db/services';
// import { CircularProgress, Grid } from '@mui/material';

// function ViewService() {
//   const [service, setService] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const servicesData = await fetchSelectedService(id);
//         setService(servicesData);
//       } catch (error) {
//         console.error("Error fetching service: ", error);
//       }
//     };
//     fetchService();
//   }, [id]);

//   if(!service){
//     return <CircularProgress />;
//   }

//   return (
//     <Grid container spacing={2}>
//       <Grid items xs={12}>

//       </Grid>
//     </Grid>
//   )

// }

// export default ViewService;
