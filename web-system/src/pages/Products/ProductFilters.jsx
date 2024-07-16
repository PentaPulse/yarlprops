import { Box, Button, Menu, MenuItem } from '@mui/material';
import React from 'react'

function ProductFilters() {
    return (
        <>
            <Box >
                <Button sx={{ width: '100%' }}>Type</Button>
                <Menu                >
                    <MenuItem>Bordim</MenuItem>
                    <MenuItem>Cycle</MenuItem>
                </Menu>
            </Box>
        </>
    )
}

export default ProductFilters;
