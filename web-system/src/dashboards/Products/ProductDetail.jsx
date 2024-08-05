import React, { useState, useEffect } from 'react';
import { fetchSelectedProduct } from '../../backend/db/products';
import { Paper, Typography, CircularProgress, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';

const Image = styled('img')({
  width: 200,
  height: 200,
  objectFit: 'cover',
  margin: 5,
});

const ProductDetail = ({ pid, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchSelectedProduct(pid);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [pid]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 16 }}>
      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Product List
      </Button>
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle1">Type: {product.type}</Typography>
      <Typography variant="body1">Description: {product.description}</Typography>
      <Typography variant="body1">Quantity: {product.quantity}</Typography>
      <Typography variant="body1">Location: {product.location}</Typography>
      <Typography variant="body1">Status: {product.status}</Typography>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {product.images && product.images.map((src, index) => (
          <Grid item key={index}>
            <Image src={src} alt={`Product ${index}`} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ProductDetail;
