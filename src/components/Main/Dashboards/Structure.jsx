import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'

function Structure({access}) {
    //const [admin,setAdmin]=React.useState(false);
    return (
        <>
            <Box sx={{ flexGrow: 1, marginTop: '50px' }}>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <Paper>
                            <MenuList>
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>My account</MenuItem>
                                <MenuItem>Logout</MenuItem>
                            </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item md={9}>

                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Structure
