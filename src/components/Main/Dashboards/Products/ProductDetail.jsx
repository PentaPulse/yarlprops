import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Alert, CircularProgress } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity='error'>{error}</Alert>
  if(!product) return null;

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5">{product.title}</Typography>
      <Typography variant="body1">Category: {product.category}</Typography>
      <Typography variant="body1">Type: {product.type}</Typography>
      <Typography variant="body1">Description: {product.description}</Typography>
      {product.image && (
        <img 
          src={`/uploads/${product.image}`} 
          alt={product.title} 
          style={{ maxWidth: '100%', marginTop: '16px' }}
        />
      )}
    </Paper>
  );
};

export default ProductDetail;
