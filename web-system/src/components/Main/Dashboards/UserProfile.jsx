import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Grid, TextField, Typography } from '@mui/material';
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

const ProfileSettings = () => {
  return (
    <>
      dds
    </>
  )
}

const AccountSettings = () => {
  return (
    <>
      dd
    </>
  )
}