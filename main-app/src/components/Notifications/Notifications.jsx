import { Badge, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../api/AuthContext';
import NotificationsManager from '../../api/db/notificationsManager'; // Import your Notifications class

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const manager = new NotificationsManager(user);

            const fetchNotifications = async () => {
                const fetchedNotifications = await manager.syncNotifications();
                setNotifications(fetchedNotifications);
            };
            fetchNotifications();
        }
    }, [user]);

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
            <IconButton color="inherit" onClick={handleOpen}>
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
                        <MenuItem key={index} onClick={() => handleNotificationClick(notification.path)}>
                            <ListItemText primary={notification.message} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <ListItemText primary="No new notifications" />
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};
