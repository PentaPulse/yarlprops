import { Avatar, Badge, Grid, TextField } from '@mui/material';
import * as React from 'react';
import { useAuth } from '../../../backend/AuthContext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function Profile() {
  const { user } = useAuth()

  return (
    <>
      <Grid container spacing={2} columns={12} mt={2}>
        <Grid container justifyContent='center' >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <CameraAltIcon />
            }
          >
            <Avatar alt='profile picyure' src={user.photoUrl || sessionStorage.getItem('pp')} sx={{ width: 150, height: 150 }} />
          </Badge>
          <Grid item >
            <TextField
              required
              label="Name"
              defaultValue={user.displayName}
            />
            <TextField
              required
              label="Email"
              defaultValue={user.email || 'example@p5p.lk'}
            />
            <TextField
              required
              label="Phone number"
              defaultValue={user.phone || '+94 12 345 6789'}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}