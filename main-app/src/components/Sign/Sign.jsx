import * as React from "react";
import { Button, SvgIcon, ButtonGroup, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../api/AuthContext";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAlerts } from "../../api/AlertService";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../api/firebase";
import { registerUser } from "../../api/db/users";
function GoogleIcon() {
    return (
        <SvgIcon>
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
                    fill="#4285F4"
                />
                <path
                    d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
                    fill="#34A853"
                />
                <path
                    d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z"
                    fill="#FBBC05"
                />
                <path
                    d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z"
                    fill="#EA4335"
                />
            </svg>
        </SvgIcon>
    );
}
export function Login({ closeBox }) {
    const theme = useTheme();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { login, reset, google } = useAuth();
    const showAlerts = useAlerts();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            await google();
            closeBox();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return showAlerts('Enter details to Sign in', 'warning');
        } else {
            try {
                await login(email, password);
                closeBox();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await reset(email);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="d-flex flex-column gap-2">
            <h2>Welcome to YarlProps</h2>
            <Button
                sx={{
                    borderRadius: '100px',
                    width: '80%',
                    border: `1px solid ${theme.palette.mode === 'light' ? '#FFFFFF' : '#000000'}`,
                    gap: 3,
                    display: 'block',
                    margin: 'auto',
                }}
                onClick={handleGoogle}
            >
                <GoogleIcon /> Connect with Google
            </Button>
            <h5>OR</h5>
            <hr />
            <div className="d-flex flex-column gap-4">
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin(e);
                        }
                    }}
                />
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLogin(e);
                            }
                        }}
                    />
                </FormControl>
                <Typography
                    onClick={handleReset}
                    style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                >
                    Forgot Your Password?
                </Typography>
            </div>
            <div className="text-center">
                <ButtonGroup aria-label="Vertical button group" className="gap-3">
                    <Button variant="contained" onClick={handleLogin}>
                        Sign in
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}

export function Register({ closeBox }) {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const { showAlerts } = useAlerts()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !displayName || !email || !password) {
            return showAlerts('Enter details to Register', 'warning')
        } else {
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                    .then((result) => {
                        const user = result.user;
                        updateProfile(user, { displayName: displayName })
                            .then(() => {
                                registerUser(user.uid, firstName, lastName, displayName, email).then((result) => {
                                    if (result.success) {
                                        sessionStorage.setItem('pp', user.photoURL);
                                        sessionStorage.setItem('displayName', user.displayName);
                                    }
                                })
                            })
                        const manager = new Notification(user)
                        manager.welcomeNotification(user)
                        showAlerts('Account created , wait a little ', 'success', 'top-center')
                    })
                    .catch((error) => {
                        //showAlerts('ww' + error, 'error')
                        if (email === '' || password === '' || firstName === '' || lastName === '') {
                            if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-password') {
                                showAlerts('Enter details', 'warning')
                            }
                        } else if (error.code === 'auth/invalid-email') {
                            showAlerts('Try different email', 'warning')
                        }
                        if (error.code === 'auth/email-already-in-use') {
                            showAlerts('Try different email', 'warning')
                        }
                        if (error.code === 'auth/weak-password') {
                            showAlerts('Try different password', 'warning')
                        }
                    });
                closeBox()
            } catch (error) {
                console.error(error);
                throw error
            }
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center text-center">
            <h2>Create account</h2>
            <hr />
            <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-4 w-100">
                    <TextField className="w-50" label="First name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setDisplayName(e.target.value + " " + lastName); }} required />
                    <TextField className="w-50" label="Last name" value={lastName} onChange={(e) => { setLastName(e.target.value); setDisplayName(firstName + " " + e.target.value); }} required />
                </div>
                <TextField label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <TextField label="Email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <div className="text-center">
                    <Button variant="contained" onClick={handleRegister}>Register</Button>
                </div>
            </div>
        </div>
    );
}