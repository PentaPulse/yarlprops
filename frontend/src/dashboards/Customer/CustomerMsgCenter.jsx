import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Badge } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

// Example messages data (replace with actual data)
const messages = [
    {
        id: 1,
        sender: 'John Doe',
        subject: 'Rental Inquiry',
        date: '2024-09-01',
        read: false,
    },
    {
        id: 2,
        sender: 'Alice Smith',
        subject: 'Payment Confirmation',
        date: '2024-08-28',
        read: true,
    },
    {
        id: 3,
        sender: 'David Brown',
        subject: 'Service Feedback',
        date: '2024-08-25',
        read: false,
    },
];

export default function MessageCenter() {
    return (
        <Container>
            {/* Page Title */}
            <Typography variant="h4" gutterBottom>
                Message Center
            </Typography>

            {/* Messages Grid */}
            <Grid container spacing={4}>
                {messages.map((message) => (
                    <Grid item xs={12} sm={6} md={4} key={message.id}>
                        <Card sx={{ 
                            maxWidth: 345, 
                            backgroundColor: message.read ? '#e0f7fa' : '#ffebee',
                            borderLeft: message.read ? '4px solid #00acc1' : '4px solid #f44336'
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Badge
                                        color={message.read ? 'default' : 'error'}
                                        variant="dot"
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <EmailIcon sx={{ color: message.read ? '#00acc1' : '#f44336', fontSize: 40, marginRight: 2 }} />
                                    </Badge>
                                    <Box>
                                        <Typography variant="h6">{message.sender}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {message.subject}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                                    Date: {message.date}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color={message.read ? 'primary' : 'secondary'}
                                    fullWidth
                                >
                                    {message.read ? 'View Message' : 'Mark as Read'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
