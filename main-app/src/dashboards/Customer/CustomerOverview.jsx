import React ,{ useEffect, useState }from 'react';
import { Container, Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../api/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { fetchProductOrders } from "../../api/db/products"; 
import { fetchRentalOrders } from "../../api/db/rentals";
import { fetchServiceOrders } from "../../api/db/services";
import { fetchCount } from '../../api/db/orders';

export default function CustomerOverview() {
    const { user } = useAuth();
    const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [feedbackCount, setFeedBackCount] = useState(0);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        setCompletedCount(await fetchCount(user.uid, "orderstatus", "==", "completed"));
        setPendingCount(await fetchCount(user.uid, "orderstatus", "==", "pending"));
        setFeedBackCount(await fetchCount(user.uid, "orderstatus", "==", "true"));
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
                <ProductGotOrders/>
                <RentalGotOrders/>
                <ServiceGotOrders/>
            </Box>
        </Container>
    );
};

function ProductGotOrders(){
    const [product, setProduct] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOdata = async () => {
      try {
        const pdata = await fetchProductOrders(user.uid);
        
        setProduct(pdata);
      } catch (e) {
        console.error("Error fetching product orders:", e);
      }
    };
    fetchOdata();
  }, [user.uid]);
    return(
        <>
        <Typography>Order histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Product</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {product.length > 0 ? (
                                product.slice(0, 5).map((product, index) => (
                                    <TableRow>
                                        <TableCell align="center">{product.title}</TableCell>
                                        <TableCell  align="center">{product.quantity}</TableCell>
                                        <TableCell  align="center">{product.price}</TableCell>
                                        <TableCell  align="center">{product.status}</TableCell>

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
function RentalGotOrders(){
    const [product, setProduct] = useState([]);
    const { user } = useAuth();
  
    useEffect(() => {
      const fetchOdata = async () => {
        try {
          const rdata = await fetchRentalOrders(user.uid);
          
          setProduct(rdata);
        } catch (e) {
          console.error("Error fetching product orders:", e);
        }
      };
      fetchOdata();
    }, [user.uid]);
    return(
        <>
        <Typography>Rental histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
                <Table>
                    <TableHead>
                        <TableRow>
                           
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Product</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                    {product.length > 0 ? (
                                product.slice(0, 5).map((product, index) => (
                                    <TableRow>
                                        <TableCell align="center">{product.title}</TableCell>
                                        <TableCell  align="center">{product.quantity}</TableCell>
                                        <TableCell  align="center">{product.price}</TableCell>
                                        <TableCell  align="center">{product.status}</TableCell>

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
function ServiceGotOrders(){
    const [product, setProduct] = useState([]);
    const { user } = useAuth();
  
    useEffect(() => {
      const fetchOdata = async () => {
        try {
          const rdata = await fetchServiceOrders(user.uid);
          
          setProduct(rdata);
        } catch (e) {
          console.error("Error fetching product orders:", e);
        }
      };
      fetchOdata();
    }, [user.uid]);
    return(
        <>
        <Typography>Service histroy</Typography>
        <TableContainer component={Paper} sx={{mt:4}}>
                <Table>
                    <TableHead>
                        <TableRow>
                           
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Service</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Time</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'black', color: 'white' }} align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {product.length > 0 ? (
                                product.slice(0, 5).map((product, index) => (
                                    <TableRow>
                                        <TableCell align="center">{product.title}</TableCell>
                                        <TableCell  align="center">{product.quantity}</TableCell>
                                        <TableCell  align="center">{product.price}</TableCell>
                                        <TableCell  align="center">{product.status}</TableCell>

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