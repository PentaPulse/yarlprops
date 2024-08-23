import * as React from "react";
import { Button, ButtonGroup, TextField, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../api/AuthContext";

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

export function Register() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            //await axios.post('http://localhost:5000/api/u/signup',(firstName,lastName,displayName,role,email,password))
            await register(firstName, lastName, displayName, email, password);
        } catch (error) {

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
                <TextField label="Display name" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
                <TextField label="Email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="text-center">
                    <Button variant="contained" onClick={handleRegister}>Register</Button>
                </div>
            </div>
        </div>
    );
}