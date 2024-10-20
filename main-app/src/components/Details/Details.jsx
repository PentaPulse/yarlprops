import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';
import { addOrder } from '../../api/db/orders';
import { useAlerts } from '../../api/AlertService';
import { collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../api/firebase';

export default function Details({ setSignin, setSignup, itemType, itemId, itemTitle, merchantId}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const {showAlerts}=useAlerts()
    const [merchantName,setMerchantName]=useState('')

    useEffect(()=>{
        const fetchMerchantName=async()=>{
            try{
                const q = await getDocs(collection(db,'systemusers'),where('uid','==',merchantId))
                const name = q.docs.map((doc)=>doc.data().displayName)
                setMerchantName(name)
            }catch(e){
                console.log(e)
            }
        }
        fetchMerchantName()

    },[])

    const handleOrderNow = async () => {
        try {
            await addOrder(user, itemId, itemTitle, itemType, merchantId, merchantName).then((result)=>{
                if(result.success){
                    showAlerts('Your order request was sent to the merchant','success')
                }
                else{
                    showAlerts('Please wait for previous order done!!!','warning')
                }
            })
        } catch (e) {
            console.log('Error placing order: ', e);
        }
    };

    if (user) {
        return (
            <>
                <Box>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-user"></i> Name: {merchantName}
                    </Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-location-dot"></i> Location: *******
                    </Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-phone"></i> Contact No: +94 #########
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        component={Link}
                        to=""
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                            mt: '0.8rem',
                            fontWeight: 'bold',
                            backgroundColor: '#0d6efd',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#90caf9',
                            },
                        }}
                        onClick={handleOrderNow}
                    >
                        Order Now
                    </Button>
                </Box>
            </>
        );
    } else {
        return (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Typography>
                    <Button onClick={setSignin}>Sign in</Button> or <Button onClick={setSignup}>Sign up</Button> to see seller details
                </Typography>
            </Box>
        );
    }
}
