import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, ImageList, ImageListItem } from '@mui/material';
import { storage, db } from '../api/firebase'; // Import your Firebase configurations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const SiteManager = () => {
    const [slides, setSlides] = useState([]);
    const [newSlideTitle, setNewSlideTitle] = useState('');
    const [newSlideMedia, setNewSlideMedia] = useState(null);
    const [newSlideType, setNewSlideType] = useState('image'); // 'image' or 'video'
    const [loading, setLoading] = useState(false);
    const [guideQuestion, setGuideQuestion] = useState({
        from: '',
        for: '',
        question: '',
        answer: ''
    })


    let slideCount;

    useEffect(() => {
        // Fetch latest or popular items based on filter
        const fetchSlides = async () => {
            setLoading(true);
            const slideQuery = query(
                collection(db, 'site'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(slideQuery);
            const fetchedSlides = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            slideCount = querySnapshot.size
            setSlides(fetchedSlides);
            setLoading(false);
        };

        fetchSlides();
    }, [slideCount]);

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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuideQuestion((prevQuestion) => ({
            ...prevQuestion,
            [name]: value,
        }));
    };
    return (
        <> {/*Slideshow management*/}
            <Box sx={{ padding: 4, display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ padding: 4 }}>
                    <Typography variant="h4">Manage Slideshow</Typography>
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
                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                    {slides.map((slide, index) => (
                        <ImageListItem key={index}>
                            {slide.mediaType === 'image' &&
                                <img src={slide.mediaUrl} alt={slide.title} style={{ width: '100%', height: 'auto' }} />
                            }
                            {slide.mediaType === 'video' &&
                                <video
                                    src={slide.mediaUrl}
                                    alt={slide.title}
                                    style={{ width: '100%', height: 'auto' }}
                                    controls // Adds play, pause, volume, etc. controls to the video
                                    loop // Loops the video if you want it to repeat
                                    muted // Mutes the video if you want it silent by default
                                    playsInline // Ensures the video plays inline on mobile devices
                                >
                                    Your browser does not support the video tag.
                                </video>
                            }
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
            {/*Guide management */}
            <Box sx={{ padding: 4, display: 'flex', flexDirection: 'row' }}>
                <Box>
                    <Typography variant="h4">Manage Slideshow</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }} required>
                        <InputLabel>From</InputLabel>
                        <Select
                            name="from"
                            value={guideQuestion.from}
                            onChange={handleInputChange}
                            label="From"
                        >
                            <MenuItem value='contactus'>Contact us</MenuItem>
                            <MenuItem value='newq'>New question</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }} required>
                        <InputLabel>For</InputLabel>
                        <Select
                            name="for"
                            value={guideQuestion.for}
                            onChange={handleInputChange}
                            label="For"
                        >
                            <MenuItem value='merchants'>Merchants</MenuItem>
                            <MenuItem value='customers'>Customers</MenuItem>
                        </Select>
                    </FormControl>
                    {guideQuestion.from === 'contactus' &&
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }} required>
                                <InputLabel>Select question</InputLabel>
                                <Select
                                    name="selectQuestion"
                                    value={guideQuestion.merchantName || ''}
                                    onChange={handleInputChange}
                                    label="Select question"
                                >
                                    <MenuItem value='contactus'>Contact us</MenuItem>
                                    <MenuItem value='newq'>New question</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 2 }} required>
                                <InputLabel>Select answer</InputLabel>
                                <Select
                                    name="selectAnswer"
                                    value={guideQuestion.merchantName || ''}
                                    onChange={handleInputChange}
                                    label="MSelect answer"
                                >
                                    <MenuItem value='contactus'>Contact us</MenuItem>
                                    <MenuItem value='newq'>New question</MenuItem>
                                </Select>
                            </FormControl>

                        </>}
                    {guideQuestion.from === 'newq' && (
                        <>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Enter your question"
                                name="question"
                                value={guideQuestion.question}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Enter your answer"
                                name="answer"
                                value={guideQuestion.answer}
                                onChange={handleInputChange}
                                required
                            />
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default SiteManager;
