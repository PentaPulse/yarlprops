import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../api/AuthContext';
import NotificationManager from '../../api/db/notificationsManager';

// Import renderNotificationDetails
const renderNotificationDetails = (notification) => {
    switch (notification.variant) {
        case 'welcome':
            return (
                <Typography variant="body1" gutterBottom>
                    Welcome to the platform, {notification.userName || 'User'}!<br/> We're glad to have you.<br/>go to profile -&gt; notifications to more details
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

const notificationManager = new NotificationManager();

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [newNotificationCount, setNewNotificationCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const allNotifications = await notificationManager.getNotifications(user.uid);
                setNotifications(allNotifications);
            } catch (e) {
                console.error('Error fetching notifications:', e);
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, [user]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (notificationId) => {
        try {
            await notificationManager.updateNotification(notificationId, { read: true }, { userId: user.id, requiresAdminPermission: false });
            setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
            setNewNotificationCount((count) => count - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const removeNotification = async (notificationId) => {
        try {
            await notificationManager.deleteNotification(notificationId, { userId: user.id, requiresAdminPermission: false });
            setNotifications(notifications.filter((n) => n.id !== notificationId));
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    return (
        <>
            <IconButton color={theme.palette.primary.default} onClick={handleOpen}>
                <Badge badgeContent={notifications.length} color="error">
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
                {notifications.length !== 0 ? (
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
