import * as React from "react";
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../backend/AuthContext";

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
export function RegisterStep() {
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = ['Personal Information', 'Contact Details', 'Review & Submit'];

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
            {activeStep === 0 && <StepOne next={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)} />}
            {activeStep === 1 && <StepTwo next={() => setActiveStep((prevActiveStep) => prevActiveStep + 1)} back={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)} />}
        </Box>
    );
}
function StepOne({ next }) {
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
                        <Button variant="contained" onClick={handleRegister}>Register</Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}

function StepTwo({ next, back }) {
    return (
        <>
            step two
        </>
    )
}
*/
export function Register({ handleBack }) {
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
                        <Button variant="contained" onClick={handleRegister}>Register</Button>
                </div>
            </div>
        </div>
    );
}