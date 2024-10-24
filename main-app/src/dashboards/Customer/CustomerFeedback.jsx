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
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";
//import { Snackbar, Alert } from "@mui/material";
import useAlerts from '../../api/AlertService'


export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order
  const { user } = useAuth();
  const location = useLocation();
  const { merchantName, productName } = location.state || {};
  const [feedback, setFeedback] = useState({
    title: "",
    content: "",
    merchantName: merchantName || "",
    productName: productName || "",
  });

  const theme = useTheme();
  const {showAlerts}=useAlerts()

  // Fetching orders from Firestore
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const q = query(
          collection(db, "systemusers", user.uid, "orders"),
          where("review", "==", false)
        );
        const qSnapshot = await getDocs(q);
        const data = qSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrderList(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchOrderList();
  }, [user.uid]);

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
    setSelectedOrder(order); // Set the selected order
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
      userId: user.uid, // track which user submitted feedback
      merchantId: selectedOrder.merchantId, // Use selected order's merchantId
    };

    try {
      // Store feedback in Firestore under merchant's feedback collection
      await db
        .collection("merchants")
        .doc(selectedOrder.merchantId)
        .collection("feedbacks")
        .add(newFeedback);
      setFeedbacks((prevFeedbacks) => [newFeedback, ...prevFeedbacks]);
      setFeedback({ title: "", content: "", merchantName: "", productName: "" });
      showAlerts("Feedback submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showAlerts("Failed to submit feedback", "error");
    }
  };

  const isFormValid =
    feedback.content && feedback.merchantName && feedback.productName;

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
              <MenuItem key={order.id} value={order.id}>
                {order.productName} - {order.merchantName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
