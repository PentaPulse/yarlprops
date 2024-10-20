import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { storage,db  } from '../api/firebase'; // Import your Firebase configurations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const SiteManager = () => {
    const [slides, setSlides] = useState([]);
    const [newSlideTitle, setNewSlideTitle] = useState('');
    const [newSlideMedia, setNewSlideMedia] = useState(null);
    const [newSlideType, setNewSlideType] = useState('image'); // 'image' or 'video'
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('latest'); // 'latest', 'popular'

    useEffect(() => {
        // Fetch latest or popular items based on filter
        const fetchSlides = async () => {
            setLoading(true);
            const slideQuery = query(
                collection(db, 'site'),
                filter === 'latest' ? orderBy('createdAt', 'desc') : orderBy('popularity', 'desc'),
                limit(10)
            );
            const querySnapshot = await getDocs(slideQuery);
            const fetchedSlides = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSlides(fetchedSlides);
            setLoading(false);
        };
        
        fetchSlides();
    }, [filter]);

    const handleMediaUpload = async (media) => {
        const mediaRef = ref(storage, `slides/${uuidv4()}`);
        await uploadBytes(mediaRef, media);
        return getDownloadURL(mediaRef);
    };

    const handleAddSlide = async () => {
        if (!newSlideTitle || !newSlideMedia) return alert('Please provide a title and media.');

        setLoading(true);

        try {
            const mediaUrl = await handleMediaUpload(newSlideMedia);

            await addDoc(collection(db, 'site'), {
                title: newSlideTitle,
                mediaUrl,
                mediaType: newSlideType,
                createdAt: new Date(),
                popularity: 0, // set initial popularity
            });

            alert('Slide added successfully!');
            setNewSlideTitle('');
            setNewSlideMedia(null);
            setNewSlideType('image');
        } catch (error) {
            console.error('Error adding slide:', error);
            alert('Failed to add slide.');
        }

        setLoading(false);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4">Manage Slideshow</Typography>
            
            {/* Filter controls */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="filter-label">Filter Slides</InputLabel>
                <Select
                    labelId="filter-label"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    label="Filter Slides"
                >
                    <MenuItem value="latest">Latest Items</MenuItem>
                    <MenuItem value="popular">Popular Items</MenuItem>
                </Select>
            </FormControl>

            {/* List of slides */}
            <Box sx={{ margin: '20px 0' }}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    slides.map((slide) => (
                        <Box key={slide.id} sx={{ marginBottom: 2 }}>
                            <Typography variant="h6">{slide.title}</Typography>
                            <img src={slide.mediaUrl} alt={slide.title} style={{ width: '100%', height: 'auto' }} />
                        </Box>
                    ))
                )}
            </Box>

            {/* Add new slide */}
            <Typography variant="h5">Add New Slide</Typography>
            <TextField
                label="Slide Title"
                fullWidth
                margin="normal"
                value={newSlideTitle}
                onChange={(e) => setNewSlideTitle(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="media-type-label">Media Type</InputLabel>
                <Select
                    labelId="media-type-label"
                    value={newSlideType}
                    onChange={(e) => setNewSlideType(e.target.value)}
                    label="Media Type"
                >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                </Select>
            </FormControl>
            <input
                type="file"
                accept={newSlideType === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => setNewSlideMedia(e.target.files[0])}
            />
            <Button variant="contained" onClick={handleAddSlide} disabled={loading}>
                {loading ? 'Adding...' : 'Add Slide'}
            </Button>
        </Box>
    );
};

export default SiteManager;
