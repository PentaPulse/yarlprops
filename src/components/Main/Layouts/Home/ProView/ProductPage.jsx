import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, Carousel } from 'react-bootstrap';
import { Container } from '@mui/material'
import styles from './ProductPage.module.css';
import { useTheme } from '@mui/material/styles';
import { fetchSelectedProduct } from '../../../../../backend/db/products';


function ProductPage() {
  const [product, setProduct] = useState([]);
  const { id } = useParams()
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
    return <div>Loading...</div>;
  }

  console.log(product.name)

  return (
    <div className={styles.productPageContainer}>
      <Container sx={{ backgroundColor: theme.palette.blackground }}>
        <Row>
          <Col xs={11} md={5} lg={5} className={styles.productImageSection}>
            {/* Product Image */}

            <Image style={{ width: '70vw', height: '50vh', borderRadius: '10px', paddingBottom: '20px' }} src={product.mainimage} fluid />

            {/* Small Image Slide Show */}

            <Carousel>
              <Carousel.Item>
                <img
                  style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}/*Changed to viewport height & Width*/
                  className="d-block w-100"
                  src={product.image1}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}
                  className="d-block w-100"
                  src={product.image2}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ width: '70vw', height: '35vh', borderRadius: '10px' }}
                  className="d-block w-100"
                  src={product.image3}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div className={styles.productDetailsSection}>
              {/* Product Details */}
              <h2>{product.title}</h2>
              <h4 style={{ textAlign: 'center', fontStyle: 'italic' }}>Category : {product.category}</h4><br />
              <div style={{ marginLeft: '0.6rem', marginRight: '0rem' }}>
                <h4>Description</h4>
                <ul>
                  <li>{product.name}</li>
                  <li>{product.descriptionLine2}</li>
                  <li>{product.descriptionLine3}</li>
                  <li>{product.descriptionLine4}</li>
                  <li>{product.descriptionLine5}</li>
                  <li>{product.descriptionLine6}</li>
                </ul>
              </div>
            </div>
            <div className={styles.sellerDetailsSection}>
              {/* Seller Details */}
              <h3>Seller/Renter Details</h3>
              <h4><i className="fa-solid fa-user"></i> Name</h4>
              <p>{product.sellerName}</p>
              <h4><i className="fa-solid fa-location-dot"></i> Location</h4>
              <p>{product.Location}</p>
              <h4><i className="fa-solid fa-phone"></i> Contact No</h4>
              <p>{product.telephone}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/" className="btn btn-primary"><i className="fa-solid fa-arrow-left"></i> Back</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;
