import { Radio, FormControlLabel, Grid, TextField, Typography, Slider, Paper, Divider, FormControl, FormLabel, RadioGroup, Button, capitalize, Container, Card, CardActionArea, CardMedia, CardContent, CardActions, useTheme, CircularProgress, IconButton, Box } from '@mui/material';
import * as React from 'react';
import { productFilters } from '../../components/menuLists';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { fetchProducts, fetchSelectedProduct } from '../../api/db/products';
import DbError from '../../components/DbError/DbError';
import { fetchMerchantProductDetails } from '../../api/db/users';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Products() {
    const [category, setCategory] = React.useState(null)
    const [subCategory, setSubCategory] = React.useState(null)
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [quantity, setQuantity] = React.useState(1);
    const {cat}=useParams()
    React.useEffect(()=>{
        if(cat){
            setCategory(cat)
        }
    },[cat])
    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setSubCategory(null)
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
                            {Object.keys(productFilters["categories"]).map((category) => (
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
                                {productFilters["categories"][category]?.map((subCategoryegory) => (
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
                <ProductsContents
                    category={category}
                    subCategory={subCategory}
                    priceRange={priceRange}
                    quantity={quantity}
                />
            </Grid>
        </Grid>
    );
}

export default Products;
const ProductsContents = ({ category, subCategory, price, quantity }) => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();
    const [search]=useSearchParams()
    const searchTerm=search.get('search')

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchTerm || category || subCategory || price || quantity) {
                    let q;
                    const productRef = collection(db, 'products')
                    if (searchTerm !== null) {
                        q = query(productRef, where('title', '>=', capitalize(searchTerm)), where('title', '<=', capitalize(searchTerm) + '\uf8ff'));
                    }
                    if (category !== null) {
                        q = query(productRef, where('category', '==', category))
                    }
                    if (subCategory !== null) {
                        q = query(productRef, where('subCategory', '==', subCategory))
                    }/*
                if (price) {
                    q = query(productRef, where('category', '==', price))
                }
                if (quantity) {
                    q = query(productRef, where('category', '==', quantity))
                }*/
                    const querySnapshot = await getDocs(q);
                    const items = querySnapshot.docs.map(doc => doc.data());
                    setProducts(items);

                } else {
                    const productList = await fetchProducts();
                    setProducts(productList);
                }
            } catch (e) {
                setProducts([])
            }
        };

        fetchData()
    }, [searchTerm, category, subCategory, price, quantity]);

    const handleCardClick = (pid) => {
        navigate(`/p/product/${pid}`);
    };
    return (
        <Container fixed>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {!products ? <DbError items={9} /> : products.length === 0 ?
                    <DbError items={9} />
                    :
                    products.map((product, index) => (
                        <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'relative' }}>

                                <CardActionArea onClick={() => handleCardClick(product.pid)}>
                                    <CardMedia
                                        sx={{ height: '20rem' }}
                                        image={product.images[0] || 'https://picsum.photos/id/11/200/300'}
                                        title={product.name}

                                    />
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography gutterBottom variant='h6' component='div' color='inherit'>
                                            {product.title}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ position: 'absolute', top: '2px', left: '5px' }}>
                                        {(product.status === "For Sale") ? (<Button size='small' style={{ backgroundColor: "green", color: 'white', fontWeight: 'bold' }}>For Sale</Button>) : ((product.status === "For Rent") ? (<Button size='small' style={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold' }}>For Rent</Button>) : ((<Button size='small' style={{ backgroundColor: "red", color: 'white', fontWeight: 'bold' }}>Sold Out!</Button>)))}
                                    </CardActions>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export function ProductPage() {
    const [product, setProduct] = React.useState(null);
    const [merchant, setMerchant] = React.useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0); // Track the index of the selected image
    const { id } = useParams();
    const theme = useTheme();
  
    React.useEffect(() => {
      const fetchProduct = async () => {
        try {
          const productData = await fetchSelectedProduct(id);
          setProduct(productData);
          setSelectedImageIndex(0); // Start with the first image
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
      
      const fetchMerchant = async ()=>{
        try{
          const merchantData = await fetchMerchantProductDetails(id);
          setMerchant(merchantData)
        }catch(error){
          console.error("Error fetching merchant:", error);
        }
      }
  
      fetchMerchant();
    }, [id]);
  
    if (!product) {
      return <CircularProgress />;
    }
  
    const handlePrevious = () => {
      setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.images.length - 1));
    };
  
    const handleNext = () => {
      setSelectedImageIndex((prevIndex) => (prevIndex < product.images.length - 1 ? prevIndex + 1 : 0));
    };
  
    return (
      <Container sx={{ backgroundColor: theme.palette.background.default }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Main Product Image */}
            <Card sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              <CardMedia
                component="img"
                image={product.images[selectedImageIndex]}  // Display the selected image as the main product image
                alt={product.name}
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
  
              {product.images.map((image, index) => (
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
                {/* Product Details */}
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{product.title}</Typography>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                  Category: {product.category}
                </Typography>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                  Sub category: {product.subCategory}
                </Typography>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic' }}>
                  {(product.status === "For Sale") ?
                    (<Box sx={{ backgroundColor: "green", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>For Sale</Box>)
                    : ((product.status === "For Rent") ?
                      (<Box sx={{ backgroundColor: "darkorange", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>For Rent</Box>)
                      : (<Box sx={{ backgroundColor: "red", color: 'white', fontWeight: 'bold', mx: '11rem', borderRadius: '20px' }}>Sold Out!</Box>))}
                </Typography>
  
                <Box sx={{ mx: '1.9rem', mt: '1rem' }}>
                  <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>Description</Typography>
                  <ul style={{ textAlign: 'justify', fontSize: '18px' }}>
                    <li>{product.description}</li>
                    <li>Quantity: {product.quantity}</li>
                    <li>Location: {product.location}</li>
                  </ul>
                </Box>
                <Box sx={{ marginLeft: '1rem', marginRight: '1rem', marginTop: '4.5rem' }}>
                  {/* Seller Details */}
                  <Typography variant="h5" component="h3" sx={{ textAlign: 'center', fontWeight: 'bold', mb: '1rem' }}>Seller/Renter Details</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-user"></i> Name</Typography>
                  <Typography>{merchant && merchant.firstName + ' ' + merchant.lastName}</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-location-dot"></i> Location</Typography>
                  <Typography>{product.location}</Typography>
                  <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}><i className="fa-solid fa-phone"></i> Contact No</Typography>
                  <Typography>{merchant && merchant.phoneNumber}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={0} sx={{ marginTop: '0.5rem' }}>
          <Grid item>
            <Button variant="contained" component={Link} to="/p/products" startIcon={<ChevronLeftIcon />}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }