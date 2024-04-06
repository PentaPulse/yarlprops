import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import styles from './ProductPage.module.css';
import { products } from '../Data/productData';


const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const selectedProduct = products.find((p) => p.id === parseInt(id));
    setProduct(selectedProduct);
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.productPageContainer}>
      <Container fluid>
        <Row>
          <Col xs={10} md={5} className={styles.productImageSection}>
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
              <h4 style={{ textAlign: 'center', fontStyle: 'italic'}}>Category : {product.category}</h4><br/>
              <div style={{marginLeft: '0.6rem', marginRight: '0rem'}}>
                <h4>Description</h4>
                <ul>
                  <li>{product.descriptionLine1}</li> 
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
              <h4><i class="fa-solid fa-user"></i> Name</h4>
              <p>{product.sellerName}</p>
              <h4><i class="fa-solid fa-location-dot"></i> Location</h4>
              <p>{product.Location}</p>
              <h4><i class="fa-solid fa-phone"></i> Contact No</h4>
              <p>{product.telephone}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
              <Link to="/" className="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Back</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;
