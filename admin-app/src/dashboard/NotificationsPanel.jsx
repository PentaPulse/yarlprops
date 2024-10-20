import { Box, Grid,  List, ListItem, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function NotificationsPanel() {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = [
    { id: 1, title: 'Notification 1', details: 'Details of Notification 1' },
    { id: 2, title: 'Notification 2', details: 'Details of Notification 2' },
    { id: 3, title: 'Notification 3', details: 'Details of Notification 3' },
  ];

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
  };

  

  return (
  <>
    <Grid container spacing={2}>
      {/* Notification List - 3 columns */}
      <Grid item xs={12} md={3}>
        <Paper elevation={3}>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => handleSelectNotification(notification)}
              >
                <Typography variant="subtitle1">{notification.title}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Expanded Area - 9 columns */}
      {selectedNotification && (
        <Grid item xs={12} md={9}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">{selectedNotification.title}</Typography>
              <Typography variant="body1">
                {selectedNotification.details}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
    </>
  )
}