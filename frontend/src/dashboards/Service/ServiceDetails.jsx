import React, { useState, useEffect } from 'react';
import { fetchSelectedService } from '../../api/db/services';
import { Paper, Typography, CircularProgress, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';

const Image = styled('img')({
  width: 500,
  height: 500,
  objectFit: 'cover',
  margin: 5,
});

const ServiceDetails = ({ sid, onBack }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      const fetchedService = await fetchSelectedService(sid);
      if (fetchedService) {
        setService(fetchedService);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchService();
  }, [sid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Services List
      </Button>
      <Typography variant="h4">{service.serviceName}</Typography>
      <Typography variant="body1">
        Description: 
      <ul style={{ textAlign: 'justify'}}>
        {service.serviceDescription.map((description, index) => (
          <li key={index}>{description}</li>
      ))}          
      </ul>
      </Typography>
      <Typography variant="body1">Location: {service.serviceLocation}</Typography>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {service.images && service.images.map((src, index) => (
          <Grid item key={index}>
            <Image src={src} alt={`Product ${index}`} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ServiceDetails;
