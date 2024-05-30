import * as React from 'react';
import { Container, Box, Avatar, TextField, Button, Grid } from '@mui/material'
//import { authUser } from '../../../backend/autharization';

const details = ['First name','Last name','Email','Phone number','Date of Birth']

export default function Profile() {
const [user,setUser]=React.useState([])
  return (
    <>
    <Grid container spacing={2} columns={12}>
      <Grid item >

      </Grid>
    </Grid>

      <Box sx={{ display: 'flex', }}>
        <Grid container spacing={2} columns={12}>

        </Grid>
        <div>
          <Avatar alt='Display Picture' src={sessionStorage.getItem('pp')} />
        </div>
        <div>
          <TextField
            id="outlined-read-only-input"
            label="Display name"
            defaultValue={sessionStorage.getItem('displayName')}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Email"
            defaultValue="Email"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-read-only-input"
            label="Phone number"
            defaultValue="Phone number"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </Box>
      <Box>
        <h2>Personal details</h2>
        <TextField
          id="outlined-read-only-input"
          label="First name"
          defaultValue="First name"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Last name"
          defaultValue="Last name"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Gender"
          defaultValue="Gender"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Display name"
          defaultValue="Display name"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Profile picture"
          defaultValue="profile picture"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Date of birth"
          defaultValue="DOB"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box>
        <h2>Contact details</h2>
        <TextField
          id="outlined-read-only-input"
          label="Phone number"
          defaultValue="Phone number"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Email"
          defaultValue="Email"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box>
        <h2>Security</h2>
        <Button>Change password</Button>
        <Button>Change Email</Button>
        <Button>Delete Account</Button>
      </Box>
    </>
  );
}