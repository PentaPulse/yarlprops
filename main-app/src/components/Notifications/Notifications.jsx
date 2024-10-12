import { Badge, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { showNotifications } from '../../api/db/notifications';
import { useAuth } from '../../api/AuthContext';

export default function Notifications({ count }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])

    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const qSnapshot = await showNotifications(user)
                const nData = qSnapshot.docs.map((doc) => doc.data())
                setNotifications(nData)
            } catch (e) {
                setNotifications([])
            }
        }
        fetchNotifications()
},[user])

    // Open the dropdown when the button is clicked
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the dropdown
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle notification click (navigate to the appropriate route)
    const handleNotificationClick = (path) => {
        handleClose(); // Close the menu before navigating
        navigate(path); // Navigate to the desired path
    };

    return (
        <>
            {/* Notification Button */}
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            {/* Dropdown (Popover) for Notifications */}
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