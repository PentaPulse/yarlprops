import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Grid, Paper, Typography, Link, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
    return (
        <>
                <Grid container spacing={3} sx={{ margin:'0 6vw 0 6vw',justifyContent: 'center', textAlign: { xs: 'center', md: 'left' } }}>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="h4"><span>YARL</span>PROPS</Typography>
                        <Typography variant="h5">Do You Have Questions?</Typography>
                        <Typography variant="body1">Feel Free to Contact Us.</Typography>
                        <div>
                            <IconButton>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton>
                                <InstagramIcon />
                            </IconButton>
                            <IconButton>
                                <LinkedInIcon />
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="h5">Quick Links</Typography>
                        <List>
                            <ListItem>
                                <ListItemText>
                                    <Link href="/" underline="none">Services</Link>
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <Link href="/" underline="none">Contact Us</Link>
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>
                                    <Link href="/" underline="none">Guide</Link>
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Typography variant="h5">More Details</Typography>
                        <Typography variant="body1"><PhoneIcon /> +94 77 1234567</Typography>
                        <Typography variant="body1"><EmailIcon /> PentaPulse@gmail.com</Typography>
                        <Typography variant="body1"><LocationOnIcon /> Ramanathan Road, Thirunelvely, Jaffna</Typography>
                    </Grid>
                </Grid>
            <Paper sx={{ width: '100%', padding: '16px'}}>
                <Typography textAlign='center'>© 2024 Designed By PentaPulse</Typography>
            </Paper>
        </>
    );
}
