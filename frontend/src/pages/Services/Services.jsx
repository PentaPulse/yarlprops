import { Box, Button, Card, CardActionArea,  CardContent, CardMedia, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid,  Paper, Radio, RadioGroup, Slider, TextField, Typography } from '@mui/material';
import { collection,  getDocs, query, where } from 'firebase/firestore';
import * as React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../api/firebase';
import DbError from '../../components/DbError/DbError';
import { useTheme } from '@emotion/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { fetchSelectedService, fetchServices } from '../../api/db/services';
import Carousel from 'react-material-ui-carousel';
import { fetchMerchantServiceDetails } from '../../api/db/users';
import { serviceFilters } from '../../components/menuLists';

export default function Services() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [cat, setCat] = React.useState(null)
    const [subCat, setSubCat] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCat(value);
    };
    const handleSubCategoryChange = (event) => {
        const value = event.target.value;
        setSubCat(value)
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    const handleClearCategories=()=>{
        setCat(null)
        setSubCat(null)
    }
    const handleClearSubCategories=()=>{
        setSubCat(null)
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
                    <Typography variant="h6" gutterBottom>
                        Search
                    </Typography>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Divider sx={{ my: 2 }} />
                    <FormControl>
                        <FormLabel>Categories</FormLabel>
                        <RadioGroup name='categories' value={cat} onChange={handleCategoryChange}>
                            {Object.keys(serviceFilters["categories"]).map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={<Radio value={category} />}
                                    label={category}
                                />
                            ))}
                        </RadioGroup>
                        {cat && <Button onClick={handleClearCategories}>Clear</Button>}
                    </FormControl>

                    <Divider sx={{ my: 2 }} />

                    <FormControl>
                        <FormLabel>Sub Categories</FormLabel>
                        {cat && (
                            <RadioGroup value={subCat} onChange={handleSubCategoryChange}>
                                {serviceFilters["categories"][cat]?.map((subCategory) => (
                                    <FormControlLabel
                                        key={subCategory}
                                        control={<Radio value={subCategory} />}
                                        label={subCategory}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {subCat && <Button onClick={handleClearSubCategories}>Clear</Button>}
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
                </Paper>
            </Grid>
            <Grid item md={9}>
                <ServicesContents
                    searchTerm={searchTerm}
                    category={cat}
                    subCategory={subCat}
                    priceRange={priceRange}
                />
            </Grid>
        </Grid>
    );
}

function ServicesContents({ searchTerm, category, subCategory, price, quantity }) {
    const [services, setServices] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            if (searchTerm || category || subCategory || price ) {
                let q;
                const serviceRef = collection(db, 'services')
                if (searchTerm !== null) {
                    q = query(serviceRef, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
                }
                if (category !== null) {
                    q = query(serviceRef, where('category', '==', category))
                }
                if (subCategory !== null) {
                    q = query(serviceRef, where('subCategory', '==', subCategory))
                }/*
                if (price) {
                    q = query(serviceRef, where('category', '==', price))
                }
                if (quantity) {
                    q = query(serviceRef, where('category', '==', quantity))
                }*/
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => doc.data());
                setServices(items);

            } else {
                const serviceList = await fetchServices();
                setServices(serviceList );
            }
        };

        fetchData()
    }, [searchTerm, category, subCategory, price, quantity]);

    const handleCardClick = (sid) => {
        navigate(`/p/service/${sid}`);
    };
    return (
        <Container fixed>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {!services ? <DbError items={9} /> : services.length === 0 ?
                    <DbError items={9} />
                    :
                    services.map((service, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(service.id)}>
                                    <CardMedia
                                        sx={{ height: '20rem' }}
                                        image={service.images && service.images[0] ? service.images[0] : 'https://picsum.photos/id/11/200/300'}
                                        title={service.serviceName}
                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant='h6' component='div' color='inherit'>
                                            {service.serviceName}
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

export function ServicePage() {
    const [service, setService] = React.useState(null);
    const [merchant,setMerchant]=React.useState(null)
    const { id } = useParams();
    const theme = useTheme();

    React.useEffect(() => {
        const fetchService = async () => {
            try {
                const serviceData = await fetchSelectedService(id);
                setService(serviceData);
            } catch (error) {
                console.error("Error fetching service:", error);
            }
        };

        fetchService();
        const fetchMerchant = async ()=>{
            try{
              const merchantData = await fetchMerchantServiceDetails(id);
              setMerchant(merchantData)
            }catch(error){
              console.error("Error fetching merchant:", error);
            }
          }
      
          fetchMerchant();
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
                                        sx={{ height: '80vh', borderRadius: '25px', p: '15px' }}
                                    />
                                </Box>
                            ))}
                        </Carousel>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardContent sx={{ my: '30px' }}>
                            {/* Service Details */}
                            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{service.serviceName}</Typography>
                            <Box sx={{ mx: '1.9rem', mt: '1rem' }}>
                                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography>
                                <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                                    {service.serviceDescription.map((description, index) => (
                                        <li key={index}>{description}</li>
                                    ))}
                                    <li>Location: {service.serviceLocation}</li>
                                </ul>
                            </Box>
                            <Box sx={{ mx: '1rem', mt: '4.5rem' }}>
                                {/* Seller Details */}
                                <Typography variant="h5" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Service Provider's Details</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-user"></i> Name</Typography>
                                <Typography>{merchant && merchant.firstName+' '+merchant.lastName}</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-location-dot"></i> Location</Typography>
                                <Typography>{service.serviceLocation}</Typography>
                                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-phone"></i> Contact No</Typography>
                                <Typography>{merchant && merchant.phoneNumber}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={0} sx={{ mt: '0.5rem' }}>
                <Grid item>
                    <Button variant="contained" component={Link} to="/p/services" startIcon={<ChevronLeftIcon />}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}