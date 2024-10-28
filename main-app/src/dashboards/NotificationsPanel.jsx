import { Box, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationManager from '../api/db/notificationsManager';
import { useAuth } from '../api/AuthContext';

const notificationsManager = new NotificationManager();

export default function NotificationsPanel() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const handleSelectNotification = async (notification) => {
    setSelectedNotification(notification);
    try {
      await notificationsManager.updateNotification(notification.id, { read: true }, { userId: user.id, requiresAdminPermission: false });
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsManager.getNotifications({ userId: user.id});
        setNotifications(data);
      } catch (e) {
        console.error('Error fetching notifications:', e);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [user]);

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
                  <Typography variant="subtitle1" color={notification.read ? 'textSecondary' : 'textPrimary'}>
                    {notification.topic}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Expanded Area - 9 columns */}
        {selectedNotification && (
          <Grid item xs={12} md={9}>
            <Paper elevation={3}>
              {selectedNotification.isItem ? (
                <Box p={2}>
                  <Typography variant="h6">{selectedNotification.topic}</Typography>
                  {selectedNotification.itemImage && (
                    <img src={selectedNotification.itemImage} alt={selectedNotification.itemName} width={150} />
                  )}
                  <Typography variant="body1">Item Name: {selectedNotification.itemName}</Typography>
                  <Typography variant="body2" color="textSecondary">Type: {selectedNotification.itemType}</Typography>
                  <Typography variant="body2" color="textSecondary">Merchant: {selectedNotification.merchantName}</Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    Action: {selectedNotification.action} {selectedNotification.itemType}
                  </Typography>
                </Box>
              ) : (
                <Box p={2}>
                  <Typography variant="h6">{selectedNotification.topic}</Typography>
                  <Typography variant="body2" color="textSecondary">Welcome to our platform!</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
}
