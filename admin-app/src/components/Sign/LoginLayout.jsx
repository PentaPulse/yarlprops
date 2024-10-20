import React, { useState } from 'react';
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl,
    FormControlLabel, FormLabel, Grid, OutlinedInput, Stack, styled, SvgIcon, TextField, Typography
} from '@mui/material';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../api/firebase';
import { Link, useNavigate } from 'react-router-dom';
import MuiCard from '@mui/material/Card';
import PropTypes from 'prop-types';
import { useAuth } from '../../api/AuthContext';
import NavigationBar from '../NavigationBar/NavigationBar';

export function LoginLayout({ handleMode }) {
    const [signin, setSignin] = useState(true);

    return (
        <Box>
            <NavigationBar handleMode={handleMode} />
            <Grid container mt={10} justifyContent="space-around" alignItems="center">
                <SignIn signin={signin} setSignin={() => setSignin(false)} />
                <SignUp signin={signin} setSignin={() => setSignin(true)} />
            </Grid>
        </Box>
    );
}

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    },
}));

function SignIn({ signin, setSignin }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email.');
            return;
        }

        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/overview');
        } catch (error) {
            console.error(error);
            alert('Failed to sign in. Please check your credentials.');
        }
    };

    const provider = new GoogleAuthProvider();
    const handleGoogleLogin = () =>
        signInWithPopup(auth, provider).then(() => {
            navigate('/overview');
        }).catch((error) => {
            console.error(error);
            alert('Google sign-in failed.');
        });

    return (
        <SignInContainer display={signin ? 'flex' : 'none'} direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>Sign in</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField type="email" name="email" placeholder="your@email.com" autoComplete="email" autoFocus required fullWidth variant="outlined" />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Link component="button" onClick={handleClickOpen} variant="body2">Forgot your password?</Link>
                        </Box>
                        <TextField name="password" placeholder="••••••" type="password" autoComplete="current-password" required fullWidth variant="outlined" />
                    </FormControl>
                    <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
                    <ForgotPassword open={open} handleClose={handleClose} />
                    <Button type="submit" fullWidth variant="contained">Sign in</Button>
                    <Typography sx={{ textAlign: 'center' }}>Don't have an account? <Button onClick={setSignin}>Sign up</Button></Typography>
                </Box>
                <Divider>or</Divider>
                <Button fullWidth variant="outlined" onClick={handleGoogleLogin} startIcon={<GoogleIcon />}>Sign in with Google</Button>
            </Card>
        </SignInContainer>
    );
}

function ForgotPassword({ open, handleClose }) {
    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: (e) => { e.preventDefault(); handleClose(); } }}>
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DialogContentText>Enter your account's email address, and we'll send you a link to reset your password.</DialogContentText>
                <OutlinedInput autoFocus required margin="dense" id="email" name="email" type="email" fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit">Continue</Button>
            </DialogActions>
        </Dialog>
    );
}

ForgotPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function SignUp({ signin, setSignin }) {
    const { register } = useAuth();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email.');
            return;
        }

        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            await register(firstname, lastname, `${firstname} ${lastname}`, email, password);
        } catch (error) {
            console.error(error);
            alert('Sign up failed.');
        }
    };

    return (
        <SignUpContainer display={!signin ? 'flex' : 'none'} direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography component="h1" variant="h4">Sign up</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel>First name</FormLabel>
                        <TextField required placeholder="Jon" fullWidth onChange={(e) => setFirstname(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Last name</FormLabel>
                        <TextField required placeholder="Snow" fullWidth onChange={(e) => setLastname(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <TextField required placeholder="your@email.com" fullWidth onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <TextField required type="password" placeholder="••••••" fullWidth onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained">Sign up</Button>
                    <Typography sx={{ textAlign: 'center' }}>Already have an account? <Button onClick={setSignin}>Sign in</Button></Typography>
                </Box>
                <Divider>or</Divider>
                <Button fullWidth variant="outlined" onClick={() => alert('Sign up with Google')} startIcon={<GoogleIcon />}>Sign up with Google</Button>
            </Card>
        </SignUpContainer>
    );
}

SignIn.propTypes = {
    signin: PropTypes.bool.isRequired,
    setSignin: PropTypes.func.isRequired,
};

SignUp.propTypes = {
    signin: PropTypes.bool.isRequired,
    setSignin: PropTypes.func.isRequired,
};

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