import { Radio, FormControlLabel, Grid, TextField, Typography, Slider, Paper, Divider, FormControl, FormLabel, RadioGroup, Button, capitalize, Container, Card, CardActionArea, CardMedia, CardContent, CardActions, useTheme, CircularProgress, IconButton, Box, useMediaQuery } from '@mui/material';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      <Container maxWidth = "lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={3}>
                <Paper
                    sx={{
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: 3,
                        marginBottom: isMobile ? '1rem' : 0
                    }}
                >
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Categories</FormLabel>
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

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Sub Categories</FormLabel>
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
            <Grid item xs={12} md={9}>
                <ProductsContents
                    category={category}
                    subCategory={subCategory}
                    priceRange={priceRange}
                    quantity={quantity}
                />
            </Grid>
        </Grid>
      </Container>
        
    );
}

export default Products;
const ProductsContents = ({ category, subCategory, price, quantity }) => {
    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();
    const [search]=useSearchParams()
    const searchTerm=search.get('search')
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchTerm || category || subCategory ) {
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
        
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {!products ? <DbError items={9} /> : products.length === 0 ?
                    <DbError items={9} />
                    :
                    products.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ 
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                              '&:hover':{
                                  boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2',
                              },
                            }}>

                                <CardActionArea onClick={() => handleCardClick(product.pid)}>
                                    <CardMedia
                                        component="img"
                                        height={isMobile ? "140" : "200"}
                                        image={product.images[0] || 'https://picsum.photos/id/11/200/300'}
                                        title={product.name}

                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant={isMobile ? 'h6' : 'h5'} component="div">
                                            {product.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        {product.description.slice(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                                      <Button 
                                          size="small"
                                          sx={{
                                            backgroundColor:
                                                product.status === "For Sale" ? "green" :
                                                product.status === "For Rent" ? "darkorange" : "red",
                                            color: 'white',
                                            fontWeight: 'bold',
                                            '&hover':{
                                              ackgroundColor: 
                                                  product.status === "For Sale" ? "darkgreen" : 
                                                  product.status === "For Rent" ? "orange" : "darkred",
                                            }

                                          }}
                                      >
                                        {product.status}
                                      </Button>
                                      <Typography variant="h6" color="primary">
                                        ${product.price}/month
                                      </Typography>
                                </CardActions>
                                
                            </Card>
                        </Grid>
                    ))}
        </Grid>
        
    );
};

export function ProductPage() {
    const [product, setProduct] = React.useState(null);
    const [merchant, setMerchant] = React.useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0); // Track the index of the selected image
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
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
      <Container maxWidth = "lg" sx={{py:4}}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Main Product Image */}
            <Card>
              <CardMedia
                component="img"
                image={product.images[selectedImageIndex]}  // Display the selected image as the main product image
                alt={product.name}
                sx={{ 
                      width: '100%', 
                      height: isMobile ? '300px' : '400px',
                      objectFit: 'cover'
                    }}
              />
            </Card>
  
            {/* Small Images Grid */}
            <Grid container spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
              <Grid item>
                <IconButton onClick={handlePrevious} size={isMobile ? "small" : "medium"}>
                  <ArrowBackIosIcon />
                </IconButton>
              </Grid>
  
              {product.images.map((image, index) => (
                <Grid item xs={2} key={index}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`image ${index}`}
                    sx={{
                      width: '100%',
                      height: isMobile ? '50px' : '80px',
                      objectFit: 'cover',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? '2px solid blue' : 'none', // Highlight the selected image
                    }}
                    onClick={() => setSelectedImageIndex(index)}  // Update the main image on click
                  />
                </Grid>
              ))}
  
              <Grid item>
                <IconButton onClick={handleNext} size={isMobile ? "small" : "medium"}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
  
          <Grid item xs={12} md={6}>
                    <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
                        {product.title}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                        ${product.price}/month
                    </Typography>
                    <Box sx={{ 
                        display: 'inline-block',
                        px: 2,
                        py: 1,
                        bgcolor: 
                            product.status === "For Sale" ? "green" : 
                            product.status === "For Rent" ? "darkorange" : "red",
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        mb: 2
                    }}>
                        {product.status}
                    </Box>
                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>Details:</Typography>
                    <Typography>Category: {product.category}</Typography>
                    <Typography>Sub-category: {product.subCategory}</Typography>
                    <Typography>Quantity: {product.quantity}</Typography>
                    <Typography>Location: {product.location}</Typography>
                    
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Seller/Renter Details:</Typography>
                        {merchant && (
                            <>
                                <Typography><strong>Name:</strong> {merchant.firstName} {merchant.lastName}</Typography>
                                <Typography><strong>Contact:</strong> {merchant.phoneNumber}</Typography>
                            </>
                        )}
                    </Box>
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        fullWidth={isMobile}
                        sx={{ mt: 4 }}
                    >
                        Contact Seller
                    </Button>
                </Grid>
        </Grid>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" component={Link} to="/p/products" startIcon={<ChevronLeftIcon />}>
            Back to Products
            </Button>
          </Box>
            
       
      </Container>
    );
  }