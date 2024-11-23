import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControlLabel,
    TextField,
    Typography,
    Switch,
} from "@mui/material";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signinLog } from "../../api/db/logs";
import { useNavigate } from "react-router-dom";

export function LoginLayout() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [error, setError] = useState(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "admins", user.uid), {
                    uid: user.uid,
                    firstName: fname,
                    lastName: lname,
                    email: user.email,
                    createdAt: new Date(),
                    approved: false,
                });
                navigate("/overview");
            } else {
                await signInWithEmailAndPassword(auth, email, password).then((res) => {
                    const user = res.user;
                    signinLog(user.uid, { method: "email" });
                });
                navigate("/overview");
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
            sx={{
                minHeight: "100vh",
                backgroundColor: "background.default",
                padding: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                {isSignUp ? "Sign Up" : showForgotPassword ? "Reset Password" : "Sign In"}
            </Typography>

            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    maxWidth: 400,
                    width: "100%",
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 3,
                }}
            >
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
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </Button>

                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <FormControlLabel
                                control={<Switch checked={isSignUp} onChange={() => setIsSignUp(!isSignUp)} />}
                                label={isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
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
            </Box>
        </Box>
    );
}