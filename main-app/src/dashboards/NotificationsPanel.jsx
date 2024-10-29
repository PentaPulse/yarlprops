import { Box, Container, Typography, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import NotificationManager from "../api/db/notificationsManager";
import { useAuth } from "../api/AuthContext";

const notificationManager=new NotificationManager()

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {user}=useAuth()
  const theme=useTheme()
  
  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const data = await notificationManager.getNotifications(user.uid);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
  };

  const renderNotificationDetails = (notification) => {
    switch (notification.variant) {
      case 'welcome':
        return (
          <Typography variant="body1" gutterBottom>
            Welcome to the platform, {notification.userName || 'User'}! We're glad to have you.
          </Typography>
        );
      case 'addItem':
        return (
          <Typography variant="body1" gutterBottom>
            A new item has been added successfully! Check it out in the items section.
          </Typography>
        );
      case 'updateItem':
        return (
          <Typography variant="body1" gutterBottom>
            An item was updated. Please review the changes.
          </Typography>
        );
      case 'removeItem':
        return (
          <Typography variant="body1" gutterBottom>
            An item has been removed. If this was unintentional, please contact support.
          </Typography>
        );
      case 'changerole':
        return (
          <Typography variant="body1" gutterBottom>
            User role has been changed. Please review the updated permissions.
          </Typography>
        );
      case 'deleteAccount':
        return (
          <Typography variant="body1" gutterBottom>
            An account deletion request has been processed. Ensure all related data is archived.
          </Typography>
        );
      default:
        return (
          <>
            <Typography variant="body1" gutterBottom>
              Notification ID: {notification.nId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Path: {notification.path}
            </Typography>
            <Typography variant="body1" gutterBottom>
              User ID: {notification.userId || 'N/A'}
            </Typography>
          </>
        );
    }
  };

  return (
    <Container sx={{ display: 'flex', gap: 3, mt: 3 }}>
      {/* Notifications List Panel */}
      <Box width={'35%'} p={2} borderRadius={1} boxShadow={3}>
        <Typography variant="h6" align="center" gutterBottom>
          Notifications
        </Typography>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.nId}
              button
              onClick={() => handleSelectNotification(notification)}
              sx={{ bgcolor: 'grey.200', mb: 1, borderRadius: 1 }}
            >
              <ListItemText primary={notification.variant} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Selected Notification Details Panel */}
      <Box p={3} height={'800px'} width={'70%'} borderRadius={1} boxShadow={3} borderColor={theme.palette.background.default}>
        {selectedNotification ? (
          <>
            <Typography variant="h5" gutterBottom>
              {selectedNotification.variant.charAt(0).toUpperCase() + selectedNotification.variant.slice(1)} Notification
            </Typography>
            {renderNotificationDetails(selectedNotification)}
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 10 }}>
            Select a notification to view details
          </Typography>
        )}
      </Box>
    </Container>
  );
}
