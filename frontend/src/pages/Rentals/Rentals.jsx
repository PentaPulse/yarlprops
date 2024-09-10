import { Box, Button, capitalize, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Slider, TextField, Typography } from '@mui/material';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import * as React from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { db } from '../../api/firebase';
import DbError from '../../components/DbError/DbError';
import { useTheme } from '@emotion/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { rentalFilters } from '../../components/menuLists';

export default function Rentals() {
    const [category, setCategory] = React.useState(null)
    const [subCategory, setSubCategory] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);
    const { cat } = useParams()
    React.useEffect(() => {
        if (cat) {
            setCategory(cat)
        }
    }, [cat])

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
    };
    const handleSubCategoryegoryChange = (event) => {
        const value = event.target.value;
        setSubCategory(value)
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleClearCategories = () => {
        setCategory(null)
        setSubCategory(null)
    }
    const handleClearSubCategoryegories = () => {
        setSubCategory(null)
    }

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={11} sm={11} md={11} lg={3}>
                <Paper
                    sx={{
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: 3,
                        marginLeft: '5rem'
                    }}
                >
                    <FormControl>
                        <FormLabel>Categories</FormLabel>
                        <RadioGroup name='categories' value={category} onChange={handleCategoryChange}>
                            {Object.keys(rentalFilters["categories"]).map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={<Radio value={category} />}
                                    label={category}
                                />
                            ))}
                        </RadioGroup>
                        {category && <Button onClick={handleClearCategories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl>
                        <FormLabel>Sub Categories</FormLabel>
                        {category && (
                            <RadioGroup value={subCategory} onChange={handleSubCategoryegoryChange}>
                                {rentalFilters["categories"][category]?.map((subCategoryegory) => (
                                    <FormControlLabel
                                        key={subCategoryegory}
                                        control={<Radio value={subCategoryegory} />}
                                        label={subCategoryegory}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {subCategory && <Button onClick={handleClearSubCategoryegories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Price Range
                    </Typography>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        step={500}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Quantity
                    </Typography>
                    <TextField
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        InputProps={{ inputProps: { min: 1, max: 10 } }}
                        fullWidth
                    />
                </Paper>
            </Grid>
            <Grid item md={9}>
                <RentalsContents
                    category={category}
                    subCategory={subCategory}
                    priceRange={priceRange}
                    quantity={quantity}
                />
            </Grid>
        </Grid>
    );
}

function RentalsContents({  category, subCategoryegory, price, quantity }) {
    const [rentals, setRentals] = React.useState([]);
    const navigate = useNavigate();
    const [search]=useSearchParams()
    const searchTerm=search.get('search')

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchTerm || category || subCategoryegory ) {
                    let q;
                    const rentalRef = collection(db, 'rentals')
                    if (searchTerm !== null) {
                        q = query(rentalRef, where('title', '>=', capitalize(searchTerm)), where('title', '<=', capitalize(searchTerm) + '\uf8ff'));
                    }
                    if (category !== null) {
                        q = query(rentalRef, where('category', '==', category))
                    }
                    if (subCategoryegory !== null) {
                        q = query(rentalRef, where('subCategoryegory', '==', subCategoryegory))
                    }/*
                if (price) {
                    q = query(rentalRef, where('category', '==', price))
                }
                if (quantity) {
                    q = query(rentalRef, where('category', '==', quantity))
                }*/
                    const querySnapshot = await getDocs(q);
                    const items = querySnapshot.docs.map(doc => doc.data());
                    setRentals(items);

                } else {
                    const q = await getDocs(query(collection(db, 'rentals')));
                    const rentalList = q.docs.map(doc => doc.data())
                    setRentals(rentalList);
                }
            } catch (e) {
                setRentals([])
            }
        };
        fetchData()
    }, [searchTerm, category, subCategoryegory, price, quantity]);

    const handleCardClick = (rid) => {
        navigate(`/p/rental/${rid}`);
    };
    return (
        <Container fixed>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {!rentals ? <DbError items={9} /> : rentals.length === 0 ?
                    <DbError items={9} />
                    :
                    rentals.map((rental, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                                <CardActionArea onClick={() => handleCardClick(rental.rid)}>
                                    <CardMedia
                                        sx={{ height: '20rem' }}
                                        image={rental.images[0] || 'https://picsum.photos/id/11/200/300'}
                                        title={rental.name}
                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant='h6' component='div' color='inherit'>
                                            {rental.title}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                                        {(rental.status === "For Sale") ? (<Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>For Sale</Button>) : ((rental.status === "For Rent") ? (<Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>For Rent</Button>) : ((<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>Sold Out!</Button>)))}
                                    </CardActions>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export function RentalsPage() {
    const [rental, setRental] = React.useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0); // Track the index of the selected image
    const { id } = useParams();
    const theme = useTheme();

    React.useEffect(() => {
        const fetchrental = async () => {
            try {
                const q = await getDoc(query(collection(db, 'rentals'), where('rid', '==', id)))
                const rentalData = q.docs.map(doc => doc.data())
                setRental(rentalData);
                setSelectedImageIndex(0);
            } catch (error) {
                console.error("Error fetching rental:", error);
            }
        };

        fetchrental();
    }, [id]);

    if (!rental) {
        return <CircularProgress />;
    }

    const handlePrevious = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : rental.images.length - 1));
    };

    const handleNext = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex < rental.images.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <Container sx={{ backgroundColor: theme.palette.background.default }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {/* Main rental Image */}
                    <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardMedia
                            component="img"
                            image={rental.images[selectedImageIndex]}  // Display the selected image as the main rental image
                            alt={rental.name}
                            sx={{ borderRadius: '0px', width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </Card>

                    {/* Small Images Grid */}
                    <Grid container spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                        <Grid item>
                            <IconButton onClick={handlePrevious}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Grid>

                        {rental.images.map((image, index) => (
                            <Grid item xs={3} key={index}>
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`image ${index}`}
                                    sx={{
                                        width: '100%',
                                        height: '100px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        border: selectedImageIndex === index ? '3px solid blue' : 'none', // Highlight the selected image
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                    onClick={() => setSelectedImageIndex(index)}  // Update the main image on click
                                />
                            </Grid>
                        ))}

                        <Grid item>
                            <IconButton onClick={handleNext}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardContent sx={{ marginTop: '30px', marginBottom: '30px' }}>
                            {/* rental Details */}
                            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{rental.title}</Typography>
                            <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                Category: {rental.category}
                            </Typography>
                            <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                Type: {rental.type}
                            </Typography>
                            <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                {(rental.status === "For Sale") ?
                                    (<Box sx={{ backgroundColor: "green", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>For Sale</Box>)
                                    : ((rental.status === "For Rent") ?
                                        (<Box sx={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>For Rent</Box>)
                                        : (<Box sx={{ backgroundColor: "red", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>Sold Out!</Box>))}
                            </Typography>

                            <Box sx={{ mx: '1.9rem', mt: '1rem' }}>
                                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography>
                                <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                                    <li>{rental.description}</li>
                                    <li>Quantity: {rental.quantity}</li>
                                    <li>Location: {rental.location}</li>
                                </ul>
                            </Box>
                            <Box sx={{ marginLeft: '1rem', marginRight: '1rem', marginTop: '4.5rem' }}>
                                {/* Seller Details */}
                                <Typography variant="h5" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Seller/Renter Details</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-user"></i> Name</Typography>
                                <Typography>{rental.sellerName}</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-location-dot"></i> Location</Typography>
                                <Typography>{rental.Location}</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-phone"></i> Contact No</Typography>
                                <Typography>{rental.telephone}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ marginTop: '0.5rem' }}>
                <Grid item>
                    <Button variant="contained" component={Link} to="/p/rentals" startIcon={<ChevronLeftIcon />}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}