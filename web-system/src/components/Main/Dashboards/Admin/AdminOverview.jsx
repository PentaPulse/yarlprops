import { Container, Grid, Paper, Typography } from '@mui/material'
import * as React from 'react'
import { db } from '../../../../backend/secrets';
import { collection, getDocs, query, where } from 'firebase/firestore';

function AdminOverview() {
    const [metrics, setMetrics] = React.useState({
        totalSellers: 0,
        totalRenters: 0,
        totalBuyers: 0,
        newRequests: 0,
        totalListings: 0,
        contactResponses: 0,
    });

    React.useEffect(() => {
        // Fetch data from Firebase and update state
        const fetchData = async () => {
            const sellers = await getDocs(query(collection(db, 'systemusers'), where("role", "==", "seller")))
            const renters = await getDocs(query(collection(db, 'systemusers'), where("role", "==", "renter")))
            const buyers = await getDocs(query(collection(db, 'systemusers'), where("role", "==", "buyer")))
            //const requests = await db.collection('requests').where('status', '==', 'pending').get();
            //const listings = await db.collection('listings').get();
            //const contacts = await db.collection('contactResponses').where('status', '==', 'pending').get();

            setMetrics({
                totalSellers: sellers.size,
                totalRenters: renters.size,
                totalBuyers: buyers.size,
                //newRequests: requests.size,
                //totalListings: listings.size,
                //contactResponses: contacts.size,
            });
        };

        fetchData();
    }, []);

    return (
        <>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Total Sellers</Typography>
                    <Typography variant="h4">{metrics.totalSellers}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Total Renters</Typography>
                    <Typography variant="h4">{metrics.totalRenters}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Total Buyers</Typography>
                    <Typography variant="h4">{metrics.totalBuyers}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Pending Requests</Typography>
                    <Typography variant="h4">{metrics.newRequests}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Total Listings</Typography>
                    <Typography variant="h4">{metrics.totalListings}</Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Paper>
                    <Typography variant="h6">Contact Responses</Typography>
                    <Typography variant="h4">{metrics.contactResponses}</Typography>
                </Paper>
            </Grid>
        </>
    );
}

export default AdminOverview
