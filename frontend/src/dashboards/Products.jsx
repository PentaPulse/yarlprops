import { useState } from 'react';
//import { addProduct } from '../../../backend/db/products';
import { Button, Container, Input, TextField, Typography } from '@mui/material';
//import { uploadImagesAndGetUrls } from '../../../backend/storage';
import ProductForm from '../Dashboards/Products/ProductForm';

function Products() {
    return (
        <div>
            {<ProductForm/>}
        </div>
    )
}

export default Products
