import { Grid } from '@mui/material';
import * as React from 'react';
import { useAuth } from '../../../backend/AuthContext';

const details = ['First name', 'Last name', 'Email', 'Phone number', 'Date of Birth']

export default function Profile() {
 const {user}=useAuth()

  return (
    <>
      <Grid container spacing={2}>
        <Grid item >
            {user.email}
        </Grid>
      </Grid>
    </>
  );
}