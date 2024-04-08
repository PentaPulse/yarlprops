import * as React from 'react';
import Image1 from "./images/contact.jpg"
import {Box,Typography} from  "@mui/material"

function Contact() {
  return (
    <div>
        <Box  sx={{
            backgroundImage:`url(${Image1})`,
            backgroundRepeat:"no-repeat",
            backgroundColor:"black",
            backgroundAttachment:"fixed",
            backgroundPosition:"center",
            backgroundSize:"cover",
            height:600,
            width:"100%",
            display:"flex",
            justifyContent:"center",
            
            

        }}>
            <Box
            sx={{
                width:{xs:"100%",sm:"100%",md:"100%"},
                padding:{xs:3,sm:2,md:20},
            }}
            >
                <Box sx={{background:"white",opacity:"0.8",padding:{xs:3}}}>
                <Typography variant={"h1"} color="black" align="center" pt={8}>
              <b>Contact Us</b>
            </Typography>

            <Typography variant="body1" color="black" align="center"  pb={8}>
            We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support.
         You can always count on us for live help whenever you need assistance.Call us now!
            </Typography>

                </Box>
            </Box>
    </Box>
      
    </div>
  )
}

export default Contact
