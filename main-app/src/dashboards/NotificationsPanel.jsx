import { Box, Container, Typography, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import NotificationManager from "../api/db/notificationsManager";
import { useAuth } from "../api/AuthContext";
import { getDocs, doc, collection } from 'firebase/firestore'
import { db } from "../api/firebase";

const notificationManager = new NotificationManager()

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { user } = useAuth()
  const theme = useTheme()

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

  const renderWelcomeNotification = (notification) => (
    <Box
      sx={{
        padding: '16px',
        backgroundColor: theme.palette.background.default,
        boxShadow: 3,
        borderRadius: 2,
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
        Welcome to Our Platform, {notification.userName || 'User'}!
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        We're thrilled to have you here! Explore and make the most of the features available. If you
        need any help getting started, feel free to reach out.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <img
          src={`${process.env.PUBLIC_URL}/welcome.jpg`}
          alt="Welcome"
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </Box>
      <Typography variant="body2" color="textSecondary" align="center">
        Enjoy your journey with us, and feel free to contact support if you need any assistance.
      </Typography>
    </Box>
  );
  

  const renderAddItemDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        New Item Added
      </Typography>
      <Typography variant="body1">
        The item "{notification.itemName}" has been successfully added to the inventory.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Category: {notification.itemCategory || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date Added: {notification.date || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Added By: {notification.merchantName || 'N/A'}
      </Typography>
    </Box>
  );

  const renderUpdateItemDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Item Updated
      </Typography>
      <Typography variant="body1">
        The item "{notification.itemName}" has been updated.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Updated Fields: {notification.updatedFields || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Updated By: {notification.merchantName || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date Updated: {notification.date || 'N/A'}
      </Typography>
    </Box>
  );

  const renderRemoveItemDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Item Removed
      </Typography>
      <Typography variant="body1">
        The item "{notification.itemName}" has been removed from the inventory.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Reason: {notification.reason || 'Not specified'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Removed By: {notification.merchantName || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date Removed: {notification.date || 'N/A'}
      </Typography>
    </Box>
  );

  const renderApprovedItemDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Item Approved
      </Typography>
      <Typography variant="body1">
        The item "{notification.itemName}" has been approved and is now available for sale.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Approved By: {notification.adminName || 'Admin'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Approval Date: {notification.date || 'N/A'}
      </Typography>
    </Box>
  );

  const renderApprovedOrderDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Approved
      </Typography>
      <Typography variant="body1">
        Your order for "{notification.itemName}" has been approved.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Order ID: {notification.orderId || 'N/A'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Approved By: {notification.adminName || 'Admin'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Date Approved: {notification.date || 'N/A'}
      </Typography>
    </Box>
  );

  const renderChangeRoleDetails = (notification) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Role Changed
      </Typography>
      <Typography variant="body1">
        Your role has been updated to "{notification.newRole}".
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Updated By: {notification.adminName || 'Admin'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Change Date: {notification.date || 'N/A'}
      </Typography>
    </Box>
  );

  
  const renderNotificationDetails = (notification) => {
    switch (notification.variant) {
      case 'welcome':
        return renderWelcomeNotification(notification);
      case 'addItem':
        return renderAddItemDetails(notification);
      case 'updateItem':
        return renderUpdateItemDetails(notification);
      case 'removeItem':
        return renderRemoveItemDetails(notification);
      case 'approvedItem':
        return renderApprovedItemDetails(notification);
      case 'approvedOrder':
        return renderApprovedOrderDetails(notification);
      case 'changerole':
        return renderChangeRoleDetails(notification);
      default:
        // Default case handling...
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
              sx={{ bgcolor: `${theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'}`, mb: 1, borderRadius: 1 }}
            >
              <ListItemText primary={notification.variant} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Selected Notification Details Panel */}
      <Box p={3} height={'800px'} width={'70%'} borderRadius={1} boxShadow={3} bgcolor={theme.palette.mode === 'light' ? 'grey.100' : 'grey.900'}>
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