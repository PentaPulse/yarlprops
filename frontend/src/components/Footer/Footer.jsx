import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Grid, Typography, Link, IconButton, Box, Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#f7f7f7', color: '#333', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <Container>
        <Grid container spacing={4} sx={{ textAlign: { xs: 'center', md: 'left' }, color: '#333' }}>
          {/* Column 1: About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: '#0d6efd' }}>
              YARLPROPS
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem', color: '#666' }}>
              Do you have any questions? Feel free to reach out to us. We're available 24/7 to assist you.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#0d6efd' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#0d6efd' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#0d6efd' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank" sx={{ color: '#0d6efd' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: '#0d6efd' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" underline="hover" color="inherit" sx={{ marginBottom: '0.5rem', color: '#333' }}>
                Services
              </Link>
              <Link href="/contact" underline="hover" color="inherit" sx={{ marginBottom: '0.5rem', color: '#333' }}>
                Contact Us
              </Link>
              <Link href="/guide" underline="hover" color="inherit" sx={{ color: '#333' }}>
                Guide
              </Link>
            </Box>
          </Grid>

          {/* Column 3: Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: '#0d6efd' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '0.5rem', color: '#666' }}>
              <PhoneIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#0d6efd' }} />
              +94 77 1234567
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '0.5rem', color: '#666' }}>
              <EmailIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#0d6efd' }} />
              PentaPulse@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              <LocationOnIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: '#0d6efd' }} />
              Ramanathan Road, Thirunelvely, Jaffna
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Paper sx={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e9ecef', boxShadow: 'none' }}>
          <Typography variant="body2" textAlign="center" sx={{ color: '#666' }}>
            &copy; {new Date().getFullYear()} YarlProps | Designed by PentaPulse
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
