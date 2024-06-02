import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, fetchSelectedProduct } from '../../../../backend/db/products';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../backend/storage';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({title:'', category:'', type:'', description: '', quantity: '', location: '', images: [] });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');


  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(id);
        if(fetchedProduct){
          setProduct(fetchedProduct);
          setImagePreviews(fetchedProduct.image || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setProduct({ ...product, image: files });

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (product.images.length < 3 || product.images.length > 6) {
      setValidationMessage('You must upload at least 3 images and no more than 6 images.');
      return;
    }

    setValidationMessage(''); // Clear validation message if validation passes

    const imageUrls = await Promise.all(product.images.map(async (image) => {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      return await getDownloadURL(imageRef);
    }));

    try {
      await addProduct(product.title, product.category, product.type, product.description, product.quantity, product.location, imageUrls);
      setProduct({ title: '', category: '', type: '', description: '', quantity: '', location: '', images: [] });//Clear the form data
      setImagePreviews([]); //Clear the image previews
      navigate('/products');
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">{id ? 'Edit Product' : 'Add Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={product.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Type"
          name="type"
          value={product.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Location"
          name="location"
          value={product.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <input 
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageChange}
          required
        />
        <Grid container spacing={2}>
          {imagePreviews.map((src, index) => (
            <Grid item key={index}>
              <img src={src} alt={`Preview ${index}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error">{validationMessage}</Typography>}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop : '25px'}}>
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
