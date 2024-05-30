import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../../backend/db/products';
import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const ProductsContents = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const getProducts = async () => {
            const productList = await fetchProducts();
            setProducts(productList);
        };
        getProducts();
    }, []);

    const handleCardClick = (e) => {
        navigate(`/product/${e}`)
    }
    return (
        <>
            <section id='products' className='d-fiex justify-content-center align-items-center mt-5'>
                <Container fixed>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                        {products.map((product, index) => (
                            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                                <Card>
                                    <CardMedia
                                        sx={{ height: '20rem' }}
                                        image={product.image || 'https://picsum.photos/id/11/200/300'}
                                        title={product.name}
                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant='h4' component='div'>
                                            {product.name}
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
            </section>
        </>
    );
}

export default ProductsContents;