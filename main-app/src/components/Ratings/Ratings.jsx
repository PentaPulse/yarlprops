import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  Divider,
  Paper,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import SellIcon from '@mui/icons-material/Sell';
import StarIcon from '@mui/icons-material/Star';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3]
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const RatingSystem = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [type, setType] = useState('product');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: Date.now(),
      rating,
      comment: review,
      type,
      date: new Date().toLocaleDateString()
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReview('');
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setRating(0);
    setReview('');
    setType('product');
  };

  const getAverageRating = (type) => {
    const typeReviews = reviews.filter(r => r.type === type);
    if (typeReviews.length === 0) return 0;
    return (typeReviews.reduce((acc, curr) => acc + curr.rating, 0) / typeReviews.length).toFixed(1);
  };

  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const ReviewsSummary = () => (
    <StyledCard>
      <CardContent>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">
                product Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" component="div">
                  {getAverageRating('product')}
                </Typography>
                <StarIcon sx={{ color: 'primary.main', ml: 1 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">
                merchant Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" component="div">
                  {getAverageRating('merchant')}
                </Typography>
                <StarIcon sx={{ color: 'primary.main', ml: 1 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<FeedbackIcon />}
            onClick={() => setOpenDialog(true)}
            size="large"
          >
            Give Feedback
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          {reviews.map((review) => (
            <ReviewCard key={review.id} elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {review.type === 'product' ? <HomeIcon /> : <SellIcon />}
                  </Avatar>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {review.type === 'product' ? 'product' : 'merchant'} • {review.date}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {review.comment}
              </Typography>
            </ReviewCard>
          ))}
        </Box>
      </CardContent>
    </StyledCard>
  );

  return (
    <Container maxWidth="md">
      <ReviewsSummary />
      
      {/* Feedback Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Submit Your Feedback</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(e, newType) => newType && setType(newType)}
              aria-label="property type"
              color="primary"
              sx={{ width: '100%', mb: 3 }}
            >
              <ToggleButton value="product" aria-label="product">
                <HomeIcon sx={{ mr: 1 }} />
                product
              </ToggleButton>
              <ToggleButton value="merchant" aria-label="merchant">
                <SellIcon sx={{ mr: 1 }} />
                merchant
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Rating
              name="property-rating"
              value={rating}
              precision={1}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              size="large"
            />
            {rating !== null && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2">
                  {labels[hover !== -1 ? hover : rating]}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRatingSubmit}
            disabled={!rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Success Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          variant="filled"
        >
          Thank you for your feedback!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RatingSystem;
