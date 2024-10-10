import React from 'react';
import { Container, Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../api/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MessageIcon from '@mui/icons-material/Message';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function CustomerOverview() {
    const { user } = useAuth();
    console.log(user);

    return (
        <Container>
            {/* Welcome Message */}
            <Typography variant="h4" gutterBottom>
                Welcome, <b>{user.displayName}!</b>
            </Typography>

            {/* Overview Summary */}
            <Grid container spacing={4}>

                {/* Active Listings */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <ShoppingCartIcon fontSize="large" />
                        <Typography variant="h6">Complete orders</Typography>
                        <Typography variant="h5">5</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>

                {/* Pending Requests */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <AssignmentIcon fontSize="large" />
                        <Typography variant="h6">Pending Orders</Typography>
                        <Typography variant="h5">2</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>

                {/* New Messages */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <MessageIcon fontSize="large" />
                        <Typography variant="h6">New Messages</Typography>
                        <Typography variant="h5">3</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>

                {/* Feedback */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <FeedbackIcon fontSize="large" />
                        <Typography variant="h6">Feedback</Typography>
                        <Typography variant="h5">1</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>
            </Grid>

            {/* Add more sections or summaries as needed */}
            <Box mt={4}>
                <ProductGotOrders/>
                <RentalGotOrders/>
                <ServiceGotOrders/>
            </Box>
        </Container>
    );
};

function ProductGotOrders(){
    return(
        <>
        <Typography>Order histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
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
                        
                            <TableRow >
                                <TableCell component="th" scope="row">
                                    {}
                                </TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                            </TableRow>
                    
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
function RentalGotOrders(){
    return(
        <>
        <Typography>Rental histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Rental ID</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Product</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                            <TableRow >
                                <TableCell component="th" scope="row">
                                    {}
                                </TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                            </TableRow>
                    
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
function ServiceGotOrders(){
    return(
        <>
        <Typography>Service histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Service ID</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Service</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Time</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                            <TableRow >
                                <TableCell component="th" scope="row">
                                    {}
                                </TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                            </TableRow>
                    
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}