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
import { fetchProductOrders } from "../../api/db/products"; // Import the API function
import { useAuth } from "../../api/AuthContext"; // For accessing authenticated user
import { arrayUnion } from "firebase/firestore";
import { fetchRentalOrders } from "../../api/db/rentals";

export default function MyOrders() {
  const theme = useTheme(); // Get theme to handle dark/light mode dynamically
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); // Get the authenticated user

  useEffect(() => {
    const fetchOdata = async () => {
      try {
        // Fetch product orders for the logged-in user
        const data = await fetchProductOrders(user.uid);
        setOrders([...orders, data]);
        const rdata = await fetchRentalOrders(user.uid);
        setOrders([...orders, rdata]);
      } catch (e) {
        console.error("Error fetching product orders:", e);
      }
    };
    fetchOdata();
  }, [user.uid]);

  return (
    <Container>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {/* Orders Grid */}
      <Grid container spacing={4}>
        {orders.length > 0
          ? orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.pid}>
                <Card
                  sx={{
                    maxWidth: 345,
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
                    height="140"
                    //image={order.images[0]} // Display first image from images array
                    alt={order.title}
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
                      Quantity: {order.title}
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
                  <Box sx={{ textAlign: "center", pb: 2 }}>
                    <Button
                      variant="contained"
                      color={
                        order.status === "Completed"
                          ? theme.palette.mode === "dark"
                            ? "success"
                            : "success"
                          : theme.palette.mode === "dark"
                          ? "warning"
                          : "warning"
                      }
                    >
                      {order.status === "Completed"
                        ? "View Details"
                        : "Pending"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          : "No orders to show"}
      </Grid>
    </Container>
  );
}
