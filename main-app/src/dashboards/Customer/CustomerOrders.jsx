import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../api/AuthContext";
import { useNavigate } from "react-router-dom"; // Add navigation hook
import { fetchOrders } from "../../api/db/orders";


export default function MyOrders() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchOdata = async () => {
      try {
        const data = await fetchOrders(user.uid)
        setOrders(data);
      } catch (e) {
        console.error("Error fetching product orders:", e);
      }
    };
    fetchOdata();
  }, [user.uid]);

  const handleFeedbackClick = (order) => {
    navigate("/d/feedback", { state: {
        merchantName:order.merchantId,
        productName:order.title,
        order:order
     } }); }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={4}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.pid}>
              <Card
                sx={{
                  minWidth: '300px',
                  maxHeight:'500px',
                  width:'100%',
                  height:'auto',
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? order.status === "Completed"
                        ? "#1e1e1e"
                        : "#333333"
                      : order.status === "Completed"
                      ? "#e8f5e9"
                      : "#ffebee",
                }}
              >
               <CardMedia
  component="img"
  image={order.itemImage}
  alt={order.title}
  sx={{
    objectFit: 'cover',
    height: {
      xs: '17rem', // Smaller height for extra-small screens
      sm: '18rem', // Slightly larger for small screens
      md: '15rem', // Default height for medium screens and above
      lg:'17rem'
    },
    width: '100%', // Ensure the image takes full width of the card
  }}
/>

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    {order.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#b0bec5" : "#616161",
                    }}
                  >
                    Quantity: {order.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#b0bec5" : "#616161",
                    }}
                  >
                    Price: Rs.{order.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#b0bec5" : "#616161",
                      fontWeight: "bold",
                    }}
                  >
                    Status: {order.status}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    pb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#ffffff", }}
                    color={
                      order.status === "completed"
                        ? "success"
                        : "warning"
                    }
                  >
                    {order.status === "completed"
                      ? "Completed"
                      : "Pending"}
                  </Button>
                  {/* <Link to="/d/feedback"> */}
                  {order.status === "completed" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleFeedbackClick(order)}
                      sx={{
                        color: theme.palette.mode === "dark" ? "#ffffff" : "#ffffff", // Adjust color based on theme
                        backgroundColor: theme.palette.mode === "dark" ? "#1565c0" : "#1976d2", // Dark blue for dark mode
                        "&:hover": {
                          backgroundColor: theme.palette.mode === "dark" ? "#0d47a1" : "#115293", // Adjust hover color
                        },
                      }}
                    >
                      Send Feedback
                    </Button>
                    
                  )}
                  {/* </Link> */}
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No orders to show</Typography>
        )}
      </Grid>
    </Container>
  );
}
