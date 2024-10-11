
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';
import { collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../api/firebase';

export default function Details({ setSignin,setSignup,itemType,itemId,merchantId}) {
    const theme=useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {user}=useAuth()
    const [item,setItem]=useState([])
    const [merchant,setMerchant]=useState([])

    useEffect(()=>{
        const fetchItem =async()=>{
            try{
                const itemData = await getDocs(collection(db,`${itemType}s`),where(`${itemType.charAt(0)}id`,'==',itemId))
                setItem(itemData)
            }catch(e){
                console.log('error getting item dets : ',e)
            }
        }
        const fetchMerchant=async()=>{
            try{
                const merchantData=await getDocs(collection(db,'systemusers'),where('uid','==',merchantId))
                setMerchant(merchantData)
            }
            catch(e){
                console.log('error getting m dets : ',e)
            }
        }
        fetchItem()
        fetchMerchant()
    },[])

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
                        Order Now
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