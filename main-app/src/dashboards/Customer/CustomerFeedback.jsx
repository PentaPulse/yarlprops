import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Rating,  // Import Rating component
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";
import { useAlerts } from "../../api/AlertService";
import { fetchFeedbacks, getOrderDetails, sendFeedback } from "../../api/db/feedback";
import { fetchOrders } from "../../api/db/orders";
import formatDate from "../../components/date/dateTime";
import { addItemRating } from "../../api/db/ratings"; // Add the function to update item ratings

export default function FeedbackPage() {
  const { showAlerts } = useAlerts();
  const [feedbacks, setFeedbacks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const { merchantName, productName, order } = location.state || {};
  const [feedback, setFeedback] = useState({
    title: "",
    content: "",
    merchantName: merchantName || "",
    productName: productName || "",
    rating: 0, // Add rating field
  });

  const theme = useTheme();

  useEffect(() => {
    if (order) {
      selectOrder(order);
    }
    const fetchOrderList = async () => {
      try {
        const data = await fetchOrders(user);
        setOrderList(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchOrderList();

    const fetchFeedback = async () => {
      const fData = await fetchFeedbacks(user.uid);
      setFeedbacks(fData);
    };
    fetchFeedback();
  }, [user.uid, refresh]);

  const selectOrder = async (order) => {
    try {
      const details = await getOrderDetails(order);
      setSelectedOrder({ ...order, displayName: details });
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleOrderChange = (event) => {
    const orderId = event.target.value;
    const order = orderList.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      merchantName: order?.merchantName || "",
      productName: order?.productName || "",
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOrder) {
      showAlerts("Please select an order", "error");
      return;
    }

    const newFeedback = {
      id: feedbacks.length + 1,
      title: feedback.title,
      content: feedback.content,
      merchantName: feedback.merchantName,
      productName: feedback.productName,
      date: new Date().toISOString().split("T")[0],
      userId: user.uid,
      merchantId: selectedOrder.merchId,
      itemId:selectedOrder.itemId,
      rating: feedback.rating, 
    };

    try {
      //await sendFeedback(user.uid, selectedOrder.merchId, newFeedback);
      await sendFeedback(user.uid,selectedOrder.merchId,selectedOrder.itemId,selectedOrder.itemType,newFeedback)
      await addItemRating(selectedOrder.itemId,selectedOrder.itemType, feedback.rating); 
      showAlerts("Feedback and rating submitted successfully", "success");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showAlerts("Failed to submit feedback", "error");
    }
  };

  const isFormValid = feedback.content && feedback.rating > 0;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Feedback
      </Typography>

      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Submit Your Feedback
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel>Order</InputLabel>
          <Select
            name="order"
            value={selectedOrder?.id || ""}
            onChange={handleOrderChange}
            label="Order"
          >
            {orderList.map((order) => (
              <MenuItem key={order.id} value={order.id} onClick={() => selectOrder(order)}>
                {order.title} - {order.merchName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedOrder && (
          <Box sx={{ mt: 2, mb: 2, p: 2, border: "1px solid grey", borderRadius: 2 }}>
            <Typography variant="h6">Order Details</Typography>
            <Typography>
              <strong>Order date:</strong> {formatDate(selectedOrder.date)}
            </Typography>
            <Typography>
              <strong>Product:</strong> {selectedOrder.title}
            </Typography>
            <Typography>
              <strong>Merchant:</strong> {selectedOrder.displayName}
            </Typography>
            <Typography>
              <strong>Quantity:</strong> {selectedOrder.itemQuantity}
            </Typography>
            <Typography>
              <strong>Status:</strong> {selectedOrder.status}
            </Typography>
          </Box>
        )}

        <TextField
          required
          fullWidth
          label="Feedback Title"
          name="title"
          value={feedback.title}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          required
          fullWidth
          label="Feedback Content"
          name="content"
          value={feedback.content}
          onChange={handleInputChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        {/* Add Rating Field */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography component="legend">Rate the Product</Typography>
          <Rating
            name="rating"
            value={feedback.rating}
            onChange={(event, newValue) => {
              setFeedback((prevFeedback) => ({
                ...prevFeedback,
                rating: newValue,
              }));
            }}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
          sx={{
            display: "block",
            margin: "0 auto",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "#000",
            backdropFilter: "blur(8px)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            },
          }}
        >
          Submit Feedback
        </Button>
      </Box>

      {feedbacks.length > 0 ? (
        <Grid container spacing={4}>
          {feedbacks.map((fb) => (
            <Grid item xs={12} sm={6} key={fb.id}>
              <Card
                sx={{
                  maxWidth: 345,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: theme.palette.text.primary,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeedbackIcon
                      sx={{
                        color: "#1976d2",
                        fontSize: 40,
                        marginRight: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="h6">{fb.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {fb.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Merchant: {fb.merchantName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Product: {fb.productName}
                  </Typography>
                  <Typography variant="body1">{fb.content}</Typography>
                  <Typography variant="body2">Rating: {fb.rating}</Typography> {/* Display Rating */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
          No feedback available. Be the first to submit your feedback!
        </Typography>
      )}
    </Container>
  );
}
