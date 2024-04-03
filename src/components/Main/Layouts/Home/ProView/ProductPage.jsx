import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import styles from './ProductPage.module.css';
import { products } from '../Data/productData';
import Table from 'react-bootstrap/Table';

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
          <Col md={6} className={styles.productImageSection}>
            {/* Product Image */}
            <Image style={{ width: '400px', height: '400px', borderRadius: '10px', paddingBottom: '20px' }} src={product.mainimage} fluid />
            {/* Small Image Slide Show */}
            <Carousel>
              <Carousel.Item>
                <img
                  style={{ width: '600px', height: '250px', borderRadius: '10px' }}
                  className="d-block w-100"
                  src={product.image1}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ width: '600px', height: '250px', borderRadius: '10px' }}
                  className="d-block w-100"
                  src={product.image2}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ width: '600px', height: '250px', borderRadius: '10px' }}
                  className="d-block w-100"
                  src={product.image3}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col md={6}>
            <Table striped bordered hover variant="dark">
              <tbody>
                <tr>
                <td colSpan={2} style={{ textAlign: 'center'}}>{product.title}</td>
                </tr>
                <tr style={{ textAlign: 'center'}}>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center'}}>Description</td>
                  <td>
                  <ul>
                    <li>{product.descriptionLine1}</li> 
                    <li>{product.descriptionLine2}</li> 
                    <li>{product.descriptionLine3}</li> 
                    <li>{product.descriptionLine4}</li> 
                    <li>{product.descriptionLine5}</li> 
                    <li>{product.descriptionLine6}</li>
                  </ul>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center'}}>Seller/Renter Details</td>
                </tr>
                <tr style={{ textAlign: 'center'}}>
                  <td>Name</td>
                  <td>{product.sellerName}</td>
                </tr>
                <tr style={{ textAlign: 'center'}}>
                  <td>Location</td>
                  <td>{product.Location}</td>
                </tr>
                <tr style={{ textAlign: 'center'}}>
                  <td>Contact No</td>
                  <td>{product.telephone}</td>
                </tr>
              </tbody>
            </Table>
            <div className={styles.productDetailsSection}>
              {/* Product Details */}
              <h2>{product.title}</h2>
              <h4>Category</h4>
              <p>{product.category}</p>
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
            <div className={styles.sellerDetailsSection}>
              {/* Seller Details */}
              <h3>Seller/Renter Details</h3>
              <h4>Name</h4>
              <p>{product.sellerName}</p>
              <h4>Location</h4>
              <p>{product.Location}</p>
              <h4>Contact No</h4>
              <p>{product.telephone}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
              <Link to="/" className="btn btn-primary">Back</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;
