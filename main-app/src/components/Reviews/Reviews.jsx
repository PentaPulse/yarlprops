import { Box, Card, CardContent, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchItemReviews } from "../../api/db/feedback";
import FeedbackIcon from "@mui/icons-material/Feedback";

export default function Reviews({ itemType, itemId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const data = await fetchItemReviews(
          itemType,itemId
        );
        setReviews(data);
      } catch (e) {
        console.error("Error fetching feedbacks or ratings:", e);
      }
    };

    fetchRelatedData();
  }, []);
  return (
    <Box sx={{ my: 3 }}>
      {reviews && reviews.length > 0 ? (
        reviews.map((fb) => (
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FeedbackIcon sx={{ mr: 2 }} />
                    <Rating value={fb.itemRating} readOnly />
                  </Box>
                  <Typography variant="body1">{fb.feedback.content}</Typography>
                </CardContent>
              </Card>
          ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", mb: 1 }}>
          No reviews yet. Be the first to leave a review!
        </Typography>
      )}
    </Box>
  );
}
/*
<Box sx={{ my: 3 }}>
                                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Reviews Summary</Typography>
                                {reviews.length > 0 ? (
                                    <>
                                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                                            Average Rating: {averageRating.toFixed(1)} / 5
                                        </Typography>
                                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                            Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}.
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                                        No reviews yet. Be the first to leave a review!
                                    </Typography>
                                )}
                            </Box>
*/
