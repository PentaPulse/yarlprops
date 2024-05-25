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
import { useNavigate } from 'react-router-dom'
import { fetchAdminList, fetchSellerList, fetchUserList } from '../../../backend/db/users'

//only for debugging
//let email = authUser.currentUser.email
//const admins = ['email']
//const sellers = ['email']
//onst users = ['email']

//menus
const adminMenu = ['Overview', 'Sellers', 'Renters', 'Products', 'Users', 'My Profile', 'Sign out']
const sellerRenterMenu = ['Overview', 'Products', 'My Profile', 'Sign out']
const userMenu = ['Overview', 'My Profile', 'Sign out']

//boards
const adminBoard = [<Overview />, <Sellers />, <Renters />, <Products />, <Users />, <Profile />]
const sellerBoard = [<Overview />, <Products />, <Profile />]
const userBoard = [<Overview />, <Profile />]

function Structure() {
    const [board, setBoard] = React.useState(0)
    const [status, setStatus] = React.useState('')
    const navigate = useNavigate()
    React.useEffect(() => {
        const fetchLists = async () => {
            const adminList = await fetchAdminList();
            const sellersList = await fetchSellerList()
            const usersList = await fetchUserList();
            const unsubscribe = onAuthStateChanged(authUser, user => {
                if (user) {
                    if (adminList.includes(user.email)) {
                        setStatus('admin');
                    } else if (sellersList.includes(user.email)) {
                        setStatus('seller');
                    } else if (usersList.includes(user.email)) {
                        setStatus('user');
                    }
                } else {
                    navigate('/');
                }
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        };

        fetchLists();
    }, [navigate]);
        return (
            <>
                <Box >
                    <Grid container spacing={2} columns={{ xs: 2, sm: 4, md: 12, lg: 12 }}>
                        <Grid justifyContent="center" alignItems="center" item xs={2} sm={4} md={3} lg={3}>
                            <Paper>
                                <MenuList variant='selectedMenu'>
                                    {status === 'admin' && adminMenu.map((item, index) => (
                                        <MenuItem key={index} sx={{ height: '5rem', textAlign: 'center' }} onClick={() => setBoard(index)}>{item}</MenuItem>
                                    ))}
                                    {status === 'seller' && sellerRenterMenu.map((item, index) => (
                                        <MenuItem key={index} sx={{ height: '5rem' }} onClick={() => setBoard(index)}>{item}</MenuItem>
                                    ))}
                                    {status === 'user' && userMenu.map((item, index) => (
                                        <MenuItem key={index} sx={{ height: '5rem' }} onClick={() => setBoard(index)}>{item}</MenuItem>
                                    ))}
                                </MenuList>
                            </Paper>
                        </Grid>
                        <Grid item md={9}>
                            <Paper sx={{ height: '100%' }}>
                                {status === 'admin' && adminBoard.map((boardComponent, index) => (
                                    board === index && boardComponent
                                ))}
                                {status === 'seller' && sellerBoard.map((boardComponent, index) => (
                                    board === index && boardComponent
                                ))}
                                {status === 'user' && userBoard.map((boardComponent, index) => (
                                    board === index && boardComponent
                                ))}

                            </Paper>
                        </Grid>
                    </Grid>
                </Box >
            </>
        )
    }

export default Structure