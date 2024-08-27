import React, { useState } from 'react';
import { useAuth } from '../api/AuthContext';
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Avatar, Paper, Typography, CircularProgress } from '@mui/material';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../api/firebase';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Grid container spacing={2} mt={2}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Avatar alt="Profile Picture" src={user.photoUrl || sessionStorage.getItem('pp')} sx={{ width: 200, height: 200, marginRight: 10 }} />
        </Grid>
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
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    role: user?.role || '',
    address: user?.address || '',
    gender: user?.gender || '',
  });
  const [file, setFile] = useState(null)
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditProfile = () => {
    setEdit(true);
  };

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, 'systemusers', user.uid), profile);
      await updateProfile(user, {
        displayName: profile.displayName
      })
      setEdit(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setEdit(false)
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

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
      console.log("upload error pp :" + e)
    }
  }
  console.log(user.photoUrl)
  const width = '17.5vw';

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
        <Box>
          <Typography>Personal details</Typography>
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
          <TextField
            label="Display name"
            name="displayname"
            value={profile.displayName}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
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
          />
          <FormControl sx={{ m: 1, width: width }} disabled={!edit}>
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
        </Box>
        <Box>
          <Typography>Profile picture</Typography>
          <Box>
            {!file ? <>
              <input
                accept="file/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={handleChange}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">
                  Upload Profile Picture
                </Button>
              </label></> : <>
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
              >

                {loading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>

              {loading && <p>Uploading: {progress}%</p>}

              {progress === 100 && (
                <div>
                  <p>Profile Picture Uploaded Successfully</p>
                </div>
              )}</>
            }
          </Box>
          <Typography>Contact details</Typography>
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
          <TextField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            InputProps={{
              readOnly: !edit,
            }}
          />
        </Box>
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
  const [role, setRole] = useState('')

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeRole=async()=>{
    
  }
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
  const handleSelectChange = (e) => {
    const { value } = e.target;
    setRole((prevProfile) => ({
      ...prevProfile,
      role: value,
    }));
  };

  return (
    <>
      <Box display='flex' justifyContent='center'>
        <Typography variant="h5">Account Settings</Typography>
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: width },
        }}
        noValidate
        autoComplete="off"
      >
        <Box>
          <Typography variant='h6'>Change role</Typography>
          <FormControl sx={{ m: 1, width: width }} >
            <InputLabel>Gender</InputLabel>
            <Select
              value={role}
              onChange={handleSelectChange}
              label="Gender"
            >
              {['Seller', 'Renter', 'Buyer'].map((roleOption, index) => (
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