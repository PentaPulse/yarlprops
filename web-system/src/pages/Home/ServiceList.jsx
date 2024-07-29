import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServicesToHome } from '../../backend/db/services';
import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import DbError from '../../components/DbError/DbError';

export default function ServiceList() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/services/${pid}`);
  };

  React.useEffect(() => {
    const getServices = async () => {
      try {
        const serviceList = await fetchServicesToHome();
        setServices(serviceList);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  if (services.length === 0 && loading) {
    return (
      <Container fixed>
        <Typography variant="h6" color="textSecondary">
          Loading services...
        </Typography>
      </Container>
    );
  }

  return (
    <Container fixed>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
        {services.map((service, index) => (
          <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(service.pid)}>
                <CardMedia
                  sx={{ height: '20rem' }}
                  image={service.images[0] || 'https://picsum.photos/id/11/200/300'}
                  title={service.name}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant='h6' component='div' color='inherit'>
                    {service.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
        }
      </Grid>
    </Container>
  );
}
