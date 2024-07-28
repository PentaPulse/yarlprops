import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSelectedService } from '../../backend/db/services';
import { CircularProgress, Grid } from '@mui/material';

function ViewService() {
  const [service, setService] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const servicesData = await fetchSelectedService(id);
        setService(servicesData);
      } catch (error) {
        console.error("Error fetching service: ", error);
      }
    };
    fetchService();
  }, [id]);

  if(!service){
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid items xs={12}>

      </Grid>
    </Grid>
  )

}

export default ViewService;
