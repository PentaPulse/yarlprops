import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import ProductDetail from '../Products/ProductDetail';
import ProductForm from '../Products/ProductForm';
import { Container, Button } from '@mui/material';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { pathname } = window.location;

  const handleNavigation = () => {
    if (pathname === '/admin/products/add-product') {
      navigate('/admin/products');
    } else {
      navigate('/admin/products/add-product');
    }
  };

  const handleSuccess = () => {
    navigate('/admin/products');
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigation}
        style={{ margin: '20px 0' }}
      >
        {pathname === '/admin/products/add-product' ? "Back to Product List" : "Add Product"}
      </Button>
      <Container>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:pid" element={<ProductDetail />} />
          <Route path="/add-product" element={<ProductForm onSuccess={handleSuccess} />} />
          <Route path="/products/:pid/edit" element={<ProductForm onSuccess={handleSuccess} />} />
        </Routes>
      </Container>
    </>
  );
};

export default AdminProducts;
