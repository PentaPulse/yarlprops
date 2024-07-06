import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import ProductDetail from '../Products/ProductDetail';
import ProductForm from '../Products/ProductForm';
import Navbar from '../Products/Navbar'; // Ensure the correct path
import { Container, Button } from '@mui/material';

const AdminProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();

  const toggleAddProduct = () => {
    setShowAddProduct(!showAddProduct);
  };

  const handleSuccess = () => {
    navigate('admin/products');
  }

  return (
    <>
      <Navbar />
      <Button
          variant="contained"
          color="primary"
          onClick={toggleAddProduct}
          style={{ margin: '20px 0' }}
        >
          {showAddProduct ? "Back to Product List" : "Add Product"}
      </Button>
      <Container>
        {showAddProduct ? (
          <ProductForm onSuccess={() => setShowAddProduct(false)} />
        ) : (
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:pid" element={<ProductDetail />} />
            <Route path="/add-product" element={<ProductForm onSuccess={handleSuccess}/>} />
            <Route path="/products/:pid/edit" element={<ProductForm onSuccess={handleSuccess}/>} />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default AdminProducts;



//import { useState } from 'react';
//import { addProduct } from '../../../../backend/db/products';
//import { Button, Container, Input, TextField, Typography } from '@mui/material';
//import { uploadImagesAndGetUrls } from '../../../../backend/storage';

// const ProductForm = () => {
//     const [productId, setProductId] = useState('');
//     const [name, setName] = useState('');
//     const [category, setCategory] = useState('');
//     const [type, setType] = useState('');
//     const [location, setLocation] = useState('');
//     const [price, setPrice] = useState('');
//     const [description, setDescription] = useState('');
//     const [imageFiles, setImageFiles] = useState([]);
//     const [address, setAddress] = useState('');

//     const handleFileChange = (e) => {
//         setImageFiles(e.target.files);
//     };
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const folderPath = `storage/a/propictures/${productId}`;
//         const imageArray = await uploadImagesAndGetUrls(Array.from(imageFiles), folderPath);
//         await addProduct(name, category, type, location, parseFloat(price), description, imageArray, address);
//         alert('Product added successfully!');
//         // Clear form fields after submission
//         setProductId('');
//         setName('');
//         setCategory('');
//         setType('');
//         setLocation('');
//         setPrice('');
//         setDescription('');
//         setImageFiles([]);
//         setAddress('');
//     };

//     return (
//         <Container maxWidth="sm">
//             <Typography variant="h4" gutterBottom>Add Product</Typography>
//             <form onSubmit={handleSubmit}>
//                 <TextField
//                     label="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Type"
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Location"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Price"
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <Input
//                     type="file"
//                     inputProps={{ multiple: true }}
//                     onChange={handleFileChange}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <TextField
//                     label="Address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     fullWidth
//                     margin="normal"
//                     required
//                 />
//                 <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
//             </form>
//         </Container>
//     );
// };
