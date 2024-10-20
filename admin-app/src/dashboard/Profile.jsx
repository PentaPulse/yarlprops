import React, { useState } from 'react';
import { useAuth } from '../api/AuthContext';
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Avatar, Paper, Typography, CircularProgress, Tab, Tabs, useTheme, LinearProgress } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../api/firebase';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useAlerts } from '../api/AlertService';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

const Profile = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = React.useState(0)
  const [profilePercentage, setProfilePercentage] = useState(0);

  const uploadPP = async () => {
    if (!file) return;
    try {
      if (!file) return;

      setLoading(true);

      const storageRef = ref(storage, `${user.uid}/profile_pictures/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress function
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        },
        () => {
          // Complete function
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfile(auth.currentUser, {
              photoURL: downloadURL
            })
            setLoading(false);
            sessionStorage.setItem('pp', downloadURL)
            window.location.reload()
          });
        }
      );
    } catch (e) {
      //console.log("upload error pp :" + e)
    }
  }

  const handleChangeFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {profilePercentage < 100 &&
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <LinearProgressWithLabel value={profilePercentage} />
        </Grid>
      }
      <Grid container mt={3} ml={3} gap={5} display={'flex'}>
        <Grid item xs={12} sm={12} md={5} lg={4} >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* User Name */}
            <Typography variant="h5" textAlign="center" gutterBottom>
              {user.displayName || 'User Name'}
            </Typography>

            {/* User Avatar */}
            <Avatar
              alt="Profile Picture"
              src={user.photoUrl || sessionStorage.getItem('pp') || ''}
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Box>
              {!file ? (
                <>
                  <input
                    accept="file/*"
                    style={{ display: 'none' }}
                    id="contained-button-file"
                    type="file"
                    onChange={handleChangeFile}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                      Upload Profile Picture
                    </Button>
                  </label>
                </>
              ) : (
                <>
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={file.name}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={uploadPP}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={12} /> : 'Upload'}
                  </Button>
                  {loading && <p>Uploading: {progress}%</p>}
                  {progress === 100 && (
                    <div>
                      <p>Profile Picture Uploaded Successfully</p>
                    </div>
                  )}
                </>
              )}
            </Box>
            {/* User Details */}
            <TextField
              label="Name"
              value={user.displayName || 'N/A'}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Email"
              value={user.email || 'example@p5p.lk'}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Phone Number"
              value={user.phone || '+94 12 345 6749'}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={7} lg={7}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs variant='fullWidth' value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="PROFILE SETTINGS" {...a11yProps(0)} />
                <Tab label="ACCOUNT SETTINGS" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <ProfileSettings setProfilePercentage={setProfilePercentage} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1} >
              <AccountSettings profilePercentage={profilePercentage} />
            </CustomTabPanel>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

const ProfileSettings = ({ setProfilePercentage }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    gender: user?.gender || '',
  });
  const [edit, setEdit] = useState(false);
  const theme = useTheme()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      gender: value,
    }));
  };

  const handleEditProfile = () => {
    setEdit(true);
  };

  const handleSubmit = async () => {
    try {
      if (user.adminid) {
        await updateDoc(doc(db, 'admins', user.adminid), profile)
      }
      else {
        await updateDoc(doc(db, 'systemusers', user.uid), profile);
      }
      await updateProfile(auth.currentUser, {
        displayName: profile.displayName
      })
      Swal.fire({
        title: 'Profile updated successfully', timer: 3000, icon: 'success', background: theme.palette.background.default, color: theme.palette.primary.main
      })
      setEdit(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setEdit(false)
    }
  };

  React.useEffect(() => {
    const calculateCompletionPercentage = (data) => {
      const totalFields = 7; // Adjust based on your number of fields
      const requiredFields = ["firstName", "lastName", "email", "displayName", "dateOfBirth", "gender", "address"];
      const filledFields = requiredFields.filter((field) => data[field] && data[field].trim() !== null).length;

      const percentage = (filledFields / totalFields) * 100;
      setProfilePercentage(percentage);
    };

    calculateCompletionPercentage(profile)
  })

  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { p: 1, width: { xs: '100%', sm: '100%', md: '100%', lg: '50%' } },
          '& .MuiFormControl-root': { p: 1, width: { xs: '100%', sm: '100%', md: '100%', lg: '50%' } }
        }}
      >
        <Typography>Profile details</Typography>
        <Grid container columns={12} columnSpacing={2}>
          <TextField
            label="First name"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
          <TextField
            label="Last name"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
          <TextField
            label="Display name"
            name="displayname"
            value={profile.displayName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={profile.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
          <FormControl sx={{ m: 1 }} disabled={!edit} fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={profile.gender}
              onChange={handleSelectChange}
              label="Gender"
            >
              {['Male', 'Female'].map((roleOption, index) => (
                <MenuItem key={index} value={roleOption}>{roleOption}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Typography>Contact details</Typography>
        <Grid container columns={12} columnSpacing={2}>
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {!edit ? (
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="contained" color="info" sx={{ mr: 2 }} onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="contained" color="primary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

const AccountSettings = ({ profilePercentage }) => {
  const { user } = useAuth();

  const [email, setEmail] = useState({ old: '', new: '', confirm: '' });
  const [phoneNumber, setPhoneNumber] = useState({ old: '', new: '', confirm: '' });
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });
  const [role, setRole] = useState('')
  //const theme = useTheme()
  const { showAlerts2 } = useAlerts()

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeRole = async () => {
    try {
      if (user.isMerchant) {
        if (user.myProducts.length > 0 || user.myRentals.length > 0 || user.myService.length > 0) {
          showAlerts2('Remove ongoing items and try again', 'warning')
        } else {
          await updateDoc(doc(db, 'systemusers', user.uid), { 'isMerchant': false })
          Swal.fire({
            title: `Successfully changed to ${role}`,
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          });
        }
      } else {
        if (profilePercentage === 100) {
          await updateDoc(doc(db, 'systemusers', user.uid), { 'isMerchant': true })
          Swal.fire({
            title: `Successfully changed to ${role}`,
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          });
        } else {
          showAlerts2('Complete Your profile', 'warning')
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };
  const changeEmail = async () => {
    if (email.new !== email.confirm) {
      alert("New email and confirm email do not match");
      return;
    }
    try {
      await updateEmail(auth.currentUser, email.confirm);
      await updateDoc(doc(db, 'systemusers', user.uid), { email: email.confirm });
      alert("Email updated successfully");
    } catch (error) {
      console.error("Error updating email: ", error);
    }
  };

  const changePhonenumber = async () => {
    if (phoneNumber.new !== phoneNumber.confirm) {
      alert("New phone number and confirm phone number do not match");
      return;
    }
    try {
      // Use your method to update the phone number
      //await updatePhoneNumber(user, phoneNumber.new);
      await updateDoc(doc(db, 'systemusers', user.uid), { phoneNumber: phoneNumber.confirm });
      alert("Phone number updated successfully");
    } catch (error) {
      console.error("Error updating phone number: ", error);
    }
  };

  const changePassword = async () => {
    if (password.new !== password.confirm) {
      alert("New password and confirm password do not match");
      return;
    }
    try {
      await updatePassword(auth.currentUser, password.confirm);
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password: ", error);
    }
  };
  const handleSelectChange = (e) => {
    setRole(e.target.value)
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
          <Typography variant='h6'>Change role</Typography>
          <Typography>I am currently a {user.isMerchant ? 'Merchant' : 'Customer'} in Yarlprops and I want to be a </Typography>
          <FormControl sx={{ m: 1 }} fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              disabled={user.adminid}
              value={role}
              onChange={handleSelectChange}
              label="Role"
            >
              {['Merchant', 'Customer'].map((roleOption, index) => (
                <MenuItem key={index} value={roleOption}>{roleOption}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button variant="contained" fullWidth color="primary" onClick={changeRole}>Change Role</Button>
          </Container>
        </Box>
        <Box>
          <Typography variant="h6">Change Email</Typography>
          <TextField
            label="Old Email"
            name="old"
            value={email.old}
            onChange={handleInputChange(setEmail)}
            fullWidth
          />
          <TextField
            label="New Email"
            name="new"
            value={email.new}
            onChange={handleInputChange(setEmail)}
          />
          <TextField
            label="Confirm Email"
            name="confirm"
            value={email.confirm}
            onChange={handleInputChange(setEmail)}
          />
          <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button variant="contained" fullWidth color="primary" onClick={changeEmail}>Change Email</Button>
          </Container>
        </Box>
        <Box>
          <Typography variant="h6">Change Phone Number</Typography>
          <TextField
            label="Old Phone Number"
            name="old"
            value={phoneNumber.old}
            onChange={handleInputChange(setPhoneNumber)}
          />
          <TextField
            label="New Phone Number"
            name="new"
            value={phoneNumber.new}
            onChange={handleInputChange(setPhoneNumber)}
          />
          <TextField
            label="Confirm Phone Number"
            name="confirm"
            value={phoneNumber.confirm}
            onChange={handleInputChange(setPhoneNumber)}
          />
          <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button variant="contained" fullWidth color="primary" onClick={changePhonenumber}>Change Phone Number</Button>
          </Container>
        </Box>
        <Box>
          <Typography variant="h6">Change Password</Typography>
          <TextField
            label="Old Password"
            type='password'
            name="old"
            value={password.old}
            onChange={handleInputChange(setPassword)}
          />
          <TextField
            label="New Password"
            type='password'
            name="new"
            value={password.new}
            onChange={handleInputChange(setPassword)}
          />
          <TextField
            label="Confirm Password"
            type='password'
            name="confirm"
            value={password.confirm}
            onChange={handleInputChange(setPassword)}
          />
          <Container sx={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
            <Button variant="contained" fullWidth color="primary" onClick={changePassword}>Change Password</Button>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Profile;


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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}