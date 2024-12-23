import {
  Grid,
  Typography,
  Button,
  Container,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  useTheme,
  CircularProgress,
  Box,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { productFilters } from "../../components/menuLists";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { fetchSelectedProduct } from "../../api/db/products";
import DbError from "../../components/DbError/DbError";
import { fetchMerchantDetails } from "../../api/db/users";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Filters from "../../components/Filters/Filters";
import Details from "../../components/Details/Details";
import { fetchFilters } from "../../api/db/items";
import Reviews from "../../components/Reviews/Reviews";

function Products() {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Filters itemList={productFilters} page={"products"} />
      <Grid item xs={12} sm={12} md={9} lg={9}>
        <ProductsContents />
      </Grid>
    </Grid>
  );
}

export default Products;
const ProductsContents = () => {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalList = await fetchFilters("products", search);
        setProducts(rentalList);
      } catch (e) {
        console.error(e);
        setProducts([]);
      }
    };
    fetchData();
  }, [search]);

  const handleCardClick = (pid) => {
    navigate(`/p/product/${pid}`);
  };
  return (
    <Container maxWidth="xl">
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={24}>
        {!products ? (
          <DbError items={9} />
        ) : products.length === 0 ? (
          <DbError items={9} />
        ) : (
          products.map((product, index) => (
            <Grid item xs={24} sm={12} md={12} lg={8} key={index}>
              <Card
                sx={{
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  position: "relative",
                  height: isMobile ? "18rem" : isTablet ? "22rem" : "24rem",
                  width: "100%",
                }}
              >
                <CardActionArea onClick={() => handleCardClick(product.pid)}>
                  <CardMedia
                    sx={{
                      height: isMobile ? "14rem" : isTablet ? "18rem" : "20rem",
                      objectFit: "cover",
                    }}
                    image={
                      product.images[0] || "https://picsum.photos/id/11/200/300"
                    }
                    title={product.name}
                  />
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      gutterBottom
                      variant={isMobile ? "subtitle1" : "h6"}
                      component="div"
                      color="inherit"
                    >
                      {product.title}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ position: "absolute", top: "2px", left: "5px" }}
                  >
                    {product.status === "For Sale" ? (
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        For Sale
                      </Button>
                    ) : product.status === "For Rent" ? (
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "darkorange",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        For Rent
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Sold Out!
                      </Button>
                    )}
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export function ProductPage({ setSignin, setSignup }) {
  const [product, setProduct] = React.useState(null);
  const [merchant, setMerchant] = React.useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0); // Track the index of the selected image
  // const [0, setStartIndex] = React.useState(0);
  const visibleImagesCount = 3; // Number of images to display at a time
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await fetchSelectedProduct(id);
        setProduct(productData);
        const merchantData = await fetchMerchantDetails(product.merchantId);
        setMerchant(merchantData);
        setSelectedImageIndex(0);
      } catch (error) {}
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <CircularProgress />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* Main Product Image */}
          <Card
            sx={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <CardMedia
              component="img"
              image={product.images[selectedImageIndex]} // Display the selected image as the main product image
              alt={product.name}
              sx={{
                borderRadius: "0px",
                width: "100%",
                height: { xs: "340px", sm: "570px", md: "430px", lg: "470px" },
                minHeight: "340px",
                objectFit: "cover",
              }}
            />
          </Card>

          {/* Small Images Grid */}
          <Grid
            container
            spacing={2}
            sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
          >
            {/* <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={handlePrevious}
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                <ArrowBackIosIcon />
              </IconButton>
            </Grid> */}

            {product.images
              .slice(0, 0 + visibleImagesCount)
              .map((image, index) => (
                <Grid item xs={3} key={index}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`image ${index}`}
                    sx={{
                      width: "100%",
                      // height: isMobile ? '70px' : '100px',
                      height: {
                        xs: "70px",
                        sm: "120px",
                        md: "100px",
                        lg: "130px",
                      },
                      borderRadius: "8px",
                      objectFit: "cover",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      transition: "transform 0.3s",
                      border:
                        selectedImageIndex === index + 0
                          ? "3px solid blue"
                          : "none", // Highlight the selected image
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                    onClick={() => setSelectedImageIndex(index + 0)} // Update the main image on click
                  />
                </Grid>
              ))}

            {/* <Grid item xs={1} sm={1} md={1} lg={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={handleNext}
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <CardContent sx={{ my: "30px" }}>
              {/* Product Details */}
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: isMobile ? "1.4rem" : "1.8rem",
                }}
              >
                {product.title}
              </Typography>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                component="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Category: {product.category}
              </Typography>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                component="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Sub category: {product.subCategory}
              </Typography>
              <Typography
                sx={{ textAlign: "center", fontStyle: "italic" }}
                gutterBottom
              >
                {product.status === "For Sale" ? (
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ color: "#50C878", fontWeight: "bold" }}
                  >
                    For Sale
                  </Typography>
                ) : product.status === "For Rent" ? (
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ color: "darkorange", fontWeight: "bold" }}
                  >
                    For Rent
                  </Typography>
                ) : (
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    Sold Out!
                  </Typography>
                )}
              </Typography>

              <Box
                sx={{
                  mx: { xs: "1rem", sm: "4rem", md: "3rem", lg: "3rem" },
                  my: { xs: "0.5rem", sm: "0.7rem", md: "1rem", lg: "1.5rem" },
                }} /*sx={{ mt: { xs: 2, sm: 3 } }}*/
              >
                {/* <Typography variant={isMobile ? 'h6' : 'h5'} component="h4" sx={{ fontWeight: 'bold' }} gutterBottom>Description</Typography> */}
                <ul style={{ textAlign: "justify", fontSize: "18px" }}>
                  {product.description.map((item, index) => (
                    <li key={index}>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        component="h4"
                      >
                        {item}
                      </Typography>
                    </li>
                  ))}
                  <li>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      component="h4"
                    >
                      Quantity: {product.quantity}
                    </Typography>
                  </li>
                  {/* <li>Location: {product.location}</li> */}
                </ul>
              </Box>
              <Box sx={{ mx: "1rem", mt: "2.5rem" }}>
                {/* Seller Details */}
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  component="h3"
                  sx={{ textAlign: "center", fontWeight: "bold", mb: "1rem" }}
                >
                  Seller/Renter Details
                </Typography>
              </Box>
              <Details
                itemImage={product.images[0]}
                setSignin={setSignin}
                setSignup={setSignup}
                itemType={"products"}
                itemId={product.pid}
                itemTitle={product.title}
                merchantId={product.merchantId}
              />
              <Reviews itemId={product.pid} itemType={'products'}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mt: "0.5rem" }}>
        <Grid item>
          <Button
            variant="contained"
            component={Link}
            to="/p/products"
            startIcon={<ChevronLeftIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontWeight: "bold",
              backgroundColor: "#018ABD",
              color: "white",
              "&:hover": {
                backgroundColor: "#004581",
              },
            }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
