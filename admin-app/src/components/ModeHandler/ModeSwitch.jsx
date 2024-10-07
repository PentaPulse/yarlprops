import { IconButton, useTheme } from '@mui/material'
import React from 'react'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ModeSwitc({handleMode}) {
    const theme = useTheme()
    return (
        <>
            {theme.palette.mode === 'light' ?
                <>
                    <IconButton
                        onClick={handleMode}
                    >
                        <LightModeIcon />
                    </IconButton>
                </>
                :
                <>
                    <IconButton
                        onClick={handleMode}
                    >
                        <DarkModeIcon />
                    </IconButton>
                </>}
        </>
    )
}
