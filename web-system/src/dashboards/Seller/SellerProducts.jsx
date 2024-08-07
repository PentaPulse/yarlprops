import React from 'react'
import { Container } from 'react-bootstrap'
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

const productData = [
  { id: 1, description: 'Damro Plastic Table', quantity: '4', unitPrice: '$120', size: '3x3' },
  { id: 2, description: 'plastic chair', quantity: '2', unitPrice: '$80', size: '2X2' },
  { id: 3, description: 'UOJ T-shirt', quantity: '50', unitPrice: '$6', size: 'S M L Xl XXl' },
  { id: 4, description: 'UOJ Band', quantity: '100', unitPrice: '$0.8', size: 'S M L' },
];

const handleDelete = [];
const onEditProduct = [];

function SellerProducts() {
  return (
    <Container>
      <Box sx={{p:3}}>
        <Grid item xs={12}>
          
        <Grid item xs={12}>
                    <Paper sx={{ margin: 4 }}>
                        <Typography variant="h6">Product List</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Unit price</TableCell>
                                        <TableCell>Size</TableCell>
                                        {/* <TableCell>Category</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productData.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>{product.quantity}</TableCell>
                                            <TableCell>{product.unitPrice}</TableCell>
                                            <TableCell>{product.size}</TableCell>
                                            <TableCell align="center">
                                                <Button onClick={() => onEditProduct(product.id)} variant="outlined" >Edit</Button>
                                                <Button onClick={() => handleDelete(product.id)} variant="outlined" >Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default SellerProducts
