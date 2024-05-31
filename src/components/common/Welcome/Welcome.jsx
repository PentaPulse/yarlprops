import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { authUser } from '../../../backend/autharization';
import { Button, ButtonGroup, TextField } from '@mui/material';
import { initializeUser } from '../../../backend/db/users';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../../backend/AuthContext';

export function Welcome({ toLogin, toRegister ,closeBox}) {
    const theme = useTheme()
    const {google}=useAuth();
    const handleGoogle = async(e)=>{
        e.preventDefault();
        try{
            await google();
            closeBox();
        } catch(error){
            console.error(error)
        }
    }
    return (
        <>
            <div className='d-flex justify-content-center flex-column text-center'>
                <h2>Welcome to YarlProps</h2>
                <Button sx={{ borderRadius: '100px', width: '80%', border: `1px solid ${theme.palette.mode==='light'?'#FFFFFF':'#000000'}`, gap: 3,display:'block',margin:'auto' }} onClick={handleGoogle}>
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

export function Login({ handleBack }) {
    const theme = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login,reset}=useAuth();
    
    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
            await login(email,password);
        } catch(error){
            console.error(error)
        }
    }
    const handleReset = async(e)=>{
        e.preventDefault();
        try{
            await reset(email);
        } catch(error){
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

export function Register({ handleBack }) {
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [dname, setDname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleFname = (e) => {
        setFname(e.target.value)
        setDname(e.target.value + " " + lname)
    }
    const handleLname = (e) => {
        setLname(e.target.value)
        setDname(fname + " " + e.target.value)
    }
    const handleRegister = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(authUser, email, password)
            .then((result) => {
                const user = result.user;
                user.displayName = dname;
                console.log("uid : " + user.uid)
                initializeUser(user.uid, fname, lname, email)
                window.location.reload(0)
            })
            .catch((error) => {
                // const errorMassege = error.massage
                // const errorCode = error.code
            })
    }
    return (
        <>
            <div className="d-flex flex-column justify-content-center text-center">
                <h2>Create account</h2>
                <hr />
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-4 w-100">
                        <TextField className='w-50' label="First name" value={fname} onChange={handleFname} required />
                        <TextField className='w-50' label="Last name" value={lname} onChange={handleLname} required />
                    </div>

                    <TextField label="Display name" value={dname} />
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <TextField label="Password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {/*<TextField label="Confirm Password" type='password' />*/}
                    <div className="text-center">
                        <ButtonGroup aria-label='Vertical button group' className='gap-3 text-center'>
                            <Button variant='contained' onClick={handleBack}>Back</Button>
                            <Button variant='contained' onClick={handleRegister}>Register</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </>
    )
}