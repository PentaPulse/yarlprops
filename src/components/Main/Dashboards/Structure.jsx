import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'
import Profile from './UserProfile'
import Overview from './Overview'
import Sellers from './Sellers'
import Renters from './Renters'
import Products from './Products'
import Users from './Users'
import SellerOverview from './Seller/Overviev'
import SellerProducts from './Seller/Products'
import SellerOrders from './Seller/Orders'
import { onAuthStateChanged } from 'firebase/auth'
import { authUser } from '../../../backend/autharization'
import { useNavigate } from 'react-router-dom'
import { fetchAdminList, fetchSellerList, fetchUserList } from '../../../backend/db/users'

//menus
const adminMenu = ['Overview', 'Sellers', 'Renters', 'Products', 'Users', 'My Profile', 'Sign out']
const sellerMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const renterMenu = ['Overview', 'Products',  'My Profile', 'Sign out']
const userMenu = ['Overview', 'My Profile', 'Sign out']

//boards
const adminBoard = [<Overview />, <Sellers />, <Renters />, <Products />, <Users />, <Profile />]
const sellerBoard = [<SellerOverview />, <SellerProducts />, <SellerOrders />, <Profile />]
const renterBoard = [<Overview />, <Products />,  <Profile />]
const userBoard = [<Overview />, <Profile />]

function Structure() {
    const [board, setBoard] = React.useState(0)
    const [status, setStatus] = React.useState('')
    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchLists = async () => {
            const unsubscribe = onAuthStateChanged(authUser, user => {
                if (user) {
                    fetchAdminList().then(adminList => {
                        if (adminList.includes(user.email)) {
                            setStatus('admin')
                        }
                        else{/*
                        
                            fetchSellerList().then(sellerList => {
                                sellerList.forEach((seller, index) => {
                                    console.log(`Seller ${index + 1} email:`, seller.email,seller.role);
                                });
                            })
                        */
                            fetchSellerList().then(sellerList => {
                                if (sellerList.includes(user.email)) {
                                    setStatus('seller')
                                }
                                else{
                                    fetchUserList().then(userList => {
                                        if (userList.includes(user.email)) {
                                            setStatus('user')
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    navigate('/');
                }
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        };

        fetchLists();
    }, [navigate, status]);
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
                                {status === 'seller' && sellerMenu.map((item, index) => (
                                    <MenuItem key={index} sx={{ height: '5rem' }} onClick={() => setBoard(index)}>{item}</MenuItem>
                                ))}
                                {status === 'renter' && renterMenu.map((item, index) => (
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
                            {status === 'renter' && renterBoard.map((boardComponent, index) => (
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