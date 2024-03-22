import React from 'react';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  return (
    <div className={styles.productPageContainer}>
        <Container>
      <Row>
        <Col md={6} className={styles.productImageSection}>
          {/* Product Image */}
          <Image style={{  width: '400px', height: '400px', borderRadius: '10px', paddingBottom: '20px'}} src="../productImages/samsung_phone.jpg" fluid />
          {/* Small Image Slide Show */}
          <Carousel>
            <Carousel.Item>
              <img
                style={{ width: '200px', height: '120px', borderRadius: '10px'}}
                className="d-block w-100"
                src="../productImages/all.jpg"
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={{ width: '200px', height: '120px', borderRadius: '10px'}}
                className="d-block w-100"
                src="../productImages/frontview.jpg"
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={{ width: '200px', height: '120px', borderRadius: '10px'}}
                className="d-block w-100"
                src="../productImages/withCharger.jpg"
                alt="Second slide"
              />
            </Carousel.Item>
            {/* Add more Carousel.Items for additional images */}
          </Carousel>
        </Col>
        <Col md={6}>
          <div className={styles.productDetailsSection}>
            {/* Product Details */}
            <h2>Samsung Galaxy A12</h2>
            <h4>Category</h4>
            <p>Smart Phones</p>
            <h4>Item Description</h4>
            {/* Seller/Renter Details */}
            <ul>
              <li>4 GB RAM | 64 GB ROM | Expandable Upto 1 TB</li>
              <li>16.51 cm (6.5 inch) HD+ Display</li>
              <li>48MP + 5MP + 2MP + 2MP | 8MP Front Camera</li>
              <li>5000 mAh Battery</li>
              <li>Mediatek Helio P35 (MT6765) Processor</li>
              <li>Color: Blue</li>
            </ul>
          </div>
          <div className={styles.sellerDetailsSection}>
            <h3>Seller/Renter Details</h3>
            <h4>Name</h4>
            <p>Nipun Weerasinghe</p>
            <h4>Location</h4>
            <p>Thirunelvely, Jaffna</p>
            <h4>Contact No</h4>
            <p>077-1234567 / 021-7654321</p>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default ProductPage;
