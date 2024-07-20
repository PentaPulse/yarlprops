import { Box, Button, Checkbox, FormControlLabel, FormGroup, Menu, MenuItem } from '@mui/material';
import React from 'react'

function ProductFilters() {

    return (
        <>
            <Box >
                <Button sx={{ width: '100%' }}>Category</Button>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label="Bodim" />
                </FormGroup>
            </Box>
        </>
    )
}

export default ProductFilters;
