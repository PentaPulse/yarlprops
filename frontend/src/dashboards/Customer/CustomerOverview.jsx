import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../../api/AuthContext';

export default function UserOverview  ()  {
    const {user} = useAuth()
    console.log(user)
    return (
        <Container>
            {/* Welcome Message */}
            <Typography variant="h4" gutterBottom>
                Welcome, <b>{user.displayName}!</b>
            </Typography>
            
            {/* Orders Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Order ID</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Product</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell component="th" scope="row">
                                    {order.id}
                                </TableCell>
                                <TableCell align="right">{order.product}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
                                <TableCell align="right">Rs.{order.price}</TableCell>
                                <TableCell align="right">{order.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

// Example usage with sample data
const orders = [
    { id: 1, product: 'Bicycle Rental', quantity: 1, price: 15.00, status: 'Completed' },
    { id: 2, product: 'Furniture Rental', quantity: 2, price: 50.00, status: 'Pending' },
    { id: 3, product: 'Food Service', quantity: 3, price: 30.00, status: 'Completed' },
];