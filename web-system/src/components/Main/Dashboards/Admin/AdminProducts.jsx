import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import ProductDetail from '../Products/ProductDetail';
import ProductForm from '../Products/ProductForm';
import { Container, Button } from '@mui/material';

const AdminProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();

  const toggleAddProduct = () =>{
    setShowAddProduct(!showAddProduct);
  }

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <>
      <h2>PRODUCTS</h2>
      <Button
        variant="contained"
        color="success"
        onClick={toggleAddProduct}
        style={{ margin: '20px' }}
      >
        {showAddProduct ? "Back to Product List" : "Add Product"}
      </Button>
      <Container>
        {showAddProduct ? (
          <ProductForm onSuccess={() => setShowAddProduct(false)} />
        ) : (
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:pid" element={<ProductDetail />} />
          <Route path="/add-product" element={<ProductForm onSuccess={handleSuccess} />} />
          <Route path="/product/:pid/edit" element={<ProductForm onSuccess={handleSuccess} />} />
        </Routes>
        )}
      </Container>
    </>
  );
};

export default AdminProducts;
