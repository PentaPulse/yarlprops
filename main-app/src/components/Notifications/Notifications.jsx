import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../api/AuthContext';
import { deleteNotification, markNotificationAsRead } from '../../api/db/notifications';

// Import renderNotificationDetails
const renderNotificationDetails = (notification) => {
    switch (notification.variant) {
        case 'welcome':
            return (
                <Typography variant="body1">
                    Welcome to the platform, {notification.userName || 'User'}! Explore more in your profile.
                </Typography>
            );
        case 'addItem':
            return (
                <Typography variant="body1">
                    A new item "{notification.itemName}" has been added to the inventory.
                </Typography>
            );
        case 'updateItem':
            return (
                <Typography variant="body1">
                    The item "{notification.itemName}" has been updated. Please review the changes.
                </Typography>
            );
        case 'removeItem':
            return (
                <Typography variant="body1">
                    The item "{notification.itemName}" has been removed from the inventory.
                </Typography>
            );
        case 'changerole':
            return (
                <Typography variant="body1">
                    Your role has been updated to "{notification.newRole}".
                </Typography>
            );
        case 'deleteAccount':
            return (
                <Typography variant="body1">
                    Your account deletion request has been processed. Contact support for further assistance.
                </Typography>
            );
        default:
            return <Typography variant="body1">Unknown notification type.</Typography>;
    }
};

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    const theme=useTheme()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetchNotifications(user.uid)
                setNotifications(response);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const markAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId)
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const removeNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId)
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    return (
        <>
            <IconButton color={theme.palette.primary.default} onClick={handleOpen}>
                <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Typography fontWeight="bold" align="center">NOTIFICATIONS</Typography>
                {notifications  ? (
                    notifications.map((notification) => (
                        <Box
                            key={notification.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '300px',
                                padding: '16px',
                                boxShadow: 2,
                                borderRadius: 2,
                                backgroundColor: notification.read
                                    ? theme.palette.notification.afterread
                                    : theme.palette.notification.beforeread,
                                position: 'relative',
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={() => markAsRead(notification.id)}>
                                    <DoneAllIcon sx={{ color: 'green' }} />
                                    <Typography>Mark as read</Typography>
                                </IconButton>
                                <IconButton size="small" onClick={() => removeNotification(notification.id)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="body1" fontWeight="bold">{notification.topic}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {notification.itemImage && (
                                    <Box>
                                        <img
                                            src={notification.itemImage}
                                            width={70}
                                            height={70}
                                            alt={notification.itemName}
                                        />
                                    </Box>
                                )}
                                <Box ml={3}>
                                    {/* Render customized notification details */}
                                    {renderNotificationDetails(notification)}
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <MenuItem disabled>
                        <ListItemText primary="No new notifications" />
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
