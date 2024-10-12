import { Avatar,  Box, IconButton, Tooltip} from "@mui/material";
import Notifications from "../Notifications/Notifications";
import React from "react";


export default function ProfileBox({ handleProfileClick }) {
    //const theme = useTheme();
    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Notifications  />
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