import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Switch, FormControlLabel, ButtonGroup, Modal, Backdrop, Fade, TextField, Stepper, Step, StepLabel, FormControl, InputLabel, Select, StepContent } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../backend/AuthContext';

const pages = [['Home', '/'], ['Products', '/products'], ['Services', '/services'], ['Guide', '/guide'], ['Contact', '/contact']];
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
    const [isLogged, setIsLogged] = React.useState(false);
    const { user } = useAuth()
    const theme = useTheme();
    const [signin, setSignin] = React.useState(false);
    const [signup, setSignup] = React.useState(false);


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
        <>
            <AppBar position="fixed" sx={{
                background: 'rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                borderRadius: '0 0 10px 10px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(3px)',
            }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
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
                                color={theme.palette.mode === 'light' ? '#000000' : '#FFFFFF'}
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
                                color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
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
                        <Box>
                            <Tooltip title={`${theme.palette.mode} mode`}>
                                <FormControlLabel
                                    control={<MaterialUISwitch sx={{ m: 1 }} checked={theme.palette.mode === 'light' ? false : true} onClick={handleMode} />}
                                />
                            </Tooltip>
                        </Box>

                        {isLogged ? (
                            <ProfileBox isLogged={isLogged} />
                        ) : (
                            <>
                                <ButtonGroup variant="text">
                                    <Button sx={{ color: theme.palette.primary }} onClick={() => setSignin(true)}>Sign In</Button>
                                    <Button sx={{ color: theme.palette.primary }} onClick={() => setSignup(true)}>Sign Up</Button>
                                </ButtonGroup>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={signin}
                onClose={() => setSignin(false)}
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
                <Fade in={signin}>
                    <Box sx={style}>
                        {signin ? <Login closeBox={() => setSignin(false)} /> : ''}
                    </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={signup}
                onClose={() => setSignup(false)}
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
                <Fade in={signup}>
                    <Box sx={style}>
                        {signup ? <RegisterSteps /> : ''}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}

export function ProfileBox() {
    const theme = useTheme();
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleSignout = () => {
        logout()
        const them = sessionStorage.getItem('isLight')
        sessionStorage.clear();
        sessionStorage.setItem('isLight', them)
        navigate('/')
    };

    const handleDashboards = () => {
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

export function Login({ closeBox }) {
    const theme = useTheme()
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const { login, reset, google } = useAuth();
    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            await google();
            closeBox();
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {

        }
    }
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await reset(email);
        } catch (error) {

        }
    }
    return (
        <>
            <div className="d-flex flex-column gap-2">
                <h2>Welcome to YarlProps</h2>
                <Button sx={{ borderRadius: '100px', width: '80%', border: `1px solid ${theme.palette.mode === 'light' ? '#FFFFFF' : '#000000'}`, gap: 3, display: 'block', margin: 'auto' }} onClick={handleGoogle}>
                    <img src="social-icons/google.svg" alt="G" width={30} /> Connect with Google
                </Button>
                <h5>OR</h5>
                <hr />
                <div className="d-flex flex-column gap-4">
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Typography onClick={handleReset}>Forgot Your Password?</Typography>
                </div>
                <div className="text-center">
                    <ButtonGroup aria-label='Vertical button group' className='gap-3'>
                        <Button variant='contained' onClick={handleLogin}>Signin</Button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}

//register
/*
const steps = [{
    label:'Choose role',
    description:<Register/>,
},{
    label:'Choose role',
    description:'',
},{
    label:'Choose role',
    description:'',
},
];*/

function RegisterSteps() {
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = ['Personal Information', 'Contact Details', 'Review & Submit'];

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={index} {...stepProps}>
                            <StepLabel {...labelProps}>{step}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Button onClick={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}

function Register({ handleBack }) {
    const [fname, setFname] = React.useState('');
    const [lname, setLname] = React.useState('');
    const [dname, setDname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');
    const { register } = useAuth();

    const roles = ['', 'Seller', 'Renter', 'Buyer'];

    const handleFname = (e) => {
        const value = e.target.value;
        setFname(value);
        setDname(value + " " + lname);
    };

    const handleLname = (e) => {
        const value = e.target.value;
        setLname(value);
        setDname(fname + " " + value);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(fname, lname, dname, email, password, role);
        } catch (error) {

        }
    }

    const handleSelectChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div className="d-flex flex-column justify-content-center text-center">
            <h2>Create account</h2>
            <hr />
            <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-4 w-100">
                    <TextField className="w-50" label="First name" value={fname} onChange={handleFname} required />
                    <TextField className="w-50" label="Last name" value={lname} onChange={handleLname} required />
                </div>
                <TextField label="Display name" value={dname} disabled />
                <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
                    <InputLabel>Role</InputLabel>
                    <Select value={role} onChange={handleSelectChange} required>
                        {roles.map((role, index) => (
                            <MenuItem key={index} value={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="text-center">
                    <ButtonGroup aria-label="Vertical button group" className="gap-3 text-center">
                        <Button variant="contained" onClick={handleBack}>Back</Button>
                        <Button variant="contained" onClick={handleRegister}>Register</Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}