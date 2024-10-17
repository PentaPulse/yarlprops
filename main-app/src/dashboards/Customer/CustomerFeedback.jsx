import React, { useState } from 'react';
import { 
    Container, Typography, Grid, Card, CardContent, TextField, 
    Button, Box, useTheme, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function FeedbackPage() {
    // Start with an empty feedback list
    const [feedbacks, setFeedbacks] = useState([]);

    const [feedback, setFeedback] = useState({
        title: '',
        content: '',
    });

    const theme = useTheme(); // Access theme to handle dark/light mode

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeedback((prevFeedback) => ({
            ...prevFeedback,
            [name]: value,
        }));
    };

    // Handle form submission and update feedback list
    const handleSubmit = () => {
        const newFeedback = {
            id: feedbacks.length + 1, // Generate a unique ID
            title: feedback.title,
            content: feedback.content,
            date: new Date().toISOString().split('T')[0], // Use current date
        };

        setFeedbacks((prevFeedbacks) => [newFeedback, ...prevFeedbacks]); // Add new feedback
        setFeedback({ title: '', content: '' }); // Reset form fields
    };

    // Check if both fields are filled to enable the submit button
    const isFormValid = feedback.title && feedback.content;

    return (
        <Container>
            {/* Page Title */}
            <Typography variant="h4" gutterBottom>
                Customer Feedback
            </Typography>

            {/* Feedback Form */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Submit Your Feedback
                </Typography>

                {/* Dropdown for Feedback Title */}
                <FormControl fullWidth sx={{ mb: 2 }} required>
                    <InputLabel>Feedback Type</InputLabel>
                    <Select
                        name="title"
                        value={feedback.title}
                        onChange={handleInputChange}
                        label="Feedback Type"
                    >
                        <MenuItem value="Service Feedback">Service Feedback</MenuItem>
                        <MenuItem value="Product Feedback">Product Feedback</MenuItem>
                        <MenuItem value="Rental Feedback">Rental Feedback</MenuItem>
                    </Select>
                </FormControl>

                {/* Content Field */}
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
                    InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!isFormValid} // Disable button if form is not valid
                    sx={{ display: 'block', margin: '0 auto' }}
                >
                    Submit Feedback
                </Button>
            </Box>

            {/* Feedback Cards */}
            {feedbacks.length > 0 ? (
                <Grid container spacing={4}>
                    {feedbacks.map((fb) => (
                        <Grid item xs={12} sm={6} key={fb.id}>
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? '#424242' 
                                        : '#e3f2fd',
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <FeedbackIcon
                                            sx={{
                                                color: theme.palette.mode === 'dark' 
                                                    ? '#bbdefb' 
                                                    : '#1976d2',
                                                fontSize: 40,
                                                marginRight: 2,
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="h6">{fb.title}</Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: theme.palette.text.secondary }}
                                            >
                                                {fb.date}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1">{fb.content}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                    No feedback available. Be the first to submit your feedback!
                </Typography>
            )}
        </Container>
    );
}
