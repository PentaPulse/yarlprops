import React from 'react';
import { useAuth } from '../../../backend/AuthContext'; // Update with the correct path
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Avatar, Paper, Typography } from '@mui/material';

const Profile = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleExpansion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
  const [gender, setGender] = React.useState(user.gender || '');
  const [edit, setEdit] = React.useState(false);

  const handleSelectChange = (e) => {
    setGender(e.target.value);
  };

  const handleEditProfile = () => {
    setEdit(true);
  };

  const handleSubmit = () => {
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false);
  };
  const width = '35vw'

  return (
    <>
    <Typography>Profile Settings</Typography>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: width },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label="First name"
          defaultValue={user.fname}
          InputProps={{
            readOnly: !edit,
          }}
        />
        <TextField
          label="Last name"
          defaultValue={user.lname}
          InputProps={{
            readOnly: !edit,
          }}
        />
      </div>
      <div>
        <TextField
          label="Email"
          defaultValue={user.email}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Phone number"
          defaultValue={user.phoneNumber}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
      <div>
        <TextField
          label="Date of Birth"
          type="date"
          defaultValue={user.dob} // Assuming user.dob is in YYYY-MM-DD format
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: !edit,
          }}
        />
        <TextField
          label="My role"
          defaultValue={user.role}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
      <div>
        <TextField
          label="Address"
          defaultValue={user.address}
          InputProps={{
            readOnly: !edit,
          }}
        />
        <FormControl sx={{ m: 1, width: width }} disabled={!edit}>
          <InputLabel>Gender</InputLabel>
          <Select value={gender} onChange={handleSelectChange}>
            {['', 'Male', 'Female'].map((genderOption, index) => (
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

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <>
    <Typography>Account Settings</Typography>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '40vw' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label="First name"
          defaultValue={user.fname}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Last name"
          defaultValue={user.lname}
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    </Box>
    </>
  );
};

export default Profile;
