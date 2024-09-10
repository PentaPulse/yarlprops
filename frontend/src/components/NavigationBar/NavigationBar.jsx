import * as React from 'react';
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
import { Button,useTheme, ButtonGroup, Modal, Fade, Backdrop} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { Login, Register } from '../Sign/Sign';
import ModeSwitch from '../ModeHandler/ModeSwitch';
import SearchBar from './SearchBar';
import ProfileBox from '../ProfileBox/ProfileBox';

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
            <MenuItem sx={{[theme.breakpoints.up('md')]:{display:'none'}}}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <Typography>Messages</Typography>
            </MenuItem>
            <MenuItem sx={{[theme.breakpoints.up('md')]:{display:'none'}}}>
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
                                        <Button textAlign="center" onClick={()=>navigate(page[1])} sx={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                                            {page[0]}
                                        </Button>
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
                                    onClick={()=>navigate(page[1])}
                                    sx={{ my: 2, display: 'block', color: theme.palette.primary }}
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