import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, fetchSelectedProduct, updateProduct } from '../../../../backend/db/products';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../backend/firebase';

const ProductForm = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ title: '', category: '', type: '', description: '', quantity: '', location: '', images: [] });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (pid) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(pid);
        if (fetchedProduct) {
          setProduct({
            title: fetchedProduct.title,
            category: fetchedProduct.category,
            type: fetchedProduct.type,
            description: fetchedProduct.description,
            quantity: fetchedProduct.quantity,
            location: fetchedProduct.location,
            images: fetchedProduct.images || []
          });
          setExistingImages(fetchedProduct.images || []);
        } else {
          console.log('No such document!');
        }
      };
      fetchProduct();
    }
  }, [pid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.name);
    if (validFiles.length !== files.length) {
      setValidationMessage('One or more of the selected files are invalid.');
      return;
    }
    setNewImages([...newImages, ...validFiles]);
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'existing') {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
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
      // Upload new images and get their URLs
      const newImageUrls = await Promise.all(newImages.map(async (image) => {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      }));

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Add or update product with the combined image URLs
      if (pid) {
        await updateProduct(pid, { ...product, images: allImageUrls });
      } else {
        const productId = await addProduct(product.title, product.category, product.type, product.description, product.quantity, product.location, allImageUrls);
        console.log('Product added with ID:', productId);
      }

      // Reset form state
      setProduct({ title: '', category: '', type: '', description: '', quantity: '', location: '', images: [] });
      setExistingImages([]);
      setNewImages([]);

      // Navigate to product list
      navigate('/');
    } catch (e) {
      console.error("Error adding product:", e);
      setValidationMessage('An error occurred while adding the product. Please try again.');
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">{pid ? 'Edit Product' : 'Add Product'}</Typography>
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
