import { Avatar, Box, Button, ButtonGroup, CircularProgress, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Tab, Tabs, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useAuth } from '../api/AuthContext';
import { changeEmail, changePassword, changePhoneNumber, resetPassword, updateProfileInfo, uploadProfilePictureToStorage } from '../api/db/profile';
import Swal from 'sweetalert2';
import { auth } from '../api/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Profile() {
    const [value, setValue] = React.useState(0);
    const [completion, setCompletion] = useState(false)

    return (
        <Grid container spacing={3} mt={3} ml={3}>
            {!completion && <Grid item lg={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography>Complete profile</Typography>
                </Paper>
            </Grid>}
            <Grid item xs={12} md={5} lg={4}>
                <ProfileInfo />
            </Grid>
            <Grid item xs={12} md={7} lg={7}>
                <Paper sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} variant="fullWidth">
                            <Tab label="PROFILE SETTINGS" />
                            <Tab label="ACCOUNT SETTINGS" />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <ProfileSettings setCompletion={setCompletion} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AccountSettings />
                    </TabPanel>
                </Paper>
            </Grid>
        </Grid>
    )
}

const ProfileInfo = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChangeFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUploadProfilePicture = async () => {
        await uploadProfilePictureToStorage(file, user, setProgress, setLoading, setFile, setPreview)
    };

    const handleCancelProfilePictureUpload = () => {
        setFile(null)
        setPreview(null)
        setLoading(false)
    }

    const getFullName = () => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : "Set Name";
    };

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" textAlign="center" gutterBottom>
                    {user.displayName || 'User Name'}
                </Typography>
                <Box sx={{ position: 'relative', width: 150, height: 150 }}>
                    <Avatar
                        alt="Profile Picture"
                        src={preview || auth.currentUser.photoURL || sessionStorage.getItem('pp') || ''}
                        sx={{ width: 150, height: 150, mb: 2 }}
                    />
                    {loading && (
                        <CircularProgress
                            size={150}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1,
                                color: 'rgba(255,255,255,0.7)',
                            }}
                            variant="determinate"
                            value={progress}
                        />
                    )}
                </Box>
                <Box align='center' sx={{ mt: 2, width: '100%' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-button"
                        type="file"
                        onChange={handleChangeFile}
                    />
                    <label htmlFor="upload-button">
                        <Button variant="contained" component="span" fullWidth>
                            {file ? 'Select Picture' : 'Change profile picture'}
                        </Button>
                    </label>
                    {file && (
                        <>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected File: {file.name}
                            </Typography>
                            <ButtonGroup>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUploadProfilePicture}
                                    disabled={loading}
                                    sx={{ mt: 2 }}
                                    fullWidth
                                >
                                    {loading ? 'Uploading...' : 'Upload'}
                                </Button>
                                <Button variant="contained"
                                    color="error"
                                    onClick={handleCancelProfilePictureUpload}
                                    disabled={loading}
                                    sx={{ mt: 2 }}
                                    fullWidth>Cencel</Button>
                            </ButtonGroup>

                        </>
                    )}
                </Box>
                <TextField label="Full Name" value={getFullName()} margin="normal" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Email" value={user.email || "Set Email"} margin="normal" fullWidth InputProps={{ readOnly: true }} />
                <TextField label="Phone Number" value={user.phoneNumber || "Set Phone Number"} margin="normal" fullWidth InputProps={{ readOnly: true }} />
            </Paper>
        </>
    );
};

const ProfileSettings = ({ setCompletion }) => {
    const { user } = useAuth();
    const theme = useTheme();

    const [profile, setProfile] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.displayName || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
    });

    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState({});

    // Sync user data with state when the `user` object changes
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                displayName: user.displayName || '',
                dateOfBirth: user.dateOfBirth || '',
                gender: user.gender || '',
                address: user.address || '',
            });
        }
    }, [user]);
    
    useEffect(() => {
        const completion = Object.values(profile).every(
            (value) => value !== '' && value !== null && value !== undefined
        );
        setCompletion(completion);
    }, [profile, setCompletion]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => {
            const updatedProfile = { ...prevProfile, [name]: value };
            validateProfile(); // Optional: Validate here for instant feedback
            return updatedProfile;
        });
    };

    const handleSelectChange = (e) => {
        setProfile((prevProfile) => ({ ...prevProfile, gender: e.target.value }));
    };

    const validateProfile = () => {
        const newErrors = {};
        if (!profile.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!profile.displayName.trim()) newErrors.displayName = 'Display name is required.';
        if (!profile.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required.';
        if (!profile.gender.trim()) newErrors.gender = 'Gender is required.';
        if (!profile.address.trim()) newErrors.address = 'Address is required.';
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditProfile = () => setEdit(true);

    const handleSubmit = async () => {
        if (!validateProfile()) return;
    
        try {
            console.log('Updating profile with:', profile);
            await updateProfileInfo(user, profile);
    
            Swal.fire({
                title: 'Profile updated successfully',
                timer: 3000,
                icon: 'success',
                background: theme.palette.background.default,
                color: theme.palette.primary.main,
            });
    
            setEdit(false);
        } catch (error) {
            console.error('Error updating profile:', error.message);
            Swal.fire({
                title: 'Failed to update profile',
                text: error.message,
                icon: 'error',
            });
        }
    };

    const handleCancel = () => setEdit(false);

    return (
        <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
            <Typography variant="h6">Profile Details</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        InputProps={{ readOnly: !edit }}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        InputProps={{ readOnly: !edit }}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Display Name"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleInputChange}
                        InputProps={{ readOnly: !edit }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ readOnly: !edit }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth disabled={!edit}>
                        <InputLabel>Gender</InputLabel>
                        <Select value={profile.gender} onChange={handleSelectChange} label="Gender">
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        InputProps={{ readOnly: !edit }}
                    />
                </Grid>
            </Grid>
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    {edit ? (
        <>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
            </Button>
        </>
    ) : (
        <Button variant="contained" color="primary" onClick={handleEditProfile}>
            Edit Profile
        </Button>
    )}
</Container>
        </Box>
    );
};

const AccountSettings = () => {
    const { user } = useAuth();

    const [email, setEmail] = useState({ old: '', new: '', confirm: '' });
    const [phoneNumber, setPhoneNumber] = useState({ old: '', new: '' });
    const [password, setPassword] = useState({ old: '', new: '', confirm: '' });
    const [showPassword, setShowPassword] = React.useState(false);
    const [resetEmail,setResetEmail]=useState('')
    const [loading,setLoading]=useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleInputChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeEmail = async () => {
        try {
            await changeEmail(user, email)
        } catch (error) {
            console.error("Error updating email: ", error);
        }
    };

    const handleChangePhonenumber = async () => {
               try {
            await changePhoneNumber(user, phoneNumber)
            alert("Phone number updated successfully");
        } catch (error) {
            console.error("Error updating phone number: ", error);
            alert("Failed to update phone number. Please try again.");
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword(password)
        } catch (error) {
            console.error("Error updating password: ", error);
        }
    };

    const handleResetPassword = async () => {
        try {
            if (!resetEmail) {
                Swal.fire({
                    icon: "warning",
                    title: "Missing Email",
                    text: "Please enter your email address.",
                });
                return;
            }
            if (resetEmail !== user.email) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Email",
                    text: "The entered email does not match your registered email address.",
                });
                return;
            }
    
            setLoading(true);
    
            await resetPassword(resetEmail).then((result) => {
                Swal.fire({
                    icon: "success",
                    title: "Email Sent",
                    text: result,
                });
            });
    
            // Optionally clear the input field after success
            setResetEmail("");
        } catch (error) {
            console.error("Error sending reset email:", error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <Box>
                    <Typography variant="h6">Change Email</Typography>
                    <Typography sx={{backgroundColor:'yellow',color:'black',fontWeight:'bold'}}>
                        CURRENTLY THIS FEATURE IS NOT AVAILABLE  </Typography>
                    <TextField disabled
                        label="Old Email"
                        name="old"
                        value={email.old}
                        onChange={handleInputChange(setEmail)}
                        fullWidth
                    />
                    <TextField disabled
                        label="New Email"
                        name="new"
                        value={email.new}
                        onChange={handleInputChange(setEmail)}
                    />
                    <TextField disabled
                        label="Confirm Email"
                        name="confirm"
                        value={email.confirm}
                        onChange={handleInputChange(setEmail)}
                    />
                    <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
                        <Button disabled variant="contained" fullWidth color="primary" onClick={handleChangeEmail}>Change Email</Button>
                    </Container>
                </Box>
                <Box>
                    <Typography variant="h6">{phoneNumber.old?'Change':'Add'} Phone Number</Typography>
                    <Typography sx={{backgroundColor:'yellow',color:'black',fontWeight:'bold'}}>
                        CURRENTLY THIS FEATURE IS NOT AVAILABLE  </Typography>
                   {phoneNumber.old? <TextField disabled
                        label="Old Phone Number"
                        name="old"
                        value={phoneNumber.old}
                        onChange={handleInputChange(setPhoneNumber)}
                    />:''}
                    <TextField disabled
                        label="New Phone Number"
                        name="new"
                        value={phoneNumber.new}
                        onChange={handleInputChange(setPhoneNumber)}
                    />
                    <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
                        <Button disabled variant="contained" fullWidth color="primary" onClick={handleChangePhonenumber}>
                            Change Phone Number
                        </Button>
                    </Container>
                    <div id="recaptcha-container"></div>
                </Box>
                <Box display={'flex'} flexDirection={'column'} mb={3}>
                    <Typography variant="h6">Change Password</Typography>
                    <Typography sx={{backgroundColor:'yellow',color:'black',fontWeight:'bold'}}>
                        CURRENTLY THIS FEATURE IS NOT AVAILABLE  </Typography>
                        <Typography sx={{backgroundColor:'yellow',color:'black',fontWeight:'bold'}}>
                       UNTIL USE RESET PASSWORD 
                    </Typography>
                    <FormControl fullWidth variant="outlined" sx={{m:1}} disabled>
                        <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                        <OutlinedInput
                            name="old"
                            type={showPassword ? 'text' : 'password'}
                            value={password.old}
                            onChange={handleInputChange(setPassword)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Old Password"
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={{m:1}} disabled>
                        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                        <OutlinedInput
                        name='new'
                            type={showPassword ? 'text' : 'password'}
                            value={password.new}
                            onChange={handleInputChange(setPassword)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="New Password"
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={{m:1}} disabled>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            name='confirm'
                            type={showPassword ? 'text' : 'password'}
                            value={password.confirm}
                            onChange={handleInputChange(setPassword)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                    </FormControl>

                    <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
                        <Button disabled variant="contained" fullWidth color="primary" onClick={handleChangePassword}>Change Password</Button>
                    </Container>
                    <FormControl fullWidth variant="outlined" sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-password">Your email</InputLabel>
                <OutlinedInput
                    name="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    label="Your email"
                />
            </FormControl>
            <Container sx={{ display: "flex", justifyContent: "end", marginTop: "20px" }}>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Reset Password"}
                </Button>
            </Container>
                </Box>
            </Box>
        </>
    );
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};