import React from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../api/firebase';
import { useAlerts } from '../../api/AlertService';
import { registerAdmin } from '../../api/db/users';

function AdminLogin({ handleMode }) {
    const [lemail, setlEmail] = React.useState('')
    const [remail, setrEmail] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [lpassword, setlPassword] = React.useState('')
    const [rpassword, setrPassword] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [displayName, setDisplayName] = React.useState('')
    const showAlerts = useAlerts()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            const admin = result.user;
            registerAdmin(admin.uid, '', '', admin.displayName, admin.email);
            showAlerts('Successfully logged', 'success')
        })
        .catch(() => {
            showAlerts('Error occured , Try again with different gmail', 'error')
        })

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, lemail, lpassword)
                .then((result) => {
                    const admin = result.user;
                    showAlerts('Successfully logged', 'success')
                })
            //window.location.reload();
        } catch (error) {
            console.error(error);
            // Consider adding user feedback here instead of just throwing the error
        }
    }
    const handleRegister = () => createUserWithEmailAndPassword(auth, remail, rpassword)
        .then((result) => {
            const admin = result.user;
            registerAdmin(admin.uid, firstName, lastName, displayName, remail);
            showAlerts('Successfully logged', 'success')
        })
        .catch(() => {
            showAlerts('Error occured , Try again with different credentials', 'error')
        })

    return (
        <>
            <NavigationBar handleMode={handleMode} />
            <Grid container mt={10} justifyContent='space-around' alignItems='center'>
                <Grid item display='flex' flexDirection='column'>
                    <Typography variant=''>LOGIN</Typography>
                    <Button onClick={handleGoogle}>Google</Button>
                    <TextField
                        label="Email"
                        value={lemail}
                        onChange={(e) => setlEmail(e.target.value)}
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={lpassword}
                            onChange={(e) => setlPassword(e.target.value)}
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
                    <Button onClick={handleLogin}>Admin Login</Button>
                </Grid>
                <Grid item display='flex' flexDirection='column'>
                    <Typography>REGISTER</Typography>
                    <TextField label="First name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setDisplayName(e.target.value + " " + lastName); }} required />
                    <TextField label="Last name" value={lastName} onChange={(e) => { setLastName(e.target.value); setDisplayName(firstName + " " + e.target.value); }} required />
                    <TextField label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    <TextField label="Email" type='email' value={remail} onChange={(e) => setrEmail(e.target.value)} required />
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={rpassword}
                            onChange={(e) => setrPassword(e.target.value)}
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
                    <Button onClick={handleRegister}>Admin Register</Button>
                </Grid>
            </Grid>
        </>
    )
}

export default AdminLogin;
