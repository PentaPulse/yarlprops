import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, CircularProgress, Grid } from '@mui/material';
import { fetchSelectedProduct } from '../../backend/db/products';

const ProductDetail = () => {
  const { pid } = useParams(); //Extracts the 'pid' parameter from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await fetchSelectedProduct(pid); // Use 'pid' to fetch the product details
      if (fetchedProduct){
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
      <Typography variant="h4">{product.title}</Typography>
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle1">Type: {product.type}</Typography>
      <Typography variant="body1">Description: {product.description}</Typography>
      <Typography variant="body1">Quantity: {product.quantity}</Typography>
      <Typography variant="body1">Location: {product.location}</Typography>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
      {product.images && product.images.map((src, index) => (
        <img 
          src={src} 
          alt={`Product ${index}`} 
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ))}
      </Grid>
    </Paper>
  );
};

export default ProductDetail;
