import { Box, Button, capitalize, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Slider, TextField, Typography, useMediaQuery } from '@mui/material';
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
import { fetchSelectedRental } from '../../api/db/rentals';
import Filters from '../../components/Filters/Filters';

export default function Rentals() {
    return (
        <Grid container spacing={3} justifyContent="center">
            <Filters itemList={rentalFilters} page={'rentals'}/>
            <Grid item xs={12} sm={12} md={9} lg={9}>
                <RentalsContents />
            </Grid>
        </Grid>
    );
}

function RentalsContents() {
    const [rentals, setRentals] = React.useState([]);
    const navigate = useNavigate();
    const [search] = useSearchParams()
    const searchTerm = search.get('search')
    const category = search.get('category')
    const subCategory = search.get('subcategory');
    const price = search.get('price')
    const quantity = search.get('quantity')
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchTerm || category || subCategory) {
                    let q;
                    const rentalRef = collection(db, 'rentals')
                    if (searchTerm !== null) {
                        q = query(rentalRef, where('title', '>=', capitalize(searchTerm)), where('title', '<=', capitalize(searchTerm) + '\uf8ff'));
                    }
                    if (category !== null) {
                        q = query(rentalRef, where('category', '==', category))
                    }
                    if (subCategory !== null) {
                        q = query(rentalRef, where('subCategory', '==', subCategory))
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
    }, [searchTerm, category, subCategory, price, quantity]);

    const handleCardClick = (rid) => {
        navigate(`/p/rental/${rid}`);
    };
    return (
        <Container maxWidth="xl">
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={24}>
                {!rentals ? <DbError items={9} /> : rentals.length === 0 ?
                    <DbError items={9} />
                    :
                    rentals.map((rental, index) => (
                        <Grid item xs={24} sm={12} md={12} lg={8} key={index}>
                            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                                <CardActionArea onClick={() => handleCardClick(rental.rid)}>
                                    <CardMedia
                                        sx={{ height: isMobile ? '15rem' : isTablet ? '18rem' : '20rem' }}
                                        image={rental.images[0] || 'https://picsum.photos/id/11/200/300'}
                                        title={rental.name}
                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant={isMobile ? 'subtitle1' : 'h6'} component='div' color='inherit'>
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
    const [startIndex, setStartIndex] = React.useState(0); 
    const visibleImagesCount = 3; // Number of images to display at a time
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    //const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


    React.useEffect(() => {
        const fetchrental = async () => {
            try {
                const rentalData = await fetchSelectedRental(id)
                setRental(rentalData);
                setSelectedImageIndex(0);
            } catch (error) {
                //console.error("Error fetching rental:", error);
            }
        };

        fetchrental();
    }, [id]);

    if (!rental) {
        return <CircularProgress />;
    }

    // const handlePrevious = () => {
    //     setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : rental.images.length - 1));

    //     if(selectedImageIndex === visibleImageRange[0]){
    //         setVisibleImageRange((prevRange) => [
    //             prevRange[0] - 1 < 0 ? rental.images.length- 3 : prevRange[0] - 1,
    //             prevRange[1] - 1 < 0 ? rental.images.length- 2 : prevRange[1] - 1,

    //         ]);
    //     }
    // };

    // const handleNext = () => {
    //     setSelectedImageIndex((prevIndex) => (prevIndex < rental.images.length - 1 ? prevIndex + 1 : 0));

    //     if(selectedImageIndex === visibleImageRange[1] - 1){
    //         setVisibleImageRange((prevRange) => [
    //             prevRange[0] + 1 >= rental.images.length ? 0 : prevRange[0] + 1,
    //             prevRange[1] + 1 >= rental.images.length ? 3 : prevRange[1] + 1,

    //         ]);
    //     }
    // };

    const handlePrevious = () => {
        if(startIndex > 0){
          setStartIndex(startIndex - 1);
          setSelectedImageIndex(startIndex - 1);
        } else {
          setStartIndex(rental.images.length - visibleImagesCount);
          setSelectedImageIndex(rental.images.length - 1);
        }
    };
    
    const handleNext = () => {
        if(startIndex + visibleImagesCount < rental.images.length){
          setStartIndex(startIndex + 1);
          setSelectedImageIndex(startIndex + 1);
        } else {
          setStartIndex(0);
          setSelectedImageIndex(0);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ backgroundColor: theme.palette.background.default }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {/* Main rental Image */}
                    <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardMedia
                            component="img"
                            image={rental.images[selectedImageIndex]}  // Display the selected image as the main rental image
                            alt={rental.name}
                            sx={{ borderRadius: '0px', width: '100%', height: { xs: '300px', sm:'550px', md: '430px', lg: '445px'}, minHeight:'300px', objectFit: 'cover' }}
                        />
                    </Card>

                    {/* Small Images Grid */}
                    <Grid container spacing={2} sx={{ mt: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton
                                onClick={handlePrevious}>
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
                                        height: { xs: '70px', sm:'120px', md:'100px', lg:'100px'},
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

                        <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton onClick={handleNext}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardContent sx={{ my: '30px' }}>
                            {/* rental Details */}
                            <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>{rental.title}</Typography>
                            <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                Category: {rental.category}
                            </Typography>
                            <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                Type: {rental.type}
                            </Typography>
                            <Typography sx={{ textAlign: 'center', fontStyle: 'italic' }} gutterBottom>
                                {(rental.status === "For Sale") ?
                                    (<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#50C878', fontWeight: 'bold' }}>For Sale</Typography>)
                                    : ((rental.status === "For Rent") ?
                                        (<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: "darkorange", fontWeight: 'bold' }}>For Rent</Typography>)
                                        : (<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: "red", fontWeight: 'bold' }}>Sold Out!</Typography>))}
                            </Typography>

                            <Box
                                sx={{
                                    mx: { xs: '1rem', sm: '4rem', md: '3rem', lg: '3rem' },
                                    my: { xs: '0.5rem', sm: '0.7rem', md: '1rem', lg: '1.5rem' },
                                }}>
                                {/* <Typography variant={isMobile ? 'h6' : 'h5'} component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography> */}
                                <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                                    {rental.description.map((item, index) => (
                                        <li key={index}><Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4">{item}</Typography></li>
                                    ))}
                                    <li><Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4">Quantity: {rental.quantity}</Typography></li>
                                </ul>
                            </Box>
                            <Box sx={{ mx: '1rem', mt: '2.5rem' }}>
                                {/* Seller Details */}
                                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Seller/Renter Details</Typography>
                                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }}><i className="fa-solid fa-user"></i> Name : {rental.sellerName}</Typography>
                                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }}><i className="fa-solid fa-location-dot"></i> Location : {rental.Location}</Typography>
                                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center' }}><i className="fa-solid fa-phone"></i> Contact No : {rental.telephone}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mt: '0.5rem' }}>
                <Grid item>
                    <Button
                        variant="contained"
                        component={Link}
                        to="/p/rentals"
                        startIcon={<ChevronLeftIcon />}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            backgroundColor: '#0d6efd',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#90caf9',
                            }
                        }}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

{/* 
    <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              <CardContent sx={{ marginTop: '30px', marginBottom: '30px' }}>
                <Typography variant={isMobile ? 'h5' : 'h3'} component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>{product.title}</Typography>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                  Category: {product.category}
                </Typography>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }} gutterBottom>
                  Sub category: {product.subCategory}
                </Typography>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                  {(product.status === "For Sale") ?
                    (<Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#50C878', fontWeight: 'bold' }}>For Sale</Typography>)
                    : ((product.status === "For Rent") ?
                      (<Typography variant="h5" sx={{ color: "darkorange", fontWeight: 'bold' }}>For Rent</Typography>)
                      : (<Typography variant="h5" sx={{ color: "red", fontWeight: 'bold' }}>Sold Out!</Typography>))}
                </Typography>
  
                <Box 
                  sx={{ 
                    mx: { xs: '1rem', sm:'2rem', md:'3rem', lg:'3rem'},
                    my: { xs: '0.5rem', sm:'0.7rem', md:'1rem', lg:'1rem'},
                  }}
                  <ul style={{ textAlign: 'justify', fontSize: '18px' }}>

                    {product.description.map((item, index) => (
                      <li key={index}><Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4">{item}</Typography></li>
                    ))}
                    <li><Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4">Quantity: {product.quantity}</Typography></li>
                  </ul>
                </Box>
                <Box sx={{ mx: '1rem', mt: '4.5rem' }}>
                  <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Seller/Renter Details</Typography>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center'}} gutterBottom><i className="fa-solid fa-user"></i> Name : {merchant && merchant.firstName + ' ' + merchant.lastName}</Typography>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center'}} gutterBottom><i className="fa-solid fa-location-dot"></i> Location : {product.location}</Typography>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ textAlign: 'center'}}><i className="fa-solid fa-phone"></i> Contact No : {merchant && merchant.phoneNumber}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid> 
*/}