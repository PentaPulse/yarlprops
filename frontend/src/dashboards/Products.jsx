import { useState } from 'react';
//import { addProduct } from '../../../backend/db/products';
import { Button, Container, Input, TextField, Typography } from '@mui/material';
import ProductForm from './Products/ProductForm';
//import { uploadImagesAndGetUrls } from '../../../backend/storage';

function Products() {
    return (
        <div>
            {<ProductForm/>}
        </div>
    )
}

export default Products
