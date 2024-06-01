import { Box, Grid, MenuItem, MenuList, Paper } from '@mui/material'
import * as React from 'react'
import Profile from './UserProfile'
import { useAuth } from '../../../backend/AuthContext'

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
import ContactusReqs from './Admin/ContactusReqs'
import Admins from './Admin/Admins'

//menus
const adminMenu = ['Overview','Admins', 'Sellers', 'Renters', 'Users', 'Products','Contact us requests', 'My Profile', 'Sign out']
const sellerMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const renterMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const userMenu = ['Overview', 'My Profile', 'Sign out']

//boards
const adminBoard = [<AdminOverview />,<Admins/>, <AdminSellers />, <AdminRenters />, <AdminUsers />, <AdminProducts />,<ContactusReqs/>, <Profile />]
const sellerBoard = [<SellerOverview />, <SellerOrders />, <SellerProducts />, <Profile />]
const renterBoard = [<RenterOverview />, <RenterOrders />, <RenterProducts />, <Profile />]
const userBoard = [<UserOverview />, <Profile />]

function Structure() {
    const [board, setBoard] = React.useState(0)
    const [status, setStatus] = React.useState('')
    const { user } = useAuth()

    React.useEffect(() => {
        setStatus(user.role)
    }, [user]);
    return (
        <>
            <Box >
                <Grid container spacing={2} columns={{ xs: 2, sm: 6, md: 12, lg: 12 }}>
                    <Grid justifyContent="center" alignItems="center" item xs={2} sm={4} md={3} lg={3}>
                        <Paper>
                            <MenuList variant='selectedMenu'>
                                {status === 'admin' && adminMenu.map((item, index) => (
                                    <MenuItem key={index} sx={{ height: '4rem' }} onClick={() => setBoard(index)}>{item}</MenuItem>
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