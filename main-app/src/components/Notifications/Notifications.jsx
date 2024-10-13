import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme, Box, Avatar, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../api/AuthContext';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsManager from '../../api/db/notificationsManager'; // Import your Notifications class

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme()

    useEffect(() => {
        const manager = new NotificationsManager(user);

        const fetchNotifications = async () => {
            const fetchedNotifications = await manager.syncNotifications();
            setNotifications(fetchedNotifications);
        };
        fetchNotifications();
    }, []);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (path) => {
        handleClose();
        navigate(path);
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
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '300px',
                                padding: '16px',
                                boxShadow: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.background,
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <DoneAllIcon sx={{ color: 'green' }} />
                                <IconButton size="small" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="body1" fontWeight="bold">{notification.topic} </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <img src={notification.itemImage} width={80} />
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        Item : {notification.itemName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Type : {notification.itemType}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {notification.merchantName}
                                    </Typography>
                                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                        {notification.action}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <MenuItem disabled>
                        <ListItemText primary="No new notifications" />
                    </MenuItem>
                )}
            </Menu >
        </>
    );
};
