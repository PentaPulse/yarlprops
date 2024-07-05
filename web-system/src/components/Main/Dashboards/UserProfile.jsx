import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useAuth } from '../../../backend/AuthContext';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

export default function Profile() {
  const { user } = useAuth();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleExpansion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Grid container spacing={2} columns={12} mt={2}>
        <Grid container justifyContent="center" alignItems="center" >
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
              required
              label="Email"
              defaultValue={user.email || 'example@p5p.lk'}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              required
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
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleExpansion('panel1')}
            TransitionComponent={Fade}
            transitionDuration={400}
            sx={{
              '& .MuiAccordionSummary-content': { height: expanded === 'panel1' ? 'auto' : 0 },
              '& .MuiAccordionDetails-root': { display: expanded === 'panel1' ? 'block' : 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Profile Settings
            </AccordionSummary>
            <AccordionDetails>
              <ProfileSettings />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleExpansion('panel2')}
            TransitionComponent={Fade}
            transitionDuration={400}
            sx={{
              '& .MuiAccordionSummary-content': { height: expanded === 'panel2' ? 'auto' : 0 },
              '& .MuiAccordionDetails-root': { display: expanded === 'panel2' ? 'block' : 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              Account Settings
            </AccordionSummary>
            <AccordionDetails>
              <AccountSettings />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      gender="tabpanel"
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

//Profile settings
const ProfileSettings = () => {
  const { user } = useAuth();
  const [gender, setGender] = React.useState(user.gender || '');
  const [edit, setEdit] = React.useState(false)


  const handleSelectChange = (e) => {
    setGender(e.target.value);
  };

  const handleEditProfile = () => {
    setEdit(true)
  }

  const handleSubmit = () => {

  }

  const handleCancel = () => {
    setEdit(false)
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '35vw' },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            label="First name"
            defaultValue={user.fname}
            InputProps={{
              readOnly: !edit
            }}
          />
          <TextField
            label="Last name"
            defaultValue={user.lname}
            InputProps={{
              readOnly: !edit
            }}
          />
        </div>
        <div>
          <TextField
            label="Email"
            defaultValue={user.email}
            InputProps={{
              readOnly: !edit
            }}
          />
          <TextField
            label="Phone number"
            defaultValue={user.phoneNumber}
            InputProps={{
              readOnly: !edit
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
              readOnly: true
            }}
          />
        </div>
        <div>
          <TextField
            label="Address"
            defaultValue={user.address}
            InputProps={{
              readOnly: !edit
            }}
          />
          <FormControl sx={{ m: 1, width: '35vw' }} disabled={!edit}>
            <InputLabel>Gender</InputLabel>
            <Select value={gender} onChange={handleSelectChange}>
              {['', 'Male', 'Female'].map((genderOption, index) => (
                <MenuItem key={index} value={genderOption}>{genderOption}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          {!edit ?
            <Button variant="contained" color="primary" onClick={handleEditProfile}>Edit Profile</Button>
            :
            <>
              <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
              <Button variant="contained" color="primary" onClick={handleCancel}>Cancel</Button>
            </>}
        </Container>
      </Box>
    </>
  );
};

const AccountSettings = () => {
  return (
    <>
      <Typography>Change Password</Typography>
      <TextField className="w-30" label="Old password" />
      <TextField className="w-30" label="New password" />
      <TextField className="w-30" label="Confirm password" />
      <Button>Change password</Button>
    </>
  )
}