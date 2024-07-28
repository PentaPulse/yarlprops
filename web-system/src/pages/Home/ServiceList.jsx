import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServicesToHome } from '../../backend/db/services';
import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, Skeleton, Typography } from '@mui/material';

function List() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleCardClick = (pid) => {
    navigate(`/products/${pid}`);
  };

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const List = await fetchServicesToHome();
        setProducts(List);
      } catch (e) {
        if (e.code === 'resource-exhausted') {
          setError('Resource exhausted. Please try again later.');
        } else {
          setError('An error occurred while fetching products.');
        }
      }
    };
    getProducts();
  }, []);
  //change loading => error when atleast one service have in db
  if (loading) {
    return (
      <Container fixed>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
          {Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
              <Skeleton variant='rectangular' height={300} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  else {
    return (
      <Container fixed>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
          {products.map((product, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
              <Card>
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
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
}

export default List;
