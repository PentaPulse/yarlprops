import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductsToHome } from '../../backend/db/products';
import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, Skeleton, Typography } from '@mui/material';

function ProductList() {
    const [products, setProducts] = React.useState([]);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    const handleCardClick = (pid) => {
        navigate(`/products/${pid}`);
    };

    React.useEffect(() => {
        const getProducts = async () => {
            try {
                const productList = await fetchProductsToHome();
                setProducts(productList);
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

    if (error) {
        return (
            <Container fixed>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                    {Array.from(new Array(6)).map((_, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Skeleton variant='rectangular' height={300} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

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

export default ProductList;
