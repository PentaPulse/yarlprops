import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'
import Profile from './UserProfile'
import Overview from './Overview'
import Sellers from './Sellers'
import Renters from './Renters'
import Products from './Products'
import Users from './Users'
import { onAuthStateChanged } from 'firebase/auth'
import { authUser } from '../../../backend/autharization'
import { adminList } from '../../../backend/db/users'

function Structure({ access }) {
    //const [admin,setAdmin]=React.useState(false);
    const [board, setBoard] = React.useState(0)
    const [status,setStatus]=React.useState('')
    React.useEffect(()=>{
        onAuthStateChanged(authUser,user=>{
            if(user){
                if(adminList.includes(user.email)){
                    setStatus('admin')
                }
            }
        })
    })
    return (
        <>
            <Box sx={{ backgroundColor: 'whit' }}>
                <Grid container spacing={2} columns={{ xs: 2, sm: 8, md: 12, lg: 12 }}>
                    <Grid item xs={2} sm={4} md={3} lg={3}>
                        <Paper>
                            <MenuList variant='selectedMenu'>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(0)}>Overview</MenuItem>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(1)}>Sellers</MenuItem>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(2)}>Renters</MenuItem>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(3)}>Products</MenuItem>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(4)}>Users</MenuItem>
                                <MenuItem sx={{ height: '5rem' }} onClick={()=>setBoard(5)}>My Profile</MenuItem>
                                <MenuItem sx={{ height: '5rem' }}>Sign out</MenuItem>
                            </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item md={9}>
                        <Paper sx={{height:'100%'}}>
                        {board === 0 && <Overview />}
                        {board === 1 && status==='admin'&& <Sellers />}
                        {board === 2 && <Renters />}
                        {board === 3 && <Products />}
                        {board === 4 && <Users />}
                        {board === 5 && <Profile />}
                        </Paper>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Structure