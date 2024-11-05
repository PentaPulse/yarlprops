import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Button, useTheme, ButtonGroup, Modal, Fade, Backdrop, Drawer, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { Login, Register } from '../Sign/Sign';
import ModeSwitch from '../ModeHandler/ModeSwitch';
import SearchBar from './SearchBar';
import ProfileBox from '../ProfileBox/ProfileBox';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Notifications from '../Notifications/Notifications';

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

export default function NavigationBar({ handleMode, signin, setSignin, signup, setSignup }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const theme = useTheme()
    const [isLogged, setIsLogged] = React.useState(false);
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [page,setPage]=React.useState('Home');

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

    const handleNavigatePages=(array)=>{
        setPage(array[0])
        navigate(array[1])
    }

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
            <MenuItem sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}>
                <IconButton
                    size="large"
                    color="inherit"
                >
                    <Notifications/>
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
                        <Box sx={{ [theme.breakpoints.up('lg')]: { display: 'none' }, display: 'flex' }}>
                            <IconButton aria-label="Menu button" onClick={handleOpenNavMenu}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="top" open={anchorElNav} onClose={handleCloseNavMenu}>
                                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <IconButton onClick={handleCloseNavMenu}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ my: 3 }} />
                                    {pages.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Button textAlign="center" onClick={()=>handleNavigatePages(page)} sx={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                                                {page[0]}
                                            </Button>
                                        </MenuItem>
                                    ))}
                                    <MenuItem>
                                        <Button color="primary" variant="contained" fullWidth onClick={() => setSignup(true)}>
                                            Sign up
                                        </Button>
                                    </MenuItem>
                                    <MenuItem>
                                        <Button color="primary" variant="outlined" fullWidth onClick={() => setSignin(true)}>
                                            Sign in
                                        </Button>
                                    </MenuItem>
                                </Box>
                            </Drawer>
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                [theme.breakpoints.down('lg')]: { display: 'none' },
                                display: 'flex',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                textDecoration: 'none',
                                color: theme.palette.primary.main
                            }}
                        >
                             {/* YarlProps  */}
                            <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="YarlProps logo" 
                            style={{ 
                                height: '70px',
                                width: '70px',
                                 marginRight: '20px',
                                 borderRadius: '60%', 
                                 border: '2px solid #ccc'
                                  }} />
                        </Typography>
                        <Box sx={{
                            flexGrow: 1, [theme.breakpoints.down('lg')]: { display: 'none' },
                            display: 'flex',
                        }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={()=>handleNavigatePages(page)}
                                    sx={{ my: 2, display: 'block', color: theme.palette.primary }}
                                >
                                    {page[0]}
                                </Button>
                            ))}
                        </Box>
                        <SearchBar page={page}/>
                        <Box sx={{ flexGrow: 1 }} />
                        <ModeSwitch handleMode={handleMode} />
                        {isLogged ? (
                            <>
                            <Notifications/>
                            <ProfileBox isLogged={isLogged} handleProfileClick={handleMobileMenuOpen} />
                            </>
                        ) : (
                            <>
                                <ButtonGroup variant="text" sx={{ [theme.breakpoints.down('lg')]: { display: 'none' } }}>
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