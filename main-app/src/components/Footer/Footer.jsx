import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { Container, Grid, Typography, Link, IconButton, Box, Paper, useTheme } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';
  
  const footerBackground = isDarkMode ? '#222' : '#f7f7f7';
  const footerTextColor = isDarkMode ? '#ddd' : '#333';
  const linkColor = isDarkMode ? '#90caf9' : '#0d6efd';
  const iconColor = isDarkMode ? '#90caf9' : '#0d6efd';
  const paperBackground = isDarkMode ? '#333' : '#e9ecef';
  const paperTextColor = isDarkMode ? '#aaa' : '#666';

  return (
    <Box sx={{ backgroundColor: footerBackground, color: footerTextColor, pt: '3rem', pb: '2rem', mt: '1rem'}}>
      <Container>
        <Grid container spacing={4} sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' }, color: footerTextColor }}>
          {/* Column 1: About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ ml: { md: '1rem', lg: '0.9rem' }, fontWeight: 'bold', color: linkColor }} gutterBottom>
              YARLPROPS
            </Typography>
            <Typography variant="body1" sx={{ ml: { md: '1rem', lg: '0.9rem' }, color: footerTextColor }}>
              Do you have any questions? Feel free to reach out to us. We're available 24/7 to assist you.
            </Typography>
            {/* <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start', lg: 'flex-start' } }}>
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: iconColor }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" sx={{ color: iconColor }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: iconColor }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank" sx={{ color: iconColor }}>
                <LinkedInIcon />
              </IconButton>
            </Box> */}
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', mx: { md: '3.5rem', lg: '4rem'}}}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: linkColor }} gutterBottom>
                Quick Links
              </Typography>
              <Link href="/" underline="hover" sx={{ mb: '0.3rem', color: footerTextColor }}>
                Services
              </Link>
              <Link href="/contact" underline="hover" sx={{ mb: '0.3rem', color: footerTextColor }}>
                Contact Us
              </Link>
              <Link href="/guide" underline="hover" sx={{ color: footerTextColor }}>
                Guide
              </Link>
            </Box>
          </Grid>

          {/* Column 3: Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: linkColor }} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: '0.3rem', color: footerTextColor }}>
              <PhoneIcon sx={{ verticalAlign: 'middle', mr: '0.5rem', color: iconColor }} />
              +94 77 1234567
            </Typography>
            <Typography variant="body1" sx={{ mb: '0.3rem', color: footerTextColor }}>
              <EmailIcon sx={{ verticalAlign: 'middle', mr: '0.5rem', color: iconColor }} />
              PentaPulse@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ color: footerTextColor }}>
              <LocationOnIcon sx={{ verticalAlign: 'middle', mr: '0.5rem', color: iconColor }} />
              Ramanathan Road, Thirunelvely, Jaffna.
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Paper sx={{ mt: '1.5rem', p: '1rem', backgroundColor: paperBackground, color: paperTextColor, boxShadow: 'none' }}>
          <Typography variant="body2" textAlign="center" sx={{ color: paperTextColor }}>
            &copy; {new Date().getFullYear()} YarlProps | Designed by PentaPulse
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

// import React from 'react';
// import '@fortawesome/fontawesome-free/css/all.css';
// import { Container, Grid, Typography, Link, IconButton, Box, Paper, useTheme } from '@mui/material';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import PhoneIcon from '@mui/icons-material/Phone';
// import EmailIcon from '@mui/icons-material/Email';
// import LocationOnIcon from '@mui/icons-material/LocationOn';

// export default function Footer() {
//   const theme = useTheme();

//   const isDarkMode = theme.palette.mode === 'dark';
  
//   const footerBackground = isDarkMode ? '#222' : '#f7f7f7';
//   const footerTextColor = isDarkMode ? '#ddd' : '#333';
//   const linkColor = isDarkMode ? '#90caf9' : '#0d6efd';
//   const iconColor = isDarkMode ? '#90caf9' : '#0d6efd';
//   const paperBackground = isDarkMode ? '#333' : '#e9ecef';
//   const paperTextColor = isDarkMode ? '#aaa' : '#666';

//   return (
//     <Box sx={{ backgroundColor: footerBackground, color: footerTextColor, pt: '3rem', pb: '2rem', mt: '1rem'}}>
//       <Container>
//         <Grid container spacing={4} sx={{ textAlign: { xs: 'center', md: 'left' }, color: footerTextColor }}>
//           {/* Column 1: About Section */}
//           <Grid item xs={12} md={4}>
//             <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: linkColor }}>
//               YARLPROPS
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: '1rem', color: footerTextColor }}>
//               Do you have any questions? Feel free to reach out to us. We're available 24/7 to assist you.
//             </Typography>
//             <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
//               <IconButton href="https://facebook.com" target="_blank" sx={{ color: iconColor }}>
//                 <FacebookIcon />
//               </IconButton>
//               <IconButton href="https://twitter.com" target="_blank" sx={{ color: iconColor }}>
//                 <TwitterIcon />
//               </IconButton>
//               <IconButton href="https://instagram.com" target="_blank" sx={{ color: iconColor }}>
//                 <InstagramIcon />
//               </IconButton>
//               <IconButton href="https://linkedin.com" target="_blank" sx={{ color: iconColor }}>
//                 <LinkedInIcon />
//               </IconButton>
//             </Box>
//           </Grid>

//           {/* Column 2: Quick Links */}
//           <Grid item xs={12} md={4}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: linkColor }}>
//               Quick Links
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//               <Link href="/" underline="hover" sx={{ marginBottom: '0.5rem', color: footerTextColor }}>
//                 Services
//               </Link>
//               <Link href="/contact" underline="hover" sx={{ marginBottom: '0.5rem', color: footerTextColor }}>
//                 Contact Us
//               </Link>
//               <Link href="/guide" underline="hover" sx={{ color: footerTextColor }}>
//                 Guide
//               </Link>
//             </Box>
//           </Grid>

//           {/* Column 3: Contact Information */}
//           <Grid item xs={12} md={4}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem', color: linkColor }}>
//               Contact Us
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: '0.5rem', color: footerTextColor }}>
//               <PhoneIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: iconColor }} />
//               +94 77 1234567
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: '0.5rem', color: footerTextColor }}>
//               <EmailIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: iconColor }} />
//               PentaPulse@gmail.com
//             </Typography>
//             <Typography variant="body1" sx={{ color: footerTextColor }}>
//               <LocationOnIcon sx={{ verticalAlign: 'middle', marginRight: '0.5rem', color: iconColor }} />
//               Ramanathan Road, Thirunelvely, Jaffna
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* Bottom Section */}
//         <Paper sx={{ marginTop: '2rem', padding: '1rem', backgroundColor: paperBackground, color: paperTextColor, boxShadow: 'none' }}>
//           <Typography variant="body2" textAlign="center" sx={{ color: paperTextColor }}>
//             &copy; {new Date().getFullYear()} YarlProps | Designed by PentaPulse
//           </Typography>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }
