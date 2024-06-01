import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { collection, doc, addDoc, updateDoc, detDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Paper, Typography } from '@mui/material';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({title:'', category:'', type:'', description: '', image: null});
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setProduct(docSnap.data());
          setImageURL(docSnap.data().image);
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
    setProduct({ ...product, image: file});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let imageUrl = imageURL;

    if(product.image){
      const imageRef = ref(storage, `images/${product.image.name}`);
      const snapshot = await uploadBytes(imageRef, product.image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const productData = {
      title: product.title,
      category: product.category,
      type: product.type,
      description: product.description,
      image: imageUrl,
    }

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
          onChange={handleImageChange}
          style={{ margin: '16px 0' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Paper>
  );
};

export default ProductForm;
