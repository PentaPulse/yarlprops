
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';

export default function Details({ setSignin,setSignup,item,merchant}) {
    const theme=useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {user}=useAuth()

    const hanldeBuyNow = () => {

    }
    if (user) {
        return (
            <>
                <Box>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom><i className="fa-solid fa-user"></i> Name : {merchant && merchant.firstName + ' ' + merchant.lastName}</Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom><i className="fa-solid fa-location-dot"></i> Location : {item.location}</Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom><i className="fa-solid fa-phone"></i> Contact No : {merchant && merchant.phoneNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to=""
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            mt: '0.8rem',
                            fontWeight: 'bold',
                            backgroundColor: '#0d6efd',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#90caf9',
                            }
                        }}
                        onClick={hanldeBuyNow}
                    >
                        Buy Now
                    </Button>
                </Box>
            </>)
    }
    else {
        return (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Typography> <Button onClick={setSignin}>Signin</Button> or <Button onClick={setSignup}>Signup</Button> to see Seller details</Typography>
            </Box>
        )
    }
}