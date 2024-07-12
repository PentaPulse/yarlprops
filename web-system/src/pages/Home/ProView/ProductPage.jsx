import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, useTheme, Box } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { fetchSelectedProduct } from '../../../backend/db/products';
import styles from './ProductPage.module.css';

function ProductPage() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const theme = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await fetchSelectedProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <CircularProgress />;
  }

  return (
    <div className={styles.productPageContainer}>
      <Container sx={{ backgroundColor: theme.palette.background.default }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} className={styles.productImageSection}>
            {/* Product Image */}
            <Card>
              <CardMedia
                component="img"
                image={product.images}
                alt={product.name}
                sx={{ height: '50vh', borderRadius: '10px', paddingBottom: '20px' }}
              />
              {/* Small Image Slide Show */}
              <Carousel>
                {product.images.map((image, index) => (
                  <Box key={index}>
                    <CardMedia
                      component="img"
                      image={image}
                      alt={`slide ${index}`}
                      sx={{ height: '35vh', borderRadius: '10px' }}
                    />
                  </Box>
                ))}
              </Carousel>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={styles.productDetailsSection}>
              <CardContent>
                {/* Product Details */}
                <Typography variant="h4" component="h2" className={styles.productDetailsSectionH2}>{product.title}</Typography>
                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  Category: {product.category}
                </Typography>
                <Typography variant="h6" component="h4" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  Type: {product.type}
                </Typography>
                <Box sx={{ marginLeft: '0.6rem', marginRight: '0rem' }}>
                  <Typography variant="h6" component="h4">Description</Typography>
                  <ul className={styles.productDetailsSectionUl}>
                    <li>{product.description}</li>
                    <li>Quantity: {product.quantity}</li>
                    <li>Product Location: {product.location}</li>
                  </ul>
                </Box>
                <Box className={styles.sellerDetailsSection} sx={{ marginTop: '2rem' }}>
                  {/* Seller Details */}
                  <Typography variant="h5" component="h3" className={styles.sellerDetailsSectionH3}>Seller/Renter Details</Typography>
                  <Typography variant="h6" component="h4"><i className="fa-solid fa-user"></i> Name</Typography>
                  <Typography>{product.sellerName}</Typography>
                  <Typography variant="h6" component="h4"><i className="fa-solid fa-location-dot"></i> Location</Typography>
                  <Typography>{product.Location}</Typography>
                  <Typography variant="h6" component="h4"><i className="fa-solid fa-phone"></i> Contact No</Typography>
                  <Typography>{product.telephone}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ marginTop: '2rem' }}>
          <Grid item>
            <Button variant="contained" component={Link} to="/products" startIcon={<i className="fa-solid fa-arrow-left"></i>}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default ProductPage;


// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { Row, Col, Image, Carousel } from 'react-bootstrap';
// import { Container } from '@mui/material'
// import styles from './ProductPage.module.css';
// import { useTheme } from '@mui/material/styles';
// import { fetchSelectedProduct } from '../../../backend/db/products';


// function ProductPage() {
//   const [product, setProduct] = useState([]);
//   const { id } = useParams();
//   const theme = useTheme();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const productData = await fetchSelectedProduct(id);
//         setProduct(productData);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   console.log(product.name);

//   return (
//     <div className={styles.productPageContainer}>
//       <Container sx={{ backgroundColor: theme.palette.blackground }}>
//         <Row>
//           <Col xs={11} md={5} lg={5} className={styles.productImageSection}>
//             {/* Product Image */}

//             <Image style={{ width: '70vw', height: '50vh', borderRadius: '10px', paddingBottom: '20px' }} src={product.images} fluid />

//             {/* Small Image Slide Show */}

//             <Carousel>
//               <Carousel.Item>
//                 <img
//                   style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}/*Changed to viewport height & Width*/
//                   className="d-block w-100"
//                   src={'products.images[0]'}
//                   alt="First slide"
//                 />
//               </Carousel.Item>
//               <Carousel.Item>
//                 <img
//                   style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}
//                   className="d-block w-100"
//                   src={product.images}
//                   alt="Second slide"
//                 />
//               </Carousel.Item>
//               <Carousel.Item>
//                 <img
//                   style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}
//                   className="d-block w-100"
//                   src={product.images3}
//                   alt="Third slide"
//                 />
//               </Carousel.Item>
//             </Carousel>
//           </Col>
//           <Col xs={12} md={6} lg={6}>
//             <div className={styles.productDetailsSection}>
//               {/* Product Details */}
//               <h2>{product.title}</h2>
//               <h4 style={{ textAlign: 'center', fontStyle: 'italic' }}>Category : {product.category}</h4>
//               <h4 style={{ textAlign: 'center', fontStyle: 'italic' }}>Type : {product.type}</h4><br />
//               <div style={{ marginLeft: '0.6rem', marginRight: '0rem' }}>
//                 <h4>Description</h4>
//                 <ul>
//                   <li>{product.description}</li>
//                   <li>Quantity: {product.quantity}</li>
//                   <li>Product Location: {product.location}</li>
//                 </ul>
//               </div>
//             </div>
//             <div className={styles.sellerDetailsSection}>
//               {/* Seller Details */}
//               <h3>Seller/Renter Details</h3>
//               <h4><i className="fa-solid fa-user"></i> Name</h4>
//               <p>{product.sellerName}</p>
//               <h4><i className="fa-solid fa-location-dot"></i> Location</h4>
//               <p>{product.Location}</p>
//               <h4><i className="fa-solid fa-phone"></i> Contact No</h4>
//               <p>{product.telephone}</p>
//             </div>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <Link to="/products" className="btn btn-primary"><i className="fa-solid fa-arrow-left"></i> Back</Link>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default ProductPage;
