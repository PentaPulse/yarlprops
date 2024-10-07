import React from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../api/firebase';
import { useAlerts } from '../../api/AlertService';
import { registerAdmin } from '../../api/db/users';
export function LoginLayout({handleMode}){
    return(
    <>
    <Box>
<AdminLogin/>
<AdminRegister/>
    </Box>
    </>
    )
}

function AdminLogin(){
    
}
function AdminRegister({ handleMode }) {
    const [remail, setrEmail] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [rpassword, setrPassword] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [displayName, setDisplayName] = React.useState('')
    const showAlerts = useAlerts()

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRegister = () => createUserWithEmailAndPassword(auth, remail, rpassword)
        .then((result) => {
            const admin = result.user;
            registerAdmin(admin.uid, firstName, lastName, displayName, remail);
            sessionStorage.setItem('pp', admin.photoURL);
            sessionStorage.setItem('displayName', admin.displayName);
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

export default AdminRegister;
