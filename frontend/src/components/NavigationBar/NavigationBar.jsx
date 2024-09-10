import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar, Button, Switch, Tooltip, useTheme, ButtonGroup, Modal, Fade, Backdrop} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { Login, Register } from '../Sign/Sign';
import ModeSwitch from '../ModeHandler/ModeSwitch';
import SearchBar from './SearchBar';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    p: 4,
    backgroundColor: 'background.paper',
    "box-shadow": '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    'backdrop-filter': 'blur( 11.5px )',
    '-webkit-backdrop-filter': 'blur( 11.5px )',
    'border-radius': '10px',
    textAlign: "center"
};

export default function NavigationBar({ handleMode }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const theme = useTheme()
    const [signin, setSignin] = React.useState(false);
    const [signup, setSignup] = React.useState(false);
    const [isLogged, setIsLogged] = React.useState(false);
    const { user,logout} = useAuth()
    const navigate = useNavigate()

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    
    const handleSignout = () => {
        logout();
        const them = sessionStorage.getItem('isLight')
        sessionStorage.clear();
        sessionStorage.setItem('isLight', them)
        setMobileMoreAnchorEl(false)
        navigate('/')
    };

    React.useEffect(() => {
        if (user) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [user])
    const pages = [['Home', '/'], ['Products', '/p/products'], ['Rentals', '/p/rentals'], ['Services', '/p/services'], ['Guide', '/p/guide'], ['Contact', '/p/contact']];

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <Typography>Messages</Typography>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Typography>Notifications</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/d/overview')}>
                <IconButton
                    size="large"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <DashboardIcon />
                </IconButton>
                <Typography>Dashboard</Typography>
            </MenuItem>
            <MenuItem onClick={handleSignout}>
                <IconButton
                    size="large"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <ExitToAppIcon />
                </IconButton>
                <Typography>Signout</Typography>
            </MenuItem>
            
        </Menu>
    );

    const SignBox = ({ sign, closeSign, Comp }) => {
        return (
            <Modal
                open={sign}
                onClose={closeSign}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30',
                    textAlign: 'center'
                }}>
                <Fade in={sign}>
                    <Box sx={style}>
                        {sign ? <Comp closeBox={closeSign} /> : ''}
                    </Box>
                </Fade>
            </Modal>
        )
    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed"
                    sx={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        borderRadius: '0 0 10px 10px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(3px)',
                    }}
                >
                    <Toolbar >
                        <Box>
                            <IconButton
                                size="large"
                                edge="start"
                                color={theme.palette.primary.main}
                                onClick={handleOpenNavMenu}
                                sx={{ mr: 2, [theme.breakpoints.up('md')]: { display: 'none' } }}
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
                                        <Typography component="a" textAlign="center" href={page[1]} sx={{ textDecoration: 'none', color: theme.palette.primary }}>
                                            {page[0]}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
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
                                color: theme.palette.primary.main
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
                                    href={page[1]}
                                >
                                    {page[0]}
                                </Button>
                            ))}
                        </Box>
                        <SearchBar/>
                        <Box sx={{ flexGrow: 1 }} />
                        <ModeSwitch handleMode={handleMode} />
                        {isLogged ? (
                            <ProfileBox isLogged={isLogged} handleProfileClick={handleMobileMenuOpen} />
                        ) : (
                            <>
                                <ButtonGroup variant="text">
                                    <Button sx={{ color: theme.palette.primary }} onClick={() => setSignin(true)}>Sign In</Button>
                                    <Button sx={{ color: theme.palette.primary }} onClick={() => setSignup(true)}>Sign Up</Button>
                                </ButtonGroup>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
            </Box>
            <SignBox sign={signin} closeSign={() => setSignin(false)} Comp={Login} />
            <SignBox sign={signup} closeSign={() => setSignup(false)} Comp={Register} />
        </>
    );
}

export function ProfileBox({ handleProfileClick }) {
    const theme = useTheme();

    return (
        <>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton size="large" aria-label="show 4 new mails" color={theme.palette.primary.main}>
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color={theme.palette.primary.main}
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Box>
            <Box sx={{ flexGrow: 0, display: 'block' }}>
                <Tooltip title="Open dashboard">
                    <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                        <Avatar alt="User Profile" src={sessionStorage.getItem('pp')} />
                    </IconButton>
                </Tooltip>
            </Box>
        </>
    );
}

//export const 
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