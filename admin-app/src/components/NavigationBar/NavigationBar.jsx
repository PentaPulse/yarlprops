import * as React from 'react';
import {AppBar ,Box , Toolbar ,Tooltip,Typography, useTheme } from '@mui/material';
import ModeSwitch from '../ModeHandler/ModeSwitch';

export default function NavigationBar({handleMode}) {
    const theme = useTheme()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Yarlprops
                    </Typography>
                    <Box display={'flex'} gap={1} >
                        <Tooltip title={`${theme.palette.mode} mode`}>
                            <ModeSwitch handleMode={handleMode} />
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
