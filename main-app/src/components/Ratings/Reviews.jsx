import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { fetchRatings } from '../../api/db/feedback';

export const RatingsSummary = ({ itemType,itemId, merchantId }) => {
    const [ratings, setRatings] = useState({ itemRating: 0, merchantRating: 0 });

    useEffect(() => {
        const getRatings = async () => {
            const fetchedRatings = await fetchRatings(itemType,itemId, merchantId);
            setRatings(fetchedRatings);
        };
        getRatings();
    }, [itemId, merchantId]);

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6">Ratings Summary</Typography>
            <Typography>Item Rating: {ratings.itemRating}</Typography>
            <Typography>Merchant Rating: {ratings.merchantRating}</Typography>
        </Box>
    );
};
