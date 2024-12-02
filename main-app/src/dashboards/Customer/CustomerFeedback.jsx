import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useAuth } from "../../api/AuthContext";
import { useAlerts } from "../../api/AlertService";
import {
  addFeedback,
  fetchItemReviews,
  fetchRatings,
} from "../../api/db/feedback";
import { fetchOrders } from "../../api/db/orders";
import formatDate from "../../components/date/dateTime";

export default function FeedbackPage() {
  const { user } = useAuth();
  const { showAlerts } = useAlerts();
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedback, setFeedback] = useState({
    title: "",
    content: "",
    rating: 0,
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState({ itemRating: 0, merchantRating: 0 });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const orders = await fetchOrders(user);
        setOrderList(orders);
      } catch (e) {
        console.error("Error fetching orders:", e);
        setOrderList([]);
      }
    };

    fetchInitialData();
  }, [user]);

  useEffect(() => {
    if (selectedOrder) {
      const fetchRelatedData = async () => {
        try {
          const reviews = await fetchItemReviews(selectedOrder.itemId);
          setFeedbacks(reviews);

          const ratingsData = await fetchRatings(
            selectedOrder.itemId,
            selectedOrder.merchantId
          );
          setRatings(ratingsData);
        } catch (e) {
          console.error("Error fetching feedbacks or ratings:", e);
        }
      };

      fetchRelatedData();
    }
  }, [selectedOrder, refresh]);

  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    const order = orderList.find((o) => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOrder) {
      showAlerts("Please select an order", "error");
      return;
    }

    try {
      await addFeedback(
        selectedOrder.itemId,
        selectedOrder.merchantId,
        user.uid,
        feedback.rating,
        feedback.rating, // Assuming the same rating for merchant and item
        {
          ...feedback,
          createdAt: new Date(),
        }
      );
      showAlerts("Feedback and rating submitted successfully", "success");
      setFeedback({ title: "", content: "", rating: 0 });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showAlerts("Failed to submit feedback", "error");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Feedback
      </Typography>

      <Box sx={{ mb: 4, p: 4, border: "1px solid #ccc", borderRadius: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="order-label">Order</InputLabel>
          <Select
            labelId="order-label"
            value={selectedOrder?.id || ""}
            onChange={handleOrderChange}
          >
            <MenuItem value="" disabled>
              Select an order
            </MenuItem>
            {orderList &&
              orderList.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {order.title} - {order.merchantName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {selectedOrder && (
          <Box sx={{ mb: 2, p: 2, border: "1px solid grey", borderRadius: 2 }}>
            <Typography>
              <strong>Order Date:</strong> {formatDate(selectedOrder.date)}
            </Typography>
            <Typography>
              <strong>Product:</strong> {selectedOrder.title}
            </Typography>
            <Typography>
              <strong>Merchant:</strong> {selectedOrder.merchantName}
            </Typography>
            <Typography>
              <strong>Quantity:</strong> {selectedOrder.itemQuantity}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label="Feedback Title"
          name="title"
          value={feedback.title}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Feedback Content"
          name="content"
          value={feedback.content}
          onChange={handleInputChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Typography component="legend">Rate the Product</Typography>
        <Rating
          name="rating"
          value={feedback.rating}
          onChange={(event, newValue) =>
            setFeedback((prev) => ({ ...prev, rating: newValue }))
          }
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!feedback.title || !feedback.content || !feedback.rating}
        >
          Submit Feedback
        </Button>
      </Box>

      {feedbacks.length > 0 ? (
        <Grid container spacing={2}>
          {feedbacks.map((fb) => (
            <Grid item xs={12} sm={6} key={fb.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeedbackIcon sx={{ mr: 2 }} />
                    <Typography variant="h6">{fb.feedback.title}</Typography>
                  </Box>
                  <Typography variant="body1">{fb.feedback.content}</Typography>
                  <Typography variant="body2">
                    Rating: {fb.itemRating}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No feedback available yet.</Typography>
      )}
    </Container>
  );
}
