import { Box, Button,  Card, CardActionArea, CardContent, CardMedia, CircularProgress, Container, Grid, Typography, useMediaQuery } from '@mui/material';
import * as React from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DbError from '../../components/DbError/DbError';
import { useTheme } from '@emotion/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { fetchSelectedService } from '../../api/db/services';
import Carousel from 'react-material-ui-carousel';
//import { fetchMerchantServiceDetails } from '../../api/db/users';
import { serviceFilters } from '../../components/menuLists';
import Filters from '../../components/Filters/Filters';
import Details from '../../components/Details/Details';
import { fetchProductReviews } from '../../api/db/feedback';
import { fetchFilters } from '../../api/db/items';


export default function Services() {

    return (
        <Grid container spacing={3} justifyContent="center">
            <Filters itemList={serviceFilters} page={'services'} />
            <Grid item xs={12} sm={12} md={9} lg={9}>
                <ServicesContents />
            </Grid>
        </Grid>
    );
}

function ServicesContents() {
    const [services, setServices] = React.useState([]);
    const navigate = useNavigate();
    const [search] = useSearchParams()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const serviceList = await fetchFilters("services", search);
                setServices(serviceList);
            } catch (e) {
                setServices([])
            }
        };
        fetchData()
    }, [search]);

    const handleCardClick = (sid) => {
        navigate(`/p/service/${sid}`);
    };
    return (
        <Container maxWidth="xl">
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={24}>
                {!services ? <DbError items={9} /> : services.length === 0 ?
                    <DbError items={9} />
                    :
                    services.map((service, index) => (
                        <Grid item xs={24} sm={12} md={12} lg={8} key={index}>
                            <Card sx={{
                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                position: 'relative',
                                height: isMobile ? '18rem' : isTablet ? '22rem' : '24rem',
                                width: '100%'
                            }}>
                                <CardActionArea onClick={() => handleCardClick(service.id)}>
                                    <CardMedia
                                        sx={{ height: isMobile ? '14rem' : isTablet ? '18rem' : '20rem', objectFit: 'cover' }}
                                        image={service.images && service.images[0] ? service.images[0] : 'https://picsum.photos/id/11/200/300'}
                                        title={service.title}
                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant={isMobile ? 'subtitle1' : 'h6'} component='div' color='inherit'>
                                            {service.title}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export function ServicePage({ setSignin, setSignup }) {
    const [service, setService] = React.useState(null);
    //const [merchant, setMerchant] = React.useState(null)
    const [reviews, setReviews] = React.useState([]); // Store product reviews
    const [averageRating, setAverageRating] = React.useState(0);
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(() => {
        const fetchService = async () => {
            try {
                const serviceData = await fetchSelectedService(id);
                setService(serviceData);


                const reviewsData = await fetchProductReviews(id, 'pservices');
                setReviews(reviewsData);

                const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(reviewsData.length ? totalRating / reviewsData.length : 0);
            } catch (error) {
                //console.error("Error fetching service:", error);
            }
        };

        fetchService();
        // const fetchMerchant = async () => {
        //     try {
        //         const merchantData = await fetchMerchantServiceDetails(id);
        //         setMerchant(merchantData)
        //     } catch (error) {
        //         //console.error("Error fetching merchant:", error);
        //     }
        // }

        // fetchMerchant();
    }, [id]);

    if (!service) {
        return <CircularProgress />;
    }

    return (
        <Container sx={{ backgroundColor: theme.palette.background.default }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {/* Service Image */}
                    <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        {/* <CardMedia
                  component="img"
                  image={service.images[0]}
                  alt={service.name}
                  sx={{ height: '52vh', borderRadius: '0px'}}
                /> */}
                        {/* Small Image Slide Show */}
                        <Carousel>
                            {service.images.map((image, index) => (
                                <Box key={index}>
                                    <CardMedia
                                        component="img"
                                        image={image}
                                        alt={`slide ${index}`}
                                        sx={{
                                            height: { xs: '350px', sm: '470px', md: '500px', lg: '600px' },
                                            minHeight: '350px',
                                            width: '100%',
                                            borderRadius: '25px',
                                            p: '15px'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Carousel>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                        }}>
                        <CardContent sx={{ my: '30px' }}>
                            {/* Service Details */}
                            <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: isMobile ? '1.4rem' : '1.8rem' }} gutterBottom>{service.title}</Typography>
                            <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                                Category: {service.category}
                            </Typography>
                            <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }} gutterBottom>
                                Sub Category: {service.subCategory}
                            </Typography>
                            <Box sx={{
                                mx: { xs: '1rem', sm: '5rem', md: '3.5rem', lg: '3rem' },
                                my: { xs: '0.5rem', sm: '0.7rem', md: '1rem', lg: '1.5rem' },
                            }}>
                                {/* <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography> */}
                                <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                                    {service.description.map((description, index) => (
                                        <li key={index}><Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h4">{description}</Typography></li>
                                    ))}
                                </ul>
                            </Box>
                            <Box sx={{ mx: '1rem', mt: '2.5rem' }}>
                                {/* Seller Details */}
                                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Seller/Renter Details</Typography>
                            </Box>
                            <Details itemImage={service.images[0]} setSignin={setSignin} setSignup={setSignup} itemType={'services'} itemId={service.sid} itemTitle={service.title} merchantId={service.merchantId} />
                            <Box sx={{ my: 3 }}>
                                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Reviews Summary</Typography>
                                {reviews.length > 0 ? (
                                    <>
                                        <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                                            Average Rating: {averageRating.toFixed(1)} / 5
                                        </Typography>
                                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                            Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}.
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
                                        No reviews yet. Be the first to leave a review!
                                    </Typography>
                                )}
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
                        to="/p/services"
                        startIcon={<ChevronLeftIcon />}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#018ABD',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#004581',
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
