import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { authUser } from '../../../backend/autharization'; // Assuming this is correct
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const pages = ['Home', 'Guide', 'About', 'Contact'];
const settings = ['Profile', 'Account', 'Dashboard'];
let pp = ''
export default function NavigationBar({ handleLoginButton, handleMode }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const theme = useTheme();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    sessionStorage.setItem('user', authUser.currentUser)
    const user = sessionStorage.getItem('user')
    if (user) {
        sessionStorage.setItem('pp', user.photoURL)
        pp = sessionStorage.getItem('pp')
    }

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
                                    <Typography component="a" textAlign="center" href={`/${page.toLowerCase()}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
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
                                sx={{ my: 2, display: 'block', color: 'inherit' }}
                                href={`/${page.toLowerCase()}`}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        <Tooltip title={`${theme.palette.mode} mode`}>
                            <IconButton sx={{ ml: 1 }} onClick={handleMode} color="inherit">
                                {theme.palette.mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {!user ? (
                        <Button sx={{ color: 'inherit' }} onClick={handleLoginButton}>Sign In</Button>
                    ) : (
                        <ProfileBox user={user} />
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

function ProfileBox({ user }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [photo, setPhoto] = React.useState('');
    const theme = useTheme();

    React.useEffect(() => {
        if (user) {
            setPhoto(sessionStorage.getItem('pp'));
        }
    }, [user]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignout = () => {
        authUser.signOut();
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', border: '1px solid', borderRadius: '5px 25px', padding: '0 10px' }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Profile" src={photo} />
                </IconButton>
            </Tooltip>
            <Box sx={{ textAlign: 'center', ml: 1 }}>
                <Typography color={theme.palette.mode === 'light' ? 'black' : 'white'}>
                    {user?.displayName}
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
