import { Box,Grid2 as  Grid,  List, ListItem, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getNotifications, markAsRead } from '../api/db/notificationsManager';
import { useAuth } from '../api/AuthContext';

export default function NotificationsPanel() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    markAsRead(user, notification.id)
  };

  useEffect(() => {
    const fecthNotifications = async () => {
      try {
        const data = await getNotifications(user)
        setNotifications(data)
      } catch (e) {
        setNotifications([])
      }
    }
    fecthNotifications()
  }, [])

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
                  <Typography variant="subtitle1">{notification.topic}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Expanded Area - 9 columns */}
        {selectedNotification && (
          <Grid item xs={12} md={9}>
            <Paper elevation={3}>
              {selectedNotification.isItem ?
                <Box p={2}>
                  <Typography variant="h6">{selectedNotification.topic}</Typography>
                  <Typography variant="body1">
                    {selectedNotification.itemImage}
                  </Typography>
                </Box>
                :
                <Box p={2}>

                </Box>
              }
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  )
}