import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, CircularProgress, Alert } from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);    
    const [totalProducts, setTotalProducts] = useState(0);    
    const [loading, setLoading] = useState(true);    
    const [error, setError] = useState(null);    


    useEffect(() => {
        setLoading(true);
        axios.get(`/products?page=${page + 1}&limit=${rowsPerPage}`)
        .then(response => {
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
            setLoading(false);
        })
        .catch(error => {
            setError('Failed to fetch products');
            setLoading(false);
        });
    }, [page, rowsPerPage]);

    const handleDelete = (id) => {
        axios.delete(`/products/${id}`)
        .then(() => setProducts(products.filter(product => product.id !== id)))
        .catch(error => console.error(error));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Paper>
            <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.title}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.type}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>
                                <Button component={Link} to={`/products/${product.id}`} variant="outlined">View</Button>
                                <Button component={Link} to={`/products/${product.id}/edit`} variant="outlined">Edit</Button>
                                <Button onClick={() => handleDelete(product.id)} variant="outlined" color="secondary">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProducts} // Ideally, this should come from the API as well
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
    );
};

export default ProductList;
