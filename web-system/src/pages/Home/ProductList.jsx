import React from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchProductsToHome } from '../../backend/db/products';
import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';

function ProductList() {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate()
    React.useEffect(() => {
        const getProducts = async () => {
            const productList = await fetchProductsToHome();
            setProducts(productList);
        };
        getProducts();
    });

    const handleCardClick = (e) => {
        navigate(`/products/${e}`)
    }
    return (
        <>
            <Container fixed>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                    {products.map((product, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Card>
                                <CardMedia
                                    sx={{ height: '20rem' }}
                                    image={product.images[0] || 'https://picsum.photos/id/11/200/300'}
                                    title={product.name}
                                />
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography gutterBottom variant='h6' component='div' color='inherit'>
                                        {product.title}
                                    </Typography>
                                    <Button onClick={() => handleCardClick(product.pid)} size="medium">
                                        Read More
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default ProductList;
