import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { collection, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({title:'', category:'', type:'', description: '', images: [] });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');


  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setProduct(docSnap.data());
          setImageURL(docSnap.data().image || []);
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

    const productData = {
      title: product.title,
      category: product.category,
      type: product.type,
      description: product.description,
      image: imageUrl,
    };

    if(id){
      await updateDoc(doc(db, 'products', id), productData);
    } else {
      await addDoc(collection(db, 'products'), productData);
    }
    navigate('/products');
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
        />
        <TextField
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Type"
          name="type"
          value={product.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <input 
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageChange}
        />
        <Grid container spacing={2}>
          {imagePreviews.map((src, index) => (
            <Grid item key={index}>
              <img src={src} alt={`Preview ${index}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
            </Grid>
          ))}
        </Grid>
        {validationMessage && <Typography color="error">{validationMessage}</Typography>}
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
