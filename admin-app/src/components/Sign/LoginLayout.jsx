import React, { useEffect, useState } from 'react';
import {
    Box, Button,
    FormControlLabel, SvgIcon, TextField, Typography,Switch
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth,db } from '../../api/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signinLog } from '../../api/db/logs';
import { useNavigate } from 'react-router-dom';

export function LoginLayout() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [error, setError] = useState(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate=useNavigate()

    useEffect(()=>{
        if(auth.currentUser){
            navigate('/overview')
        }
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Reset error message

        try {
            if (isSignUp) {
                // Sign up the user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Store user details in Firestore under the 'admins' collection
                await setDoc(doc(db, "admins", user.uid), {
                    uid: user.uid,
                    firstName: fname,
                    lastName: lname,
                    email: user.email,
                    createdAt: new Date(),
                    approved: false // Default false for admin approval process
                });
                navigate('/overview')
            } else {
                // Sign in the user
                await signInWithEmailAndPassword(auth, email, password).then((res)=>{
                    const user = res.user
                    signinLog(user.uid,{method:'email'})
                })
                navigate('/overview')
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError("Please enter your email to reset your password.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent!");
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh', padding: 2 }}
        >
            <Typography variant="h4" gutterBottom>
                {isSignUp ? 'Sign Up' : showForgotPassword ? 'Reset Password' : 'Sign In'}
            </Typography>

            <form onSubmit={handleFormSubmit}>
                {isSignUp && (
                    <>
                        <TextField
                            label="First Name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />

                {!showForgotPassword && (
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                )}

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}

                {!showForgotPassword ? (
                    <>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>

                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <FormControlLabel
                                control={
                                    <Switch checked={isSignUp} onChange={() => setIsSignUp(!isSignUp)} />
                                }
                                label={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
                            />
                            {!isSignUp && (
                                <Button color="secondary" onClick={() => setShowForgotPassword(true)}>
                                    Forgot Password?
                                </Button>
                            )}
                        </Box>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handlePasswordReset}
                    >
                        Send Password Reset Email
                    </Button>
                )}

                {showForgotPassword && (
                    <Button
                        color="secondary"
                        onClick={() => setShowForgotPassword(false)}
                        sx={{ mt: 2 }}
                    >
                        Back to Sign In
                    </Button>
                )}
            </form>
        </Box>
    );
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