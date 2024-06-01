import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'
import Profile from './UserProfile'
import { onAuthStateChanged } from 'firebase/auth'
import { authUser } from '../../../backend/autharization'
import { useNavigate } from 'react-router-dom'
import { fetchAdminList, fetchRenterList, fetchSellerList, fetchUserList } from '../../../backend/db/users'
//Admin imports
import AdminOverview from './Admin/AdminOverview'
import AdminSellers from './Admin/AdminSellers'
import AdminRenters from './Admin/AdminRenters'
import AdminUsers from './Admin/AdminUsers'
import AdminProducts from './Admin/AdminProducts'
//seller imports
import SellerOverview from './Seller/SellerOverview'
import SellerOrders from './Seller/SellerOrders'
import SellerProducts from './Seller/SellerProducts'
//renter imports
import RenterOverview from './Renter/RenterOverview'
import RenterOrders from './Renter/RenterOrders'
import RenterProducts from './Renter/RenterProducts'
//user imports
import UserOverview from './User/UserOverview'


//menus
const adminMenu = ['Overview', 'Sellers', 'Renters', 'Users', 'Products', 'My Profile', 'Sign out']
const sellerMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const renterMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const userMenu = ['Overview', 'My Profile', 'Sign out']

//boards
const adminBoard = [<AdminOverview />, <AdminSellers />, <AdminRenters />, <AdminUsers />, <AdminProducts />, <Profile />]
const sellerBoard = [<SellerOverview/>,<SellerOrders/>,<SellerProducts/>,<Profile/>]
const renterBoard = [<RenterOverview/>,<RenterOrders/>,<RenterProducts/>,<Profile/>]
const userBoard = [<UserOverview/>,<Profile/>]

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
                        else {
                            fetchSellerList().then(sellerList => {
                                if (sellerList.includes(user.email)) {
                                    setStatus('seller')
                                }
                                else {
                                    fetchRenterList().then(renterList => {
                                        if (renterList.includes(user.email)) {
                                            setStatus('renter')
                                        }
                                        else {
                                            fetchUserList().then(userList => {
                                                if (userList.includes(user.email)) {
                                                    setStatus('user')
                                                }/*
                                                else {
                                                    navigate('/')
                                                }*/
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }/* else {
                    navigate('/');
                }*/
            });
            return () => unsubscribe();
        };

        fetchLists();
    }, [navigate, status]);
    return (
        <>
            <Box >
                <Grid container spacing={2} columns={{ xs: 2, sm: 6, md: 12, lg: 12 }}>
                    <Grid justifyContent="center" alignItems="center" item xs={2} sm={4} md={3} lg={3}>
                        <Paper>
                            <MenuList variant='selectedMenu'>
                                {status === 'admin' && adminMenu.map((item, index) => (
                                    <MenuItem key={index} sx={{ height: '5rem' }} onClick={() => setBoard(index)}>{item}</MenuItem>
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