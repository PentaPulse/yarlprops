import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Slidshow from './Slidshow';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import ProductsContents from './ProductsContents';
import Categories from './Categories';

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
        <Row>
          <Col><Categories/></Col>
        </Row>
        <Row>
          <Col><ProductsContents handleBuy={handleBuy}/></Col>
        </Row>
      </Container>
    </>
  )
}

export default Home;
