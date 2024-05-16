import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { authUser } from '../../../backend/autharization';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const pages = ['Home', 'Guide', 'About', 'Contact'];
const settings = ['Profile', 'Account', 'Dashboard'];

export default function NavigationBar({ handleLoginButton, handleMode }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [isLogged,setIsLogged] = React.useState(false);
    const theme = useTheme();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    React.useEffect(() => {
        const unsubscribe = authUser.onAuthStateChanged((user) => {
            if (user) {
                setIsLogged(true);
                sessionStorage.setItem('pp', user.photoURL);
                sessionStorage.setItem('displayName', user.displayName);
            } else {
                setIsLogged(false);
            }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [])

    return (
        <AppBar position="fixed" sx={{
            background: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            borderRadius: '0 0 10px 10px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(3px)',
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                            color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }, color: 'black'
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography component="a" textAlign="center" href={`/${page.toLowerCase()}`} sx={{ textDecoration: 'none', color: theme.palette.primary }}>
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, display: 'block', color: theme.palette.primary }}
                                href={`/${page.toLowerCase()}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        <Tooltip title={`${theme.palette.mode} mode`}>
                            <IconButton sx={{ ml: 1, color: theme.palette.primary }} onClick={handleMode}>
                                {theme.palette.mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {isLogged ? (
                        <ProfileBox isLogged={isLogged} />
                    ) : (                        
                        <Button sx={{ color: theme.palette.primary }} onClick={handleLoginButton}>Sign In</Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

function ProfileBox({ isLogged }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const theme = useTheme();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignout = () => {
        isLogged = false
        authUser.signOut()
        const them = sessionStorage.getItem('isLight')
        sessionStorage.clear();
        sessionStorage.setItem('isLight',them)
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', border: '1px solid', borderRadius: '5px 25px', padding: '0 10px' }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Profile" src={sessionStorage.getItem('pp')} />
                </IconButton>
            </Tooltip>
            <Box sx={{ textAlign: 'center', ml: 1 }}>
                <Typography color={theme.palette.mode === 'light' ? 'black' : 'white'}>
                    {sessionStorage.getItem('displayName')}
                </Typography>
                <Button variant="contained" onClick={handleSignout}>Sign Out</Button>
            </Box>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" component="a" href={`/${setting.toLowerCase()}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {setting}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
