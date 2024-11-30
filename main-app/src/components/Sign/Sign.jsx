import * as React from "react";
import { Button, SvgIcon, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme, Grid } from "@mui/material";
import { useAuth } from "../../api/AuthContext";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAlerts } from "../../api/AlertService";
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
        <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h4" align="center">Welcome to YarlProps</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Button
                    fullWidth
                    sx={{ borderRadius: '100px', border: `1px solid ${theme.palette.mode === 'light' ? '#FFFFFF' : '#000000'}` }}
                    onClick={handleGoogle}
                >
                    <GoogleIcon /> Connect with Google
                </Button>
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography variant="body1" align="center">OR</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography
                    onClick={handleReset}
                    sx={{ cursor: 'pointer', color: theme.palette.primary.main, textAlign: 'center' }}
                >
                    Forgot Your Password?
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Button variant="contained" onClick={handleLogin} fullWidth>Sign in</Button>
            </Grid>
        </Grid>
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
    const { register } = useAuth()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !displayName || !email || !password) {
            return showAlerts('Enter details to Register', 'warning')
        } else {
            await register(email, password, firstName, lastName, displayName)
            closeBox()
        }
    }

    return (
        <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h4" align="center">Create Account</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setDisplayName(`${e.target.value} ${lastName}`); }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setDisplayName(`${firstName} ${e.target.value}`); }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    label="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
                <Button variant="contained" onClick={handleRegister} fullWidth>Register</Button>
            </Grid>
        </Grid>
    );
}