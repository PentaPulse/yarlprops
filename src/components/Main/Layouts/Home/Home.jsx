import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Slidshow from './Slideshow/Slidshow';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';

function Home({handleBuy}) {
  return (
    <>
      <Container> 
        <Row>
          <Col className='mt-2'>
            <Slidshow />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col><SearchAndFilters /></Col>
        </Row>
        <Row className='mt-3'>
          <Col><Categories/></Col>
        </Row>
        <Row className='mt-3'>
          <ProductsContents/>
        </Row>
      </Container>
    </>
  )
}

export default Home;
