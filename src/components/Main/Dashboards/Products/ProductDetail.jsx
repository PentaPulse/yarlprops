import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Paper, Typography, CircularProgress } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()){
        setProduct(docSnap.data());
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <CircularProgress />;
  
  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h5">{product.title}</Typography>
      <Typography variant="body1">Category: {product.category}</Typography>
      <Typography variant="body1">Type: {product.type}</Typography>
      <Typography variant="body1">Description: {product.description}</Typography>
      {product.image && (
        <img 
          src={product.image} 
          alt={product.title} 
          style={{ maxWidth: '100%', marginTop: '16px' }}
        />
      )}
    </Paper>
  );
};

export default ProductDetail;
