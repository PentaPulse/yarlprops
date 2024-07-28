import * as React from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../backend/firebase';
import { fetchProducts } from '../../backend/db/products';

const ProductsContents = ({ searchTerm }) => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (searchTerm !== '') {
                    const q = query(collection(db, 'products'), where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
                    const querySnapshot = await getDocs(q);
                    const items = querySnapshot.docs.map(doc => doc.data());
                    setProducts(items);
                } else {
                    const productList = await fetchProducts();
                    setProducts(productList);
                }
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm]);

    const handleCardClick = (pid) => {
        navigate(`/products/${pid}`);
    };

    if (error) {
        return (
            <Container fixed>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                    {Array.from(new Array(9)).map((_, index) => (
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
                        <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
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
};

export default ProductsContents;
