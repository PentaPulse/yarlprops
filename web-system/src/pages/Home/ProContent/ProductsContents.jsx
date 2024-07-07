import * as React from 'react';
import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../backend/firebase';
import { fetchProducts } from '../../../backend/db/products';


const ProductsContents = ({ searchTerm }) => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate()
    React.useEffect(() => {
        const getProducts = async () => {
            const productList = await fetchProducts();
            setProducts(productList);
        };
        getProducts();
        const fetchData = async () => {
            if (searchTerm) {
                const q = query(collection(db, 'products'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => doc.data());
                setProducts(items);
            } else {
                getProducts()
            }
        };

        fetchData();
    }, [searchTerm]);

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
        </>
    );
}

export default ProductsContents;