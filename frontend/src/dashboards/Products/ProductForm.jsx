import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addProduct, fetchSelectedProduct, updateProduct } from '../../api/db/products';
import { storage } from '../../api/firebase';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from 'sweetalert2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const ProductForm = ({ pid, onSuccess, onCancel }) => {
  const [product, setProduct] = useState({ 
    title: '', 
    category: '', 
    type: '', 
    description: '', 
    quantity: '', 
    location: '',
    status: '', 
    images: [

    ], 
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (pid) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchSelectedProduct(pid);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
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

  const handleStatusChange = (event) => {
    setProduct({ ...product, status: event.target.value });
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImages([...newImages, file]);
    }
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
    if (totalImages < 3 || totalImages > 5) {
      setValidationMessage('You must upload at least 3 images and no more than 5 images.');
      return;
    }

    if (product.quantity <= 1) {
      setValidationMessage('Quantity must be greater than 1 or equal to 1.');
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
        console.log("Stage 2",product)
        
        await addProduct({...product, images: allImageUrls });
      }

      Swal.fire({
        icon: 'success',
        title: 'Product saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form state
      setProduct({ 
        title: '', 
        category: '', 
        type: '', 
        description: '', 
        quantity: '', 
        location: '',
        status: '', 
        images: [] });
      setExistingImages([]);
      setNewImages([]);
      onSuccess();

    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error saving product',
        text: e.message,
      });
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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

        <FormControl component="fieldset" sx={{ ml: "14px" }}>
        <FormLabel component="legend">Status :</FormLabel>
        <RadioGroup 
          row 
          aria-label="status" 
          name="status"
          value={product.status}
          onChange={handleStatusChange}
          required
        >
          <FormControlLabel value="For Rent" control={<Radio />} label="For Rent" />
          <FormControlLabel value="For Sale" control={<Radio />} label="For Sale" />
          <FormControlLabel
            value="Sold Out"
            
            control={<Radio />}
            label="Sold Out!"
          />
        </RadioGroup>
        </FormControl><br/>

        <Button
          accept='image/*'
          multiple
          onChange={handleImageChange}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          style={{ marginTop:'15px', marginBottom: '25px' }}
        >
        Upload file
        <VisuallyHiddenInput type="file" />
        </Button>
        
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
        <Button type="submit" variant="contained" color="success" style={{ marginTop: '25px' }}>
          Save
        </Button>
        <Button onClick={onCancel} variant="outlined" style={{ marginTop: '25px', marginLeft: '10px' }}>
          Cancel
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
