import { Avatar, Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, capitalize, styled, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import { MaterialUISwitch, ProfileBox } from '../../common/NavigationBar/NavigationBar';

//menus
const adminMenu = [
    ['Overview', "M713.664 832H310.208L182.4 959.936 128 905.6 201.6 832H64V64h896v768h-137.664l73.6 73.6-54.336 54.336L713.664 832zM140.8 140.8v614.4h742.4V140.8H140.8zM281.6 256h76.8v384H281.6V256z m384 192h76.8v192h-76.8V448z m-192-96h76.8V640H473.6V352z"],
    ['Admins', "M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9 4h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z"],
    ['Sellers', "M-276.9,265.2h19v14.9h-19V265.2z M-214,253.6h79.5v9.6H-214V253.6z M-214,295.8h79.5v9.6H-214V295.8z M-164.6,251.4c6.1,0,11.1-5.1,11.1-11.3s-5-11.3-11 1-11.3s-11.1,5.1-11.1,11.3S-170.7,251.4-164.6,251.4z M-184.4,250.6 c3.8,0,6.8-3.1,6.8-6.9c0-3.9-3-6.9-6.8-6.9c-3.8,0-6.8,3.1-6.8,6.9C-191.2,247.6-188.2,250.6-184.4,250.6z M-198.3,251.3 c2.5,0,4.4-2,4.4-4.5c0-2.5-1.9-4.5-4.4-4.5s-4.4,2-4.4,4.5C-202.7,249.2-200.7,251.3-198.3,251.3z M-181.4,277.5h28v14.7h-28V277.5 z M-198.2,277.5h8.7v14.7h-8.7V277.5z M-267.1,227.5c9.5,0,17.1,7.7,17.1,17.1s-7.7,17.1-17.1,17.1s-17.1-7.7-17.1-17.1 S-276.6,227.5-267.1,227.5z M-293,291c0-1.3,1.1-2,2-2c1.3,0,2,0.9,2,2v24.7h8.5v-35.6v-14.9h-6.7c-12,0-19.5,9.8-19.5,22.2v28.3 h13.4V291H-293z M-221.8,154.4L-341,179.8v13.5l8.7-0.1v0.1l0,0v213.5h216v-85.7V193.3h8.7v-13.9L-221.8,154.4z M-130.7,321.1 h-186.9V193.3h186.9V321.1z M-254.5,280.1v35.6h8.7V291c0-1.3,1.1-2,2-2c1.3,0,2,1.1,2,2v24.7h13.4v-28c0.2-12.5-7.3-22.4-19.5-22.4 h-6.8v14.9H-254.5z"],
    ['Renters', 'drawer/renter.svg'],
    ['Users', 'drawer/users.svg'],
    ['Products', 'drawer/products.svg'],
    ['Contact us requests', "M1,1v17h4v4l8.5-4H22V1H1z M8,11H5V8h3V11z M13,11h-3V8h3V11z M18,11h-3V8h3V11z"],
    ['My Profile', 'drawer/profile.svg'],
    ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]]
const sellerMenu = [
    ['Overview', "M713.664 832H310.208L182.4 959.936 128 905.6 201.6 832H64V64h896v768h-137.664l73.6 73.6-54.336 54.336L713.664 832zM140.8 140.8v614.4h742.4V140.8H140.8zM281.6 256h76.8v384H281.6V256z m384 192h76.8v192h-76.8V448z m-192-96h76.8V640H473.6V352z"],
    ['Products', 'drawer/products.svg'],
    ['Orders', 'drawer/orders.svg'],
    ['My Profile', 'drawer/profile.svg'],
    ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]]
const renterMenu = [
    ['Overview', "M713.664 832H310.208L182.4 959.936 128 905.6 201.6 832H64V64h896v768h-137.664l73.6 73.6-54.336 54.336L713.664 832zM140.8 140.8v614.4h742.4V140.8H140.8zM281.6 256h76.8v384H281.6V256z m384 192h76.8v192h-76.8V448z m-192-96h76.8V640H473.6V352z"],
    ['Products', 'drawer/products.svg'],
    ['Orders', 'drawer/orders.svg'], 
    ['My Profile', 'drawer/profile.svg'],
     ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]]
const userMenu = [
    ['Overview', "M713.664 832H310.208L182.4 959.936 128 905.6 201.6 832H64V64h896v768h-137.664l73.6 73.6-54.336 54.336L713.664 832zM140.8 140.8v614.4h742.4V140.8H140.8zM281.6 256h76.8v384H281.6V256z m384 192h76.8v192h-76.8V448z m-192-96h76.8V640H473.6V352z"],
    ['My Profile', 'drawer/profile.svg'],
    ['Back to Home', "M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"]]
//boards
const adminBoard = [<AdminOverview />, <Admins />, <AdminSellers />, <AdminRenters />, <AdminUsers />, <AdminProducts />, <ContactusReqs />, <Profile />]
const sellerBoard = [<SellerOverview />, <SellerOrders />, <SellerProducts />, <Profile />]
const renterBoard = [<RenterOverview />, <RenterOrders />, <RenterProducts />, <Profile />]
const userBoard = [<UserOverview />, <Profile />]

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Dashboards({ handleMode }) {
    const [board, setBoard] = React.useState(0)
    const { user } = useAuth()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const showDashboard = () => {
        sessionStorage.setItem('dash', true)
    }
    const handleMenu = (index) => {
        setBoard(index)
        setOpen(false)
    }
    return (
        <>
            <Box >
                <CssBaseline />
                <AppBar position="fixed" open={open} color='inherit'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box display='flex'>
                            <IconButton
                                color={"inherit"}
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginRight: 5,
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                {capitalize(user.role)} DASHBOARD
                            </Typography>
                        </Box>
                        <Box display={'flex'} >
                            <Box>
                                <Tooltip title={`${theme.palette.mode} mode`}>
                                    <FormControlLabel
                                        control={<MaterialUISwitch sx={{ m: 1 }} checked={theme.palette.mode === 'light' ? false : true} onClick={handleMode} />}
                                    />
                                </Tooltip>
                            </Box >
                            <Box>
                                <ProfileBox showDashboard={showDashboard} />
                            </Box>
                        </Box>
                    </Toolbar >
                </AppBar >
                < Drawer variant="permanent" open={open} >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {(user.role === 'admin' ? adminMenu : (user.role === 'seller' ? sellerMenu : (user.role === 'renter' ? renterMenu : userMenu))).map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    onClick={() => handleMenu(index)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor:'inherit'
                                            }}
                                            alt={text[0]}
                                            variant="square" >
                                            <svg

                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                            >
                                                <path d={text[1]} fill={theme.palette.mode === 'light' ? '#000000' : '#ffffff'}/>
                                            </svg>
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={text[0]} sx={{ opacity: open ? 1 : 0 }} onClick={() => setBoard(index)} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer >

                <Grid ml={7} container spacing={2} columns={{ xs: 2, sm: 6, md: 12, lg: 12 }}>
                    <Grid item md={9}>
                        {(user.role === 'admin' ? adminBoard : (user.role === 'seller' ? sellerBoard : (user.role === 'renter' ? renterBoard : userBoard))).map((boardComponent, index) => (
                            board === index && boardComponent
                        ))}
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}