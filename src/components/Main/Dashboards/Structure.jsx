import { Box, Grid,  MenuItem, MenuList, Paper, styled } from '@mui/material'
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
            <Box sx={{ flexGrow: 1, marginTop: '50px' }}>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                            <Paper>
                                <MenuList sx={{textAlign:'center'}}>
                                    <MenuItem>Profile</MenuItem>
                                    <MenuItem>My account</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Paper>
                    </Grid>
                    <Grid item md={9}>
                        <Item>md=8</Item>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Structure
