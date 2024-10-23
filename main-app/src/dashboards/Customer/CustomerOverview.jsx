import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../api/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { fetchFeedbackCount, fetchOrderCount, fetchOrders } from '../../api/db/orders';




export default function CustomerOverview() {
    const { user } = useAuth();
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [feedbackCount, setFeedBackCount] = useState(0);
    //const [merchant,setMerchant]=useState('')

   


    useEffect(() => {
        const fetchOrdersCount = async () => {
            try {
                setCompletedCount(await fetchOrderCount(user.uid, "completed"));
                setPendingCount(await fetchOrderCount(user.uid, "pending"));
                setFeedBackCount(await fetchFeedbackCount(user.uid));
            } catch (error) {
                console.error("Error fetching order counts:", error);
            }
        };
        fetchOrdersCount();
    }, [user.uid]);

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
                        <Typography variant="h6">Completed orders</Typography>
                        <Typography variant="h5">{completedCount}</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>

                {/* Pending Requests */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <AssignmentIcon fontSize="large" />
                        <Typography variant="h6">Pending Orders</Typography>
                        <Typography variant="h5">{pendingCount}</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>

                {/* New Messages 
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <MessageIcon fontSize="large" />
                        <Typography variant="h6">New Messages</Typography>
                        <Typography variant="h5">3</Typography>  Replace with dynamic value 
                    </Paper>
                </Grid>*/}

                {/* Feedback */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                        <FeedbackIcon fontSize="large" />
                        <Typography variant="h6">Feedbacks</Typography>
                        <Typography variant="h5">{feedbackCount}</Typography> {/* Replace with dynamic value */}
                    </Paper>
                </Grid>
            </Grid>

            {/* Add more sections or summaries as needed */}
            <Box mt={4}>
                <OrderHistory />
            </Box>
        </Container>
    );
};

function OrderHistory() {
    const [item, setitem] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOdata = async () => {
            try {
                const pdata = await fetchOrders(user.uid)
                setitem(pdata);
            } catch (e) {
                console.error("Error fetching item orders:", e);
            }
        };
        fetchOdata();
    }, [user.uid]);
    return (
        <>
            <Typography>Order histroy</Typography>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow >
                          
                             <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Index</TableCell>
                             <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Item</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Merchant Name</TableCell>


                             <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Date</TableCell> 
                            {/* <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Price</TableCell> */}
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {item.length > 0 ? (
                            item.slice(0, 5).map((item, index) => (
                                <TableRow key={index}>
                                      <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{item.title}</TableCell>
                                    <TableCell align="center">{item.merchName}</TableCell>
                                    <TableCell align="center">{new Date(item.date).toLocaleDateString()}</TableCell> 
                                    {/* <TableCell align="center">{item.price}</TableCell> */}
                                    <TableCell align="center">{item.status}</TableCell>

                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell >No data available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}