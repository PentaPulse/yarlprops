import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button } from '@mui/material';
//import { useAuth } from '../../api/AuthContext';
// Example orders data (replace with actual data)
const orders = [
    {
        id: 1,
        product: 'Bicycle Rental',
        quantity: 1,
        price: 15.00,
        status: 'Completed',
        imageUrl: 'https://example.com/bicycle.jpg',
    },
    {
        id: 2,
        product: 'Furniture Rental',
        quantity: 2,
        price: 50.00,
        status: 'Pending',
        imageUrl: 'https://example.com/furniture.jpg',
    },
    {
        id: 3,
        product: 'Food Service',
        quantity: 3,
        price: 30.00,
        status: 'Completed',
        imageUrl: 'https://example.com/food.jpg',
    },
];

export default function MyOrders() {
  
    return (
        <Container>


            {/* Page Title */}
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {/* Orders Grid */}
            <Grid container spacing={4}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <Card sx={{ maxWidth: 345, backgroundColor: order.status === 'Completed' ? '#e8f5e9' : '#ffebee' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={order.imageUrl}
                                alt={order.product}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {order.product}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Quantity: {order.quantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: Rs.{order.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    Status: {order.status}
                                </Typography>
                            </CardContent>
                            <Box sx={{ textAlign: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    color={order.status === 'Completed' ? 'success' : 'warning'}
                                >
                                    {order.status === 'Completed' ? 'View Details' : 'Track Order'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
