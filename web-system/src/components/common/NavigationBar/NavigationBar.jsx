import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Switch, FormControlLabel } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { authUser } from '../../../backend/autharization';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../backend/AuthContext';

const pages = ['Home','Products',/* 'Guide',*/ 'About', 'Contact'];

export default function NavigationBar({ handleLoginButton, handleMode ,showDashboard}) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [isLogged, setIsLogged] = React.useState(false);
    const {user} = useAuth()
    const theme = useTheme();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    
    React.useEffect(() => {
            if (user) {
                setIsLogged(true);
                sessionStorage.setItem('pp', user.photoURL);
                sessionStorage.setItem('displayName', user.displayName);
            } else {
                setIsLogged(false);
            }
    }, [user])

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
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: theme.palette.mode === 'light' ? '#000000' : '#FFFFff' }} />
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
                            letterSpacing: '.2rem',
                            textDecoration: 'none',
                            color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
                        }}
                    >
                        YarlProps
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
                        YarlProps
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
                            <FormControlLabel
                                control={<MaterialUISwitch sx={{ m: 1 }} checked={theme.palette.mode === 'light' ? false : true} onClick={handleMode} />}
                            />
                        </Tooltip>
                    </Box>

                    {isLogged ? (
                        <ProfileBox isLogged={isLogged} showDashboard={showDashboard}/>
                    ) : (
                        <Button sx={{ color: theme.palette.primary }} onClick={handleLoginButton}>Sign In</Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export function ProfileBox({ isLogged }) {
    const theme = useTheme();
    const navigate = useNavigate()

    const handleSignout = () => {
        isLogged = false
        authUser.signOut()
        const them = sessionStorage.getItem('isLight')
        sessionStorage.clear();
        sessionStorage.setItem('isLight', them)
        navigate('/')
    };

    const handleDashboards = (e) => {
        navigate(`/dashboard`)
    }

    return (
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', borderWidth: '1px', borderStyle: 'solid', borderColor: theme.palette.mode === 'light' ? 'black' : 'white', borderRadius: '5px 25px', padding: '0 10px' }}>
            <Tooltip title="Open dashboard">
                <IconButton onClick={handleDashboards} sx={{ p: 0 }}>
                    <Avatar alt="User Profile" src={sessionStorage.getItem('pp')} />
                </IconButton>
            </Tooltip>
            <Box sx={{ textAlign: 'center', ml: 1 }}>
                <Typography color={theme.palette.mode === 'light' ? 'black' : 'white'}>
                    {sessionStorage.getItem('displayName')}
                </Typography>
                <Button variant="contained" onClick={handleSignout}>Sign Out</Button>
            </Box>
        </Box>
    );
}

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));