import { Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Toolbar, Tooltip, Typography, styled, useTheme } from '@mui/material'
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
const adminMenu = ['Overview', 'Admins', 'Sellers', 'Renters', 'Users', 'Products', 'Contact us requests', 'My Profile', 'Sign out']
const sellerMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const renterMenu = ['Overview', 'Products', 'Orders', 'My Profile', 'Sign out']
const userMenu = ['Overview', 'My Profile', 'Sign out']

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
    // necessary for content to be below app bar
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

function Structure({ handleMode }) {
    const [board, setBoard] = React.useState(0)
    const [status, setStatus] = React.useState('')
    const { user } = useAuth()
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
                            {user.role} DASHBOARD
                        </Typography>

                        <Box>
                            <Tooltip title={`${theme.palette.mode} mode`}>
                                <FormControlLabel
                                    control={<MaterialUISwitch sx={{ m: 1 }} checked={theme.palette.mode === 'light' ? false : true} onClick={handleMode} />}
                                />
                            </Tooltip>
                        </Box >
                        <ProfileBox/>
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
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
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
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
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
                                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer >
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
                                {status === "buyer" && userMenu.map((item, index) => (
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
                            {status === "buyer" && userBoard.map((boardComponent, index) => (
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