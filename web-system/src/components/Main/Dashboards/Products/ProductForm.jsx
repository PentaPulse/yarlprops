import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, fetchSelectedProduct, updateProduct } from '../../../../backend/db/products';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../backend/storage';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ title: '', category: '', type: '', description: '', quantity: '', location: '', images: [] });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setExistingImages(fetchedProduct.images || []);
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
    const file = event.target.files[0];
    if (file) {
      if (!file.name) {
        console.error('File is missing a name property:', file);
        setValidationMessage('One of the selected files is invalid.');
        return;
      }
      setNewImages([...newImages, file]);

      // const preview = URL.createObjectURL(file);
      // setProduct((prevProduct) => ({
      //   ...prevProduct,
      //   images: [...prevProduct.images, preview],
      // }));
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(existingImages.filter((_, i) => i !== index));
      // setProduct((prevProduct) => ({
      //   ...prevProduct,
      //   images: prevProduct.images.filter((_, i) => i !== index),
      // }));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
      // setProduct((prevProduct) => ({
      //   ...prevProduct,
      //   images: prevProduct.images.filter((_, i) => i !== index + existingImages.length),
      // }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const totalImages = existingImages.length + newImages.length;
    if (totalImages < 3 || totalImages > 6) {
      setValidationMessage('You must have at least 3 images and no more than 6 images.');
      return;
    }

    setValidationMessage('');

    try {
      const newImageUrls = await Promise.all(newImages.map(async (image) => {  
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      return await getDownloadURL(imageRef);
    }));

    const allImageUrls = [...existingImages, ...newImageUrls];

    
      if (id) {
        await updateProduct(id, { ...product, images: allImageUrls });
      } else {
        await addProduct({ ...product, images: allImageUrls });
      }
      setProduct({ title: '', category: '', type: '', description: '', quantity: '', location: '', images: [] });
      setExistingImages([]);
      setNewImages([]);
      navigate('/admin/products');
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
          onChange={handleImageChange}
          style={{ display: 'block', margin: '20px 0' }}
        />
        <Grid container spacing={2}>
          {existingImages.map((src, index) => (
            <Grid item key={index}>
              <div style={{ position: 'relative' }}>
                <img src={src} alt={`Existing Preview ${index}`} style={{ width: 150, height: 100, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'existing')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
          {newImages.map((file, index) => (
            <Grid item key={index + existingImages.length}>
              <div style={{ position: 'relative' }}>
                <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} style={{ width: 150, height: 120, objectFit: 'cover' }} />
                <Button
                  onClick={() => handleRemoveImage(index, 'new')}
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  X
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error">{validationMessage}</Typography>}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '25px' }}>
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
