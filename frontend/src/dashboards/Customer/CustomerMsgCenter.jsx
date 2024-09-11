import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Badge, useTheme } from '@mui/material';
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
    const theme = useTheme(); // Get theme to handle dark/light mode dynamically

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
                            backgroundColor: message.read 
                                ? (theme.palette.mode === 'dark' ? '#121212' : '#e3f2fd')  // Dark background for dark mode, light blue for light mode
                                : (theme.palette.mode === 'dark' ? '#1c1c1c' : '#f5f5f5'),  // Darker grey for unread messages in dark mode, light grey in light mode
                            borderLeft: message.read 
                                ? `4px solid ${theme.palette.mode === 'dark' ? '#81d4fa' : '#0288d1'}`  // Brighter blue borders
                                : `4px solid ${theme.palette.mode === 'dark' ? '#90a4ae' : '#cfd8dc'}`, // Greyish borders for unread
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Badge
                                        color={message.read ? 'primary' : 'secondary'}  // Primary for read, secondary for unread
                                        variant="dot"
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <EmailIcon 
                                            sx={{ 
                                                color: message.read 
                                                    ? (theme.palette.mode === 'dark' ? '#81d4fa' : '#0288d1')  // Brighter blue icon in dark mode, lighter blue in light
                                                    : (theme.palette.mode === 'dark' ? '#90a4ae' : '#0288d1'),  // Greyish-blue icon for unread
                                                fontSize: 40, 
                                                marginRight: 2 
                                            }} 
                                        />
                                    </Badge>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}>
                                            {message.sender}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#b0bec5' : '#616161' }}>
                                            {message.subject}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#b0bec5' : '#616161', marginBottom: 2 }}>
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
