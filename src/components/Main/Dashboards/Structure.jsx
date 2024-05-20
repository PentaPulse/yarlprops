import { Box, Grid, Menu, MenuItem, Paper, Typography, styled } from '@mui/material'
import React from 'react'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Structure() {
    return (
        <>
            <Box sx={{ flexGrow: 1 ,marginTop:'50px'}}>
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <Menu>
                            <MenuItem>Dashboard</MenuItem>
                        </Menu>
                        ll
                        <Item>md=4</Item>
                    </Grid>
                    <Grid item md={8}>
                        ll
                        <Item>md=8</Item>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Structure
