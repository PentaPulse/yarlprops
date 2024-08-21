import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Grid, Paper, Typography, Link, List, ListItem, ListItemText, IconButton, Box, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
    const theme = useTheme();

    const footerBackground = theme.palette.mode === 'dark' ? '#333' : '#f8f9fa';
    const footerTextColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

    return (
        <Box sx={{ backgroundColor: footerBackground, color: footerTextColor, marginTop: 3, paddingTop: '2rem', paddingBottom: '2rem' }}>
            <footer>
                <Container>
                    <Grid container spacing={3} sx={{ justifyContent: 'center', textAlign: { xs: 'center', md: 'left' } }}>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                <span>YARL</span>PROPS
                            </Typography>
                            <Typography variant="h5" sx={{ marginBottom: '1rem' }}>Do You Have Questions?</Typography>
                            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>Feel Free to Contact Us.</Typography>
                            <Box>
                                <IconButton href="https://facebook.com" target="_blank" aria-label="Facebook" sx={{ color: footerTextColor }}>
                                    <FacebookIcon />
                                </IconButton>
                                <IconButton href="https://twitter.com" target="_blank" aria-label="Twitter" sx={{ color: footerTextColor }}>
                                    <TwitterIcon />
                                </IconButton>
                                <IconButton href="https://instagram.com" target="_blank" aria-label="Instagram" sx={{ color: footerTextColor }}>
                                    <InstagramIcon />
                                </IconButton>
                                <IconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn" sx={{ color: footerTextColor }}>
                                    <LinkedInIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h5" sx={{ marginBottom: '1rem' }}>Quick Links</Typography>
                            <List>
                                <ListItem>
                                    <ListItemText>
                                        <Link href="/" underline="hover" color="inherit">Services</Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <Link href="/" underline="hover" color="inherit">Contact Us</Link>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <Link href="/" underline="hover" color="inherit">Guide</Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h5" sx={{ marginBottom: '1rem' }}>More Details</Typography>
                            <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
                                <PhoneIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />+94 77 1234567
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
                                <EmailIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />PentaPulse@gmail.com
                            </Typography>
                            <Typography variant="body1">
                                <LocationOnIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Ramanathan Road, Thirunelvely, Jaffna
                            </Typography>
                        </Grid>
                    </Grid>
                    <Paper sx={{ width: '100%', padding: '1rem', marginTop: '2rem', backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#e9ecef' }}>
                        <Typography textAlign='center'>&copy; 2024 Designed By PentaPulse</Typography>
                    </Paper>
                </Container>
                </footer >
        </Box>
    );
}
