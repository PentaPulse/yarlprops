import { Badge, IconButton, ListItemText, Menu, MenuItem, useTheme, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../api/AuthContext';
import { getNewNotifications, getNotifications } from '../../api/db/notificationsManager'

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [notifications, setNotifications] = useState([])
    const [newNotificationCount,setNewNotificationCount]=useState(0)
    const { user } = useAuth()

    useEffect(() => {
        const fecthNotifications = async () => {
            try {
                const data = await getNotifications(user)
                setNotifications(data)
                const nData = await getNewNotifications(user)
                setNewNotificationCount(nData.length)
            } catch (e) {
                setNotifications([])
            }
        }
        fecthNotifications()
    }, [])

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color={theme.palette.primary.default} onClick={handleOpen}>
                <Badge badgeContent={newNotificationCount} color="error">
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
                {notifications.length !== 0 ?
                    notifications.map((notification, index) => (
                        notification.isItem ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    width: '300px',
                                    padding: '16px',
                                    boxShadow: 2,
                                    borderRadius: 2,
                                    backgroundColor: notification.read?theme.palette.notification.afterread: theme.palette.notification.beforeread,
                                    position: 'relative',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <IconButton >
                                        <DoneAllIcon sx={{ color: 'green' }} />
                                        <Typography>Mark as read</Typography>
                                    </IconButton>
                                    <IconButton size="small" onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography variant="body1" fontWeight="bold">{notification.topic}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <img
                                            src={notification.itemImage}
                                            width={70}
                                            height={70}
                                            alt={notification.itemName}
                                        />
                                    </Box>
                                    <Box ml={3}>
                                        <Typography variant="body1" fontWeight="bold">
                                            Item: {notification.itemName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Type: {notification.itemType}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Merchant: {notification.merchantName}
                                        </Typography>
                                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                            Action: {notification.action} {notification.itemType}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            :

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
                                <Typography variant="body1" fontWeight="bold">{'notification.topic'}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Welcome to our platform!
                                </Typography>
                            </Box>
                    ))
                    :
                    <MenuItem disabled>
                        <ListItemText primary="No new notifications" />
                    </MenuItem>
                }
            </Menu>
        </>
    );
}
