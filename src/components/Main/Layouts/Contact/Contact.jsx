import * as React from 'react';
import Image1 from "./images/contact1.jpg"
import Image2 from "./images/hi1.png"

import { Box, Typography } from "@mui/material"
import Grid from '@mui/system/Unstable_Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SendIcon from '@mui/icons-material/Send';




function Contact() {
  return (
    <div>
      <Box sx={{
        backgroundImage: `url(${Image1})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: 600,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
      <Box
        sx={{
        width: { xs: "100%", sm: "100%", md: "100%" },
        padding: { xs: 3, sm: 2, md: 20 },
          }}
          >
      <Box sx={{ background: "white", opacity: "0.8", borderRadius: 3, padding: { xs: 3 } }}>
        <Typography variant={"h1"} color="black" align="center" pt={8}>
        <b>Contact Us</b>
         </Typography>
        <Typography variant="body1" color="black" align="center" pb={8}>
            We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support.
            You can always count on us for live help whenever you need assistance.Call us now!
        </Typography>
      </Box>
      </Box>
      </Box>
      <Box>
        <Typography variant={"h3"} color="black" align="left" pt={8}>
          <b>Contact <b style={{ color: "#0d6efd" }}>Yarl</b>Props</b>
        </Typography>
        <Typography variant="body1" color="black" align="left" pb={8}>
          If you want to know more about our service or  have any issue simply get in touch with us, fill in the form here or please call one of our toll-free numbers below or email using the contact form below.
        </Typography>
      </Box>
      <Box>
        <Grid container rowSpacing={3}>
          <Grid xs={12} sm={8}>
            <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", padding: { xs: 3 }, borderRadius: 4 }}>
              <CardContent>
                <Typography gutterBottom variant="h5">
                  <b>Get in touch</b>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                  Fill up the form and our team will get back to you within 24 hours.
                </Typography>
                <form>
                  <Grid container spacing={1}>
                    <Grid xs={12} sm={6} item>
                      <TextField placeholder="Enter first name" label="First Name" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid xs={12} sm={6} item >
                      <TextField placeholder="Enter last name" label="Last Name" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField type="number" placeholder="Enter phone number" label="Phone" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Message" multiline rows={4} placeholder="Type your message here" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" endIcon={<SendIcon />} fullWidth>Send</Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <img src={Image2} alt="Image 2" style={{ maxWidth: '90%', height: 'auto', marginLeft: 30 }} />
            </Box>
          </Grid>
        </Grid>

      </Box>
      <Box sx={{ width: "100%", marginTop: 10 }}>
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.966514762512!2d80.02048177450527!3d9.683898978395154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1712031159798!5m2!1sen!2slk" 
    width="100%" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</Box>

    </div>
  )
}

export default Contact