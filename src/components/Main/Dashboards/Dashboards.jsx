import { Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Toolbar, Tooltip, Typography, capitalize, styled, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
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
const adminMenu = ['Overview', 'Admins', 'Sellers', 'Renters', 'Users', 'Products', 'Contact us requests', 'My Profile', 'Back to Home']
const sellerMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Back to Home']
const renterMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Back to Home']
const userMenu = ['Overview', 'My Profile', 'Back to Home']

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
    const [status, setStatus] = React.useState('')
    const { user, home } = useAuth()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setStatus(user.role)
    }, [user]);
    const showDashboard = () => {
        const had = sessionStorage.getItem('dash')
        sessionStorage.setItem('dash', !had)
    }
    return (
        <>
            <Box >
                <CssBaseline />
                <AppBar position="fixed" open={open} color='inherit'>
                    <Toolbar>
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
                                    onClick={() => setBoard(index)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} onClick={() => setBoard(index)} />
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