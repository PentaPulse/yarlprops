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
  Tooltip,
  capitalize,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useAuth } from "../../api/AuthContext";
import { useAlerts } from "../../api/AlertService";
import { addFeedback, fetchItemReviews } from "../../api/db/feedback";
import { fetchOrdersToFeedback } from "../../api/db/orders";
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
  const [ratings, setRatings] = useState({
    itemRating: 2.5,
    merchantRating: 2.5,
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const orders = await fetchOrdersToFeedback(user.uid);
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
          const reviews = await fetchItemReviews(
            selectedOrder.itemType,
            selectedOrder.itemId
          );
          setFeedbacks(reviews);
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

  const handleRatings = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOrder) {
      showAlerts("Please select an order", "error");
      return;
    }

    console.log(ratings);

    try {
      await addFeedback(
        selectedOrder.id,
        selectedOrder.itemType,
        selectedOrder.itemId,
        selectedOrder.merchId,
        user.uid,
        ratings.itemRating,
        ratings.merchantRating,
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
          <>
            <Box
              sx={{ mb: 2, p: 2, border: "1px solid grey", borderRadius: 2 }}
            >
              <Typography>
                <strong>Order Date:</strong> {formatDate(selectedOrder.date)}
              </Typography>
              <Typography>
                <strong>
                  {capitalize(selectedOrder.itemType.slice(0, -1))}:
                </strong>{" "}
                {selectedOrder.title}
              </Typography>
              <Typography>
                <strong>Merchant:</strong> {selectedOrder.merchantName}
              </Typography>
              <Typography>
                <strong>Quantity:</strong> {selectedOrder.itemQuantity}
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-evenly"} px={3}>
              <Box>
                <Typography>Rate my work</Typography>
                <Rating
                  name="merchantRating"
                  precision={0.5}
                  value={ratings.merchantRating}
                  onChange={handleRatings}
                />
              </Box>
              <Box>
                <Typography>
                  Rate my {selectedOrder && selectedOrder.itemType.slice(0, -1)}
                </Typography>
                <Rating
                  name="itemRating"
                  precision={0.5}
                  value={ratings.itemRating}
                  onChange={handleRatings}
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Feedback"
              name="content"
              value={feedback.content}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                !feedback.content || !ratings || selectedOrder.isReviewed
              }
            >
              {selectedOrder.isReviewed
                ? "Already submitted"
                : "Submit Feedback"}
            </Button>
          </>
        )}
      </Box>

      {feedbacks.length > 0 ? (
        <Grid container spacing={2}>          
          {feedbacks.map((fb) => (
            <Grid item xs={12} sm={6} key={fb.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeedbackIcon sx={{ mr: 2 }} />
                    <Rating value={fb.itemRating} readOnly />
                  </Box>
                  <Typography variant="body1">{fb.feedback.content}</Typography>
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
