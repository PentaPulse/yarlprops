import * as React from 'react';
import Image1 from "./images/contact1.jpg";
import Image2 from "./images/hi1.png";

import { Box, Typography,Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@mui/system';
import { sendMessage } from '../../api/db/contactus';
import { useAlerts } from '../../api/AlertService';

const bounceAnimation = keyframes`  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

function Contact() {
  const [details, setDetails] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const { showAlerts } = useAlerts();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const { firstName, lastName, email, message } = details;
      if (!firstName || !lastName || !email || !message) {
        showAlerts('Fill all the details', 'warning');
        return;
      }

      await sendMessage(firstName, lastName, email, message);
      showAlerts('Message sent successfully', 'success');

      setDetails({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      showAlerts('Failed to send message. Please try again.', 'error');
    }
  };
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* About Us Section */}
      <Box sx={{
        padding: 2, backgroundColor: "#333", color: "#fff", marginBottom: 4,
        width: "90%"
      }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          <b>About Us</b>
        </Typography>
        <Typography  align="justify" maxWidth="lg" sx={{ margin: '0 auto', paddingBottom: 4 ,fontSize: { xs: '1.1rem', sm: '1.2rem', md: '2rem' ,lg:'1.2rem' }}}>
          Welcome to YarlProps, your trusted platform for property management and advertisement. Whether you're looking to rent, buy, or sell a property, or you need reliable services, YarlProps offers comprehensive solutions tailored to your needs. Our platform connects property owners, renters, and service providers in a seamless and efficient manner. With our user-friendly interface and extensive listings, finding your next home or service has never been easier. At YarlProps, we are committed to providing superior customer service and innovative tools to help you navigate the property market with confidence.
        </Typography>
      </Box>

      {/* Contact Section */}
      <Box sx={{
        backgroundImage: `url(${Image1})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: 600,
        width: "90%",
        display: "flex",
        justifyContent: "center",


      }}>
        <Box
          sx={{
            width: { xs: "100%", sm: "90%", md: "80%" },
            padding: { xs: 0.5, sm: 2, md: 3 },
            animation: `${bounceAnimation} 1.5s ease-in-out infinite`,
           
          }}
        >
          <Box sx={{ background: "white", opacity: "0.8", borderRadius: 3, padding: { xs: 3 } ,}}>
            <Typography variant={"h2"} color="black" align="center" pt={8} gutterBottom>
              <b>Contact Us</b>
            </Typography>
            <Typography sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '2rem' ,lg:'1.2rem' },
          }}
           color="black" align="justify" pl={1} pr={1} pb={8}>
              We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support.
              You can always count on us for live help whenever you need assistance. Call us now!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ padding: 4,marginLeft: '35px' }}>
        <Typography variant={"h3"} align="center" pt={8} gutterBottom>
          <b>Contact <span style={{ color: "#018ABD" }}>Yarl</span>Props</b>
        </Typography>
        <Typography sx={{
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '2rem' ,lg:'1.2rem' },
          }} align="center" pb={8} >
          We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support...
        </Typography>

        <Box
  sx={{
    padding: { xs: 1, sm: 2, md: 3 },
    margin: "0 auto", 
    width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" }, 
  }}
>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", padding: { xs: 1}, borderRadius: 4 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    <b>Get in touch</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                    Fill up the form and our team will get back to you within 24 hours.
                  </Typography>
                  <form >
                  <Typography   gutterBottom>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField placeholder="Enter first name" label="First Name" variant="outlined" name='firstName' fullWidth value={details.firstName} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField placeholder="Enter last name" label="Last Name" variant="outlined" name='lastName' fullWidth value={details.lastName} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" name='email' fullWidth value={details.email} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField label="Message" multiline rows={4} placeholder="Type your message here" name='message' variant="outlined" fullWidth value={details.message} onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" variant="contained" onClick={handleSubmit} endIcon={<SendIcon />} fullWidth>Send</Button>
                      </Grid>
                    </Grid>
                    </Typography>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <img src={Image2} alt="Contact Us" style={{ maxWidth: '70%', height: 'auto', margin: '0 auto' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Map Section */}
      <Box sx={{ width: "90%", marginTop: { lg: 2, md: 2, sm: 2, xs: 1 } }}>
        <iframe title='our-map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.966514762512!2d80.02048177450527!3d9.683898978395154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1712031159798!5m2!1sen!2slk"
          width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </Box>
    </Box>
  );
}

export default Contact;
