import * as React from 'react';
import { Container, Box, Avatar, TextField, Button } from '@mui/material'
//import { authUser } from '../../../backend/autharization';

export default function Profile() {
  
  return (
    <Container>
      <Box sx={{ display: 'flex', }}>
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
        <h2>Personel details</h2>
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
    </Container>
  );
}