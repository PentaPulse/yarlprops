import * as React from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, CardActions, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { fetchProducts } from '../../api/db/products';
import DbError from '../../components/DbError/DbError';

const ProductsContents = ({ searchTerm, category, subCategory, price, quantity }) => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            if (searchTerm || category || subCategory || price || quantity) {
                let q;
                const productRef = collection(db, 'products')
                if (searchTerm !== null) {
                    q = query(productRef, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
                }
                if (category !== null) {
                    q = query(productRef, where('category', '==', category))
                }
                if (subCategory !== null) {
                    q = query(productRef, where('subCategory', '==', subCategory))
                }/*
                if (price) {
                    q = query(productRef, where('category', '==', price))
                }
                if (quantity) {
                    q = query(productRef, where('category', '==', quantity))
                }*/
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => doc.data());
                setProducts(items);

            } else {
                const productList = await fetchProducts();
                setProducts(productList);
            }
        };

        fetchData()
    }, [searchTerm, category, subCategory, price, quantity]);

    const handleCardClick = (pid) => {
        navigate(`/p/product/${pid}`);
    };
    return (
        <Container fixed>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {!products ? <DbError items={9} /> : products.length === 0 ?
                    <DbError items={9} />
                    :
                    products.map((product, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

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
                                    <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                                        {(product.status === "For Sale") ? (<Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>For Sale</Button>) : ((product.status === "For Rent") ? (<Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>For Rent</Button>) : ((<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>Sold Out!</Button>)))}
                                    </CardActions>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export default ProductsContents;
