import React, { useState } from 'react';
import { useAuth } from '../../../backend/AuthContext';
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Avatar, Paper, Typography } from '@mui/material';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../backend/secrets';
import { updateEmail, updatePassword, updatePhoneNumber } from 'firebase/auth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Grid container spacing={2} mt={2}>
      <Grid container justifyContent="center" alignItems="center">
        <Avatar alt="Profile Picture" src={user.photoUrl || sessionStorage.getItem('pp')} sx={{ width: 150, height: 150 }} />
        <Grid item>
          <TextField
            label="Name"
            defaultValue={user.displayName}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Email"
            defaultValue={user.email || 'example@p5p.lk'}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Phone Number"
            defaultValue={user.phone || '+94 12 345 6789'}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ mt: 1, padding: '20px' }}>
          <ProfileSettings />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ mt: 1, padding: '20px' }}>
          <AccountSettings />
        </Paper>
      </Grid>
    </Grid>
  );
};

const ProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    role: user?.role || '',
    address: user?.address || '',
    gender: user?.gender || '',
  });
  const [edit, setEdit] = useState(false);

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
      await setDoc(doc(db, 'systemusers', user.uid), profile);
      setEdit(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const width = '35vw';

  return (
    <>
      <Box display='flex' justifyContent='center'>
        <Typography variant="h5">Profile Settings</Typography>
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: width },
        }}
      >
        <div>
          <TextField
            label="First name"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
          />
          <TextField
            label="Last name"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
          />
        </div>
        <div>
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Phone number"
            name="phoneNumber"
            value={profile.phoneNumber}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div>
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
          />
          <TextField
            label="My role"
            name="role"
            value={profile.role}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div>
          <TextField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
          />
          <FormControl sx={{ m: 1, width: width }} disabled={!edit}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={profile.gender}
              onChange={handleSelectChange}
              label="Gender"
            >
              {['Male', 'Female'].map((genderOption, index) => (
                <MenuItem key={index} value={genderOption}>{genderOption}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {!edit ? (
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

const AccountSettings = () => {
  const { user } = useAuth();
  const width = '25vw';

  const [email, setEmail] = useState({ old: '', new: '', confirm: '' });
  const [phoneNumber, setPhoneNumber] = useState({ old: '', new: '', confirm: '' });
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeEmail = async () => {
    if (email.new !== email.confirm) {
      alert("New email and confirm email do not match");
      return;
    }
    try {
      await updateEmail(user, email.confirm);
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
      await updatePassword(user, password.confirm);
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password: ", error);
    }
  };

  return (
    <>
      <Typography variant="h5">Account Settings</Typography>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: width },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <Typography variant="h6">Change Email</Typography>
          <TextField
            label="Old Email"
            name="old"
            value={email.old}
            onChange={handleInputChange(setEmail)}
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
            <Button variant="contained" color="primary" onClick={changeEmail}>Change Email</Button>
          </Container>
        </div>
        <div>
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
            <Button variant="contained" color="primary" onClick={changePhonenumber}>Change Phone Number</Button>
          </Container>
        </div>
        <div>
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
            <Button variant="contained" color="primary" onClick={changePassword}>Change Password</Button>
          </Container>
        </div>
      </Box>
    </>
  );
};

export default Profile;