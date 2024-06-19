import { Avatar, Box, CssBaseline, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, capitalize, styled, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as React from 'react'
import { useAuth } from '../../../backend/AuthContext'


import { MaterialUISwitch, ProfileBox } from '../../common/NavigationBar/NavigationBar';
import { adminBoard, adminMenu, renterBoard, renterMenu, sellerBoard, sellerMenu, userBoard, userMenu } from './menuLists';

//menus

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