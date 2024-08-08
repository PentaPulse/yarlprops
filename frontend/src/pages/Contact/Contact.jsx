import * as React from 'react';
import Image1 from "./images/contact1.jpg";
import Image2 from "./images/hi1.png";

import { Box, Typography } from "@mui/material";
import Grid from '@mui/system/Unstable_Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@mui/system';
import { sendMessage } from '../../api/db/contactus';
//import { useAlerts } from '../../backend/AlertService';

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

function Contact() {
  const [details, setDetails] = React.useState({
    fname: '',
    lname: '',
    email: '',
    message: '',
    status: 'new'
  })
  //const { showAlerts } = useAlerts()

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(details);
      console.log('1')
      //showAlerts('Message sent successfully', 'success');
    } catch (error) {
      console.log(error)
      //showAlerts('Try again', 'info');
    }
  };
  return (
    <div>
      {/* About Us Section */}
      <Box sx={{
        padding: 4, backgroundColor: "#333", color: "#fff", marginBottom: 4, height: 300,
        width: "93%", marginX: 6
      }}>
        <Typography variant="h2" align="center" gutterBottom>
          <b>About Us</b>
        </Typography>
        <Typography variant="body1" align="center" maxWidth="md" sx={{ margin: '0 auto', paddingBottom: 4 }}>
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
        width: "93%",
        display: "flex",
        justifyContent: "center",
        marginX: 6,
      }}>
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "80%" },
            padding: { xs: 3, sm: 2, md: 20 },
            animation: `${bounceAnimation} 1.5s ease-in-out infinite`,
          }}
        >
          <Box sx={{ background: "white", opacity: "0.8", borderRadius: 3, padding: { xs: 3 } }}>
            <Typography variant={"h1"} color="black" align="center" pt={8}>
              <b>Contact Us</b>
            </Typography>
            <Typography variant="body1" color="black" align="center" pb={8}>
              We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support.
              You can always count on us for live help whenever you need assistance. Call us now!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ padding: 4 }}>
        <Typography variant={"h3"} align="left" pt={8}>
          <b>Contact <span style={{ color: "#0d6efd" }}>Yarl</span>Props</b>
        </Typography>
        <Typography variant="body1" align="left" pb={8}>
          If you want to know more about our service or have any issue, simply get in touch with us. Fill in the form here or please call one of our toll-free numbers below or email using the contact form below.
        </Typography>
      </Box>
      <Box sx={{ padding: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", padding: { xs: 3 }, borderRadius: 4 }}>
              <CardContent>
                <Typography gutterBottom variant="h5">
                  <b>Get in touch</b>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                  Fill up the form and our team will get back to you within 24 hours.
                </Typography>
                <form >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField placeholder="Enter first name" label="First Name" variant="outlined" name='fname' fullWidth value={details.fname} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField placeholder="Enter last name" label="Last Name" variant="outlined" name='lname' fullWidth value={details.lname} onChange={handleChange} required />
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
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <img src={Image2} alt="Contact Us" style={{ maxWidth: '80%', height: 'auto', margin: '0 auto' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Map Section */}
      <Box sx={{ width: "100%", marginTop: 10, marginX: 6 }}>
        <iframe title='our-map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.966514762512!2d80.02048177450527!3d9.683898978395154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1712031159798!5m2!1sen!2slk"
          width="93%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </Box>
    </div>
  );
}

export default Contact;
