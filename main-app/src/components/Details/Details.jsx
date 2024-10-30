import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';
import { addOrder } from '../../api/db/orders';
import { useAlerts } from '../../api/AlertService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';

export default function Details({ setSignin, setSignup, itemType, itemId, itemTitle,itemImage, merchantId}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const {showAlerts}=useAlerts()
    const [merchant,setMerchant]=useState('')

    useEffect(()=>{
        const fetchMerchant = async () => {
            try {
              const q = await getDocs(
                query(collection(db, 'systemusers'), where('uid', '==', merchantId))
              );
              
              if (!q.empty) {
                const data = q.docs[0].data()
                setMerchant(data); 
              } else {
                setMerchant(null);
              }
            } catch (e) {
            }
          };
        fetchMerchant()

    },[])

    const handleOrderNow = async () => {
        try {
            await addOrder(user, itemId,itemImage, itemTitle, itemType,1, merchantId, merchant.displayName).then((result)=>{
                if(result.success){
                    showAlerts('Your order request was sent to the merchant','success')
                }
                else{
                    showAlerts('Please wait for previous order done!!!','warning')
                }
            })
        } catch (e) {
        }
    };

    if (user) {
        return (
            <>
                <Box>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-user"></i> Name: {merchant.displayName}
                    </Typography>

                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-location-dot"></i> Location: {merchant.address}
                    </Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-phone"></i> Contact No: {merchant.phoneNumber}
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
                            backgroundColor: '#018ABD',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#004581',
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
