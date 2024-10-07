import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, useTheme } from '@mui/material';

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
    const theme = useTheme(); // Get theme to handle dark/light mode dynamically

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
                        <Card sx={{ 
                            maxWidth: 345, 
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? (order.status === 'Completed' ? '#1e1e1e' : '#333333') 
                                : (order.status === 'Completed' ? '#e8f5e9' : '#ffebee')
                        }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={order.imageUrl}
                                alt={order.product}
                            />
                            <CardContent>
                                <Typography 
                                    gutterBottom 
                                    variant="h5" 
                                    component="div"
                                    sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}
                                >
                                    {order.product}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: theme.palette.mode === 'dark' ? '#b0bec5' : '#616161' }}
                                >
                                    Quantity: {order.quantity}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: theme.palette.mode === 'dark' ? '#b0bec5' : '#616161' }}
                                >
                                    Price: Rs.{order.price}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ color: theme.palette.mode === 'dark' ? '#b0bec5' : '#616161', fontWeight: 'bold' }}
                                >
                                    Status: {order.status}
                                </Typography>
                            </CardContent>
                            <Box sx={{ textAlign: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    color={order.status === 'Completed' 
                                        ? (theme.palette.mode === 'dark' ? 'success' : 'success') 
                                        : (theme.palette.mode === 'dark' ? 'warning' : 'warning')
                                    }
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
