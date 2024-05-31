import { useState } from 'react';
import { addProduct } from '../../../backend/db/products';
import { Button, Container, TextField, Typography } from '@mui/material';

function Products() {
    return (
        <div>
            <ProductForm/>
        </div>
    )
}

const ProductForm = () => {
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageArray, setImageArray] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const images = imageArray.split(',').map(img => img.trim());
        await addProduct(productId, name, category, type, location, parseFloat(price), description, images, address);
        alert('Product added successfully!');
        // Clear form fields after submission
        setProductId('');
        setName('');
        setCategory('');
        setType('');
        setLocation('');
        setPrice('');
        setDescription('');
        setImageArray('');
        setAddress('');
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Add Product</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Images (comma separated URLs)"
                    value={imageArray}
                    onChange={(e) => setImageArray(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
            </form>
        </Container>
    );
};
export default Products
