
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../api/AuthContext';
import { Link } from 'react-router-dom';
import { addDoc, collection,getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import Swal from 'sweetalert2';

export default function Details({ setSignin, setSignup, itemType, itemId, merchantId }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth()
    const [item, setItem] = useState([])
    const [merchant, setMerchant] = useState({ uid: 'abc' })

    useEffect(() => {
        const fetchItem = async () => {
            const q = query(collection(db, `${itemType}s`), where(`${itemType[0]}id`, '==', itemId));
            try {
                const qSnapshot = await getDocs(q);
                    const product = qSnapshot.docs[0];
                    setItem(product.data() );
            } catch (e) {
                console.log('error getting item dets : ', e)
            }
        }
        const fetchMerchant = async () => {
            try {
                const merchantData = await getDocs(collection(db, 'systemusers'), where('uid', '==', merchantId))
                setMerchant(merchantData)
            }
            catch (e) {
                console.log('error getting m dets : ', e)
            }
        }
        fetchItem()
        console.log(item)
        fetchMerchant()
    }, [itemId])

    const handleOrderNow = async () => {
        // Reference to the orders subcollection for the authenticated user
        const ordersCollectionRef = collection(db, 'systemusers', user.uid, 'orders');
        
        try {
            await addDoc(ordersCollectionRef, {
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                merchantId: item.merchantId,
                orderstatus: 'pending'
            });
            Swal.fire({
                title: 'Your order request was sent to the merchant',
                icon: 'success'
            });
        } catch (e) {
            console.log(e);
        }
    };
    
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
                        onClick={handleOrderNow}
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

