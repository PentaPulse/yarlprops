
import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };
  
  const addProduct = () => {
    if (currentProduct.name && currentProduct.price) {
      setProducts([...products, { ...currentProduct, id: products.length + 1 }]);
      setCurrentProduct({ id: null, name: '', price: '' });
    }
  };

  const editProduct = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const updateProduct = () => {
    setProducts(products.map((product) => (product.id === currentProduct.id ? currentProduct : product)));
    setCurrentProduct({ id: null, name: '', price: '' });
    setIsEditing(false);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Management
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          name="name"
          label="Product Name"
          value={currentProduct.name}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <TextField
          name="price"
          label="Product Price"
          value={currentProduct.price}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={isEditing ? updateProduct : addProduct}
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editProduct(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteProduct(product.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Products