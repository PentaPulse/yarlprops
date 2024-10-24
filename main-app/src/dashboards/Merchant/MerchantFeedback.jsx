import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useAuth } from '../../api/AuthContext';

const MerchantFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { user } = useAuth(); // Assuming merchants are authenticated users
  const theme = useTheme();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, 'merchants', user.uid, 'feedback') // Feedbacks for the logged-in merchant
        );
        const qSnapshot = await getDocs(q);
        const feedbackData = qSnapshot.docs.map((doc) => doc.data());
        setFeedbacks(feedbackData);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFeedbacks();
  }, [user.uid]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Feedbacks
      </Typography>

      {feedbacks.length > 0 ? (
        <Grid container spacing={4}>
          {feedbacks.map((fb, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: theme.palette.text.primary,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeedbackIcon sx={{ color: "#1976d2", fontSize: 40, marginRight: 2 }} />
                    <Box>
                      <Typography variant="h6">{fb.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {fb.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Customer: {fb.userId}
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
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No feedback available.
        </Typography>
      )}
    </Container>
  );
};

export default MerchantFeedback;
