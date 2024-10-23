import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, ImageList, ImageListItem, Stack, Tab, Tabs, Paper, ListSubheader, ImageListItemBar, IconButton } from '@mui/material';
import { storage, db } from '../api/firebase'; // Import your Firebase configurations
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, getDocs, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { addQuestions, getQuestions, getQuestionsFromContactus, removeSlide } from '../api/db/siteManager';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SiteManager() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Slideshow" {...a11yProps(0)} />
                    <Tab label="Guide" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <SlideshowManagement />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <GuideManagement />
            </CustomTabPanel>
        </Box>
    );
};

export const SlideshowManagement = () => {
    const [slides, setSlides] = useState([]);
    const [newSlideTitle, setNewSlideTitle] = useState('');
    const [newSlideMedia, setNewSlideMedia] = useState(null);
    const [newSlideType, setNewSlideType] = useState('image');
    const [loading, setLoading] = useState(false);

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

            const docRef=await addDoc(collection(db, 'site'), {
                title: newSlideTitle,
                mediaUrl,
                mediaType: newSlideType,
                createdAt: new Date(),
                popularity: 0, // set initial popularity
            });

            await setDoc(docRef, { id: docRef.id }, { merge: true });

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

    const handleRemoveSlide =async(id)=>{
        await removeSlide(id);
    }

    return (
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
                {slides.map((slide) => (
                    <ImageListItem >
                        {slide.mediaType === 'image' &&
                            <img src={slide.mediaUrl} alt={slide.title} style={{ width: '100%', height: 'auto' }} />
                        }
                        {slide.mediaType === 'video' &&
                            <video
                                src={slide.mediaUrl}
                                alt={slide.title}
                                style={{ width: '100%', height: 'auto' }}
                                controls
                                loop
                                muted
                                playsInline
                            >
                                Your browser does not support the video tag.
                            </video>
                        }
                        <ImageListItemBar
                            title={slide.title}
                            actionIcon={
                                <IconButton
                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                    aria-label={`remove`}
                                    onClick={()=>handleRemoveSlide(slide.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>            
        </Box>
    )
}
export const GuideManagement = () => {
    const [guideQuestion, setGuideQuestion] = useState({
        from: '',
        for: '',
        question: '',
        answer: ''
    });

    const [questionsList, setQuestionsList] = useState({
        customers: [],
        merchants: []
    });

    const [contactusQuestions, setContactusQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestionLists = async (type) => {
            try {
                const qs = await getQuestions(type);
                setQuestionsList((prevQuestions) => ({
                    ...prevQuestions,
                    [type]: qs
                }));
            } catch (e) {
                console.error("Error fetching questions:", e);
            }
        };

        const fetchQuestionsFromContactUs = async () => {
            try {
                const data = await getQuestionsFromContactus();
                setContactusQuestions(data);
            } catch (e) {
                console.error("Error fetching contact us questions:", e);
            }
        };

        fetchQuestionLists('customers');
        fetchQuestionLists('merchants');
        fetchQuestionsFromContactUs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuideQuestion((prevQuestion) => ({
            ...prevQuestion,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (guideQuestion.from && guideQuestion.for && guideQuestion.question && guideQuestion.answer) {
            await addQuestions(guideQuestion);
            console.log(guideQuestion);
        } else {
            alert('Please fill all fields');
            console.log(guideQuestion);
        }
    };

    return (
        <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4">Manage Guide</Typography>
                <Box display={'flex'} flexDirection={'row'} sx={{ width: '100%', gap: 2 }}>
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
                </Box>
                <Box display={'flex'} flexDirection={'row'} sx={{ width: '100%', gap: 2 }}>
                    {guideQuestion.from === 'contactus' && (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }} required>
                                <InputLabel>Select question</InputLabel>
                                <Select
                                    name="question"
                                    value={guideQuestion.question || ''}
                                    onChange={handleInputChange}
                                    label="Select question"
                                >
                                    {contactusQuestions.map((question) => (
                                        <MenuItem key={question.id} value={question.message}>{question.message}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Enter your answer"
                                name="answer"
                                value={guideQuestion.answer}
                                onChange={(e) => setGuideQuestion({ ...guideQuestion, answer: e.target.value })}
                                required
                            />
                        </>
                    )}
                    {guideQuestion.from === 'newq' && (
                        <>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Enter your question"
                                name="question"
                                value={guideQuestion.question}
                                onChange={(e) => setGuideQuestion({ ...guideQuestion, question: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Enter your answer"
                                name="answer"
                                value={guideQuestion.answer}
                                onChange={(e) => setGuideQuestion({ ...guideQuestion, answer: e.target.value })}
                                required
                            />
                        </>
                    )}
                </Box>
                <Button onClick={handleSubmit}>Add Question</Button>
            </Box>
            <Paper sx={{ display: 'flex', mt: 4 }}>
                <Stack width='50%' sx={{ p: 2 }}>
                    <Typography variant="h6">For Customers</Typography>
                    {questionsList.customers.length > 0 ?
                        questionsList.customers.map((question) => (
                            <MenuItem key={question.id}>{question.question}</MenuItem>
                        ))
                        :
                        <MenuItem>No questions available</MenuItem>}
                </Stack>
                <Stack width='50%' sx={{ p: 2 }}>
                    <Typography variant="h6">For Merchants</Typography>
                    {questionsList.merchants.length > 0 ?
                        questionsList.merchants.map((question) => (
                            <MenuItem key={question.id}>{question.question}</MenuItem>
                        ))
                        :
                        <MenuItem>No questions available</MenuItem>}
                </Stack>
            </Paper>
        </Box>
    );
};
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}