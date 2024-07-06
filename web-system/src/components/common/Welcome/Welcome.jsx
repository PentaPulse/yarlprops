import React, { useState } from 'react'
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../../backend/AuthContext';

export function Welcome({ toLogin, toRegister, closeBox }) {
    const theme = useTheme()
    const { google } = useAuth();
    const handleGoogle = async (e) => {
        e.preventDefault();
        try {
            await google();
            closeBox();
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className='d-flex justify-content-center flex-column text-center'>
                <h2>Welcome to YarlProps</h2>
                <Button sx={{ borderRadius: '100px', width: '80%', border: `1px solid ${theme.palette.mode === 'light' ? '#FFFFFF' : '#000000'}`, gap: 3, display: 'block', margin: 'auto' }} onClick={handleGoogle}>
                    <img src="social-icons/google.svg" alt="G" width={30} /> Connect with Google
                </Button>
                <h5>OR</h5>
                <div className="text-center">
                    <ButtonGroup aria-label='Vertical button group' className='gap-3'>
                        <Button variant='contained' onClick={toLogin}>Login</Button>
                        <Button variant='contained' onClick={toRegister}>Register</Button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}

export function Login({ handleBack, closeBox }) {
    const theme = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, reset } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            closeBox()
        } catch (error) {
            console.error(error)
        }
    }
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await reset(email);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className="d-flex flex-column gap-2">
                <h2 color={theme.palette.welcomeTopics}>Login</h2>
                <hr />
                <div className="d-flex flex-column gap-4">
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="btn" onClick={handleReset}>Forgot Your Password?</span>
                </div>
                <div className="text-center">
                    <ButtonGroup aria-label='Vertical button group' className='gap-3'>
                        <Button variant='contained' onClick={handleBack}>Back</Button>
                        <Button variant='contained' onClick={handleLogin}>Login</Button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}

export function Register({ handleBack ,closeBox}) {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [dname, setDname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const { register } = useAuth();

    const roles = ['','Seller', 'Renter', 'Buyer'];

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
            await register(fname, lname,dname, email, password, role);
            //closeBox()
        } catch (error) {
            console.error('ff.'+error)
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
                    <Select value={role} onChange={handleSelectChange}>
                        {roles.map((role, index) => (
                            <MenuItem key={index} value={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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