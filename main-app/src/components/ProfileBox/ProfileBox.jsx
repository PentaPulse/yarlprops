import { Avatar, Badge, Box, IconButton, Tooltip, useTheme } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';


export default function ProfileBox({ handleProfileClick }) {
    const theme = useTheme();

    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color={theme.palette.primary.main}
                    sx={{[theme.breakpoints.down('md')]:{display:'none'}}}
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Box>
            <Box sx={{ flexGrow: 0, display: 'block' }}>
                <Tooltip title="Open dashboard">
                    <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                        <Avatar alt="User Profile" src={sessionStorage.getItem('pp')} />
                    </IconButton>
                </Tooltip>
            </Box>
        </>
    );
}