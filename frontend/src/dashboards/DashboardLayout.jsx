import { Avatar, Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, styled, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as React from 'react'
import { useAuth } from '../api/AuthContext'
import { MaterialUISwitch, ProfileBox } from '../components/NavigationBar/NavigationBar';
import { adminMenu, backToHome, merchMenu, userMenu } from './menuLists';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminOverview from './Admin/AdminOverview';
import UserOverview from './User/UserOverview';
import Profile from './UserProfile';
import Admins from './Admin/Admins';
import AdminUsers from './Admin/AdminUsers';
import AdminProducts from './Admin/AdminProducts';
import AdminServices from './Admin/AdminServices';
import ContactusRequests from './Admin/ContactusReqs';
import MerchantProducts from './Merchant/MerchantProducts';
import MerchantRentals from './Merchant/MerchantRentals';
import MerchantServices from './Merchant/MerchantServices';
import MerchantOrders from './Merchant/MerchantOrders';
import MerchantOverview from './Merchant/MerchantOverview';

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

export default function DashboardLayout({ handleMode }) {
    const [open, setOpen] = React.useState(false);
    const { user } = useAuth()
    const theme = useTheme();
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleMenu = (path) => {
        navigate(`/d/${path}`)
        setOpen(false)
    }
    const back = () => {
        navigate('/')
    }
    return (
        <>
            <Box mt={5}>
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
                                MY DASHBOARD
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
                                <ProfileBox />
                            </Box>
                        </Box>
                    </Toolbar >
                </AppBar >
                < Drawer variant="permanent" open={open} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose} >
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {(user.adminid ? adminMenu : (user.isMerchant ? merchMenu : userMenu)).map((text, index) => (
                            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    onClick={() => handleMenu(text[2], text[3])}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {text[1]}
                                    </ListItemIcon>
                                    <ListItemText primary={text[0]} sx={{ opacity: open ? 1 : 0 }} onClick={() => handleMenu(text[2], text[3])} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={back}
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
                                            bgcolor: 'inherit'
                                        }}
                                        alt={backToHome[0]}
                                        variant="square"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            fill={theme.palette.mode === 'light' ? '#000000' : '#ffffff'}
                                        >
                                            <path d={backToHome[1]} />
                                        </svg>
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary={backToHome[0]} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer >
                <Grid item m='5vh 2vw 0 8vw'>
                    <Routes>
                        {/* Common */}
                        <Route path='overview' element={user.adminid?<AdminOverview />:(user.isMerchant?<MerchantOverview/>:<UserOverview/>)} />
                        <Route path='profile' element={<Profile/>}/>

                        {/* Admin */}
                        <Route path='adminlist' element={<Admins/>}/>
                        <Route path='userlist' element={<AdminUsers/>} />
                        <Route path='productlist' element={<AdminProducts/>} />
                        <Route path='servicelist' element={<AdminServices />} />
                        <Route path='contactreqs' element={<ContactusRequests />} />
                        {/* Merch */}
                        <Route path='myproducts' element={<MerchantProducts/>} />
                        <Route path='myrentals' element={<MerchantRentals/>} />
                        <Route path='myservices' element={<MerchantServices/>} />
                        <Route path='myorders' element={<MerchantOrders/>} />
                        {/* Cust */}
                    </Routes>
                </Grid>
            </Box >
        </>
    )
}