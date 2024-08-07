import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Paper, Typography } from '@mui/material';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/products/${id}`)
        .then(response => {
          const product = response.data;
          setTitle(product.title);
          setCategory(product.category);
          setType(product.type);
          setDescription(product.description);
          setImagePreview(product.image); // assuming the response has an image URL
        })
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('type', type);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    const submitAction = id ? axios.put : axios.post;
    const url = id ? `/api/products/${id}` : 'http://localhost:4000/products/new';

    submitAction(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => navigate('/products'))
      .catch(error => console.error(error));
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">{id ? 'Edit Product' : 'Add Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category"
          name="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Type"
          name="type"
          value={type}
          onChange={e => setType(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <input 
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          style={{ margin: '16px 0' }}
        />
        {imagePreview && (
          <div>
            <img 
              src={imagePreview}
              alt="Image Preview"
              style={{ width: '50%' }}
            />
          </div>
        )}
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
