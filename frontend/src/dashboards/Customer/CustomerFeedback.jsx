import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, TextField, Button, Box } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

// Example feedback data (replace with actual data)
const feedbacks = [
    {
        id: 1,
        title: 'Great Service!',
        content: 'I loved the bicycle rental service. It was quick and convenient!',
        date: '2024-09-01',
    },
    {
        id: 2,
        title: 'Good Quality Furniture',
        content: 'The furniture rental was excellent, and delivery was fast.',
        date: '2024-08-25',
    },
];

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState({
        title: '',
        content: '',
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeedback((prevFeedback) => ({
            ...prevFeedback,
            [name]: value,
        }));
    };

    // Handle form submission (replace with actual submission logic)
    const handleSubmit = () => {
        console.log('Feedback submitted:', feedback);
        setFeedback({ title: '', content: '' });
    };

    return (
        <Container>
            {/* Page Title */}
            <Typography variant="h4" gutterBottom>
                Feedback
            </Typography>

            {/* Feedback Form */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Submit Your Feedback
                </Typography>
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={feedback.title}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Content"
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
                    sx={{ display: 'block', margin: '0 auto' }}
                >
                    Submit Feedback
                </Button>
            </Box>

            {/* Previous Feedbacks */}
            <Grid container spacing={4}>
                {feedbacks.map((fb) => (
                    <Grid item xs={12} sm={6} key={fb.id}>
                        <Card sx={{ maxWidth: 345, backgroundColor: '#e3f2fd' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <FeedbackIcon sx={{ color: '#1976d2', fontSize: 40, marginRight: 2 }} />
                                    <Box>
                                        <Typography variant="h6">{fb.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
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
        </Container>
    );
}
