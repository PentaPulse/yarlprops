import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';
import {  collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import Swal from 'sweetalert2';
import { addOrder } from '../../api/db/orders';
import { fetchMerchantDets } from '../../api/db/users';

export default function Details({ setSignin, setSignup, itemType, itemId, merchantId }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [iid, setIId] = useState('pid');

    useEffect(() => {
        const fetchItem = async () => {
            switch (itemType) {
                case 'products':
                    setIId('pid');
                    break;
                case 'rentals':
                    setIId('rid')
                    break;

                case 'services':
                    setIId('sid');
                    break;
                default:
                    console.log('Unknown item type');
                    return;
            }

            try {
                const itemQuery = query(collection(db, itemType), where(iid, '==', itemId));
                const qSnapshot = await getDocs(itemQuery);
                const product = qSnapshot.docs.map((doc) => doc.data());
                setItem(product[0]); // Assuming only one item is returned
            } catch (e) {
                console.log('Error getting item details: ', e);
            }
        };

        const fetchMerchant = async () => {
            try {
                const data = await fetchMerchantDets(merchantId);
                setMerchant(data);
            } catch (e) {
                console.log('Error getting merchant details: ', e);
            }
        };

        fetchItem();
        fetchMerchant();
        console.log(item)
        console.log(merchant)
    }, []);

    const handleOrderNow = async () => {
        try {
            if (item && merchant) {
                await addOrder(user, itemId, item.title, itemType, merchantId);
                Swal.fire({
                    title: 'Your order request was sent to the merchant',
                    icon: 'success',
                });
            } else {
                Swal.fire({
                    title: 'Item or merchant information is missing',
                    icon: 'error',
                });
            }
        } catch (e) {
            console.log('Error placing order: ', e);
        }
    };

    if (user) {
        return (
            <>
                <Box>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-user"></i> Name: {merchant?.displayName}
                    </Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-location-dot"></i> Location: {item?.location}
                    </Typography>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }} gutterBottom>
                        <i className="fa-solid fa-phone"></i> Contact No: {merchant?.phoneNumber}
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
