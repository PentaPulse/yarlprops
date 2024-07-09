import React, { useState } from 'react';
import ProductList from '../Products/ProductList';
import ProductDetail from '../Products/ProductDetail';
import ProductForm from '../Products/ProductForm';
import { Container, Button } from '@mui/material';

const AdminProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);

  const handleAddProduct = () =>{
    setEditingProductId(null);
    setShowAddProduct(true);
    setViewingProductId(null);
  }

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setShowAddProduct(true);
    setViewingProductId(null);
  }

  const handleViewProduct = (productId) => {
    setViewingProductId(productId);
    setShowAddProduct(false);
  }

  const handleSuccess = () => {
    setShowAddProduct(false);
    setViewingProductId(null);
  };

  const handleCancel = () => {
    setShowAddProduct(false);
    setViewingProductId(null);
  };

  return (
    <>
      <h2>PRODUCTS</h2>
      <Button
        variant="contained"
        color="success"
        onClick={handleAddProduct}
        style={{ margin: '20px' }}
      >
        {showAddProduct ? "Back to Product List" : "Add Product"}
      </Button>
      <Container>
        {showAddProduct ? (
          <ProductForm pid={editingProductId} onSuccess={handleSuccess} onCancel={handleCancel} />
        ) : viewingProductId? (
          <ProductDetail pid={viewingProductId} onBack={handleCancel} />
        ):(
          <ProductList onEditProduct={handleEditProduct} onViewProduct={handleViewProduct}/>
        )}
      </Container>
    </>
  );
};

export default AdminProducts;
