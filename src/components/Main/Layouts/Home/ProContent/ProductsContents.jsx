import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../../../backend/db/products';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import ProductPage from '../ProView/ProductPage';


const ProductsContents = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState('')
    useEffect(() => {
        const getProducts = async () => {
            const productList = await fetchProducts();
            setProducts(productList);
        };
        getProducts();
    }, []);

    const handleCardClick = () => {
        console.log("clicked")
        console.log(product)
    }
    return (
        <>
            <section id='products' className='d-fiex justify-content-center align-items-center mt-5'>
                <Container fluid>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 ,lg:12}}>
                        {products.map((product) => (
                            <Grid item xs={2} sm={4} md={4} lg={3} key={product}>
                                <Card>
                                    <CardMedia sx={{ height: '20rem' }} image='https://picsum.photos/id/11/200/300' title={product.name} />
                                    <CardContent sx={{display:'flex',justifyContent:'space-between'}}>
                                        <Typography gutterBottom variant='h4' component='div'>
                                            {product.name}
                                        </Typography>
                                        <Button onClick={() => setProduct(product.id)} size="small">Learn More</Button>
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