import React from 'react';
import { Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Container } from 'react-bootstrap';

const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
    { name: 'Aug', sales: 2000 },
    { name: 'Sep', sales: 2780 },
    { name: 'Oct', sales: 1890 },
    { name: 'Nov', sales: 2390 },
    { name: 'Dec', sales: 3490 },
];

const orderData = [
    { id: 1, customer: 'John Doe', product: 'Laptop', amount: '$1200', status: 'Shipped' },
    { id: 2, customer: 'Jane Smith', product: 'Phone', amount: '$800', status: 'Processing' },
    { id: 3, customer: 'Bob Johnson', product: 'Tablet', amount: '$500', status: 'Delivered' },
    { id: 4, customer: 'Alice Brown', product: 'Monitor', amount: '$300', status: 'Cancelled' },
];




function SellerOverview() {
    return (
        <Container>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ marginTop: 1, marginRight: 4, marginBottom: 1, marginLeft: 4 }}>
                            <Typography variant="h6">Sales</Typography>
                            <Typography variant="body1">$10,000</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ marginTop: 1, marginRight: 4, marginBottom: 1, marginLeft: 4 }}>
                            <Typography variant="h6">Orders</Typography>
                            <Typography variant="body1">150</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ marginTop: 1, marginRight: 4, marginBottom: 1, marginLeft: 4 }}>
                            <Typography variant="h6">Products</Typography>
                            <Typography variant="body1">300</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Paper  sx={{ margin: 4 }}>
                        <Typography variant="h6">Sales Chart</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ margin: 4 }}>
                        <Typography variant="h6">Recent Orders</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderData.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>{order.product}</TableCell>
                                            <TableCell>{order.amount}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

            </Box>


        </Container>



    )
}

export default SellerOverview