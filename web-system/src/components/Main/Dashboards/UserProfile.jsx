import { AppBar, Avatar, Badge, Box, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useAuth } from '../../../backend/AuthContext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PropTypes from 'prop-types';

export default function Profile() {
  const { user } = useAuth();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container spacing={2} columns={12} mt={2}>
        <Grid container justifyContent="center" alignItems="center" >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<CameraAltIcon />}
          >
            <Avatar alt="Profile Picture" src={user.photoUrl || sessionStorage.getItem('pp')} sx={{ width: 150, height: 150 }} />
          </Badge>
          <Grid item>
            <TextField
              required
              label="Name"
              defaultValue={user.displayName}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              label="Email"
              defaultValue={user.email || 'example@p5p.lk'}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              label="Phone Number"
              defaultValue={user.phone || '+94 12 345 6789'}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
