import { Avatar, Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, styled, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as React from 'react'
import { useAuth } from '../api/AuthContext'
import { MaterialUISwitch, ProfileBox } from '../components/NavigationBar/NavigationBar';
import { adminMenu, backToHome, merchMenu, userMenu } from '../components/menuLists';
import {  useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';

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

export default function DashboardLayout({ handleMode ,children}) {
    const [open, setOpen] = React.useState(false);
    const [adminList, setAdminList] = React.useState([]);
    const [merchantList, setMerchantList] = React.useState([]);
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
    React.useEffect(() => {
        const fetchAdminList = async () => {
            try {
                const q = await getDocs(query(collection(db, 'admins'), where('approved', '==', true)))
                const list = q.docs.map((doc) => doc.data().uid)
                setAdminList(list);
            } catch (e) {

            }
        }
        const fetchMerchantList = async () => {
            try {
                const q = await getDocs(query(collection(db, 'systemusers'), where('isMerchant', '==', true)))
                const list = q.docs.map((doc) => doc.data().uid)
                setMerchantList(list)
            } catch (e) {

            }
        }
        fetchAdminList()
        fetchMerchantList()
    }, [])

    const drawer = (
            <List >
                {(adminList.includes(user.uid) ? adminMenu : (merchantList.includes(user.uid) ? merchMenu : userMenu)).map((text, index) => (
                    <ListItem key={text} disablePadding >
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
                <ListItem disablePadding >
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
    )
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
                <Box>
                    < Drawer sx={{ display: { xs: 'block', sm: 'block', md: 'none', lg: 'none' },'& .MuiDrawer-paper': { boxSizing: 'border-box' ,color:'inherit'}, }} variant={open?"permanent":'temporary'} open={open} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose} >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        {drawer}
                    </Drawer >
                    < Drawer sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }} variant="permanent" open={open} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose} >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        {drawer}
                    </Drawer >

                </Box>
                <Grid container sx={{ pl: { xs: 0, sm: 0, md: 10, lg: 10 }, pt: { xs: 10, sm: 10, md: 10, lg: 10 } }} pt={10} columns={24} columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} rowSpacing={{ xs: 3, sm: 3, md: 2, lg: 2 }}>
                    {children}
                </Grid>
            </Box >
        </>
    )
}