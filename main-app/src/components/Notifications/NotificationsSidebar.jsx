// NotificationsSidebar.js
import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Drawer, List, ListItem, ListItemText, Box, Typography, Paper } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/system';

// Mock notifications data
const fetchNotifications = async () => [
  { id: 1, topic: 'Order Update', message: 'Your order has been shipped.', isNew: true },
  { id: 2, topic: 'Discount Alert', message: '50% off on selected items!', isNew: true },
  { id: 3, topic: 'Message', message: 'You received a message from support.', isNew: false },
];

// Styled container for notification details
const NotificationDetails = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export default function NotificationsSidebar() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
      setNewCount(data.filter((notif) => notif.isNew).length);
    };
    loadNotifications();
  }, []);

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notification.id ? { ...notif, isNew: false } : notif
      )
    );
    setNewCount((prevCount) => (notification.isNew ? prevCount - 1 : prevCount));
  };

  return (
    <>
      {/* Notification Button */}
      <IconButton color="inherit" onClick={toggleDrawer(true)}>
        <Badge badgeContent={newCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box width={300} p={2}>
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.isNew ? 'lightblue' : 'white',
                  '&:hover': { backgroundColor: 'lightgray' },
                  borderBottom: '1px solid #ddd',
                }}
              >
                <ListItemText
                  primary={<strong>{notification.topic}</strong>}
                  secondary={notification.message}
                />
              </ListItem>
            ))}
          </List>
          {selectedNotification && (
            <NotificationDetails elevation={3}>
              <Typography variant="h6" color="secondary">
                {selectedNotification.topic}
              </Typography>
              <Typography variant="body1">{selectedNotification.message}</Typography>
            </NotificationDetails>
          )}
        </Box>
      </Drawer>
    </>
  );
}

// app.js


// import React from 'react';
// import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
// import NotificationsSidebar from './NotificationsSidebar';

// function App() {
  // return (
    // <div>
//       {/* Global CSS reset and theme setup */}
//       <CssBaseline />

//       {/* Top App Bar */}
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Dashboard
//           </Typography>

//           {/* Notification Button in AppBar */}
//           <NotificationsSidebar />
//         </Toolbar>
//       </AppBar>

//       {/* Main content area */}
//       <Container sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome 
//         </Typography>
//         <Typography variant="body1">
//           Here, you can manage your products, view customer orders, and check out notifications for recent updates.
//         </Typography>
//       </Container>
//     </div>
//   );
// }

// export default App;

