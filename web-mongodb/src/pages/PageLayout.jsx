import * as React from 'react'
import { Box } from '@mui/material';


export default function PageLayout({ children}) {
    return (
        <>
            <Box sx={{ marginTop: '12vh' }}>
                {children}
            </Box>
        </>
    )
}
