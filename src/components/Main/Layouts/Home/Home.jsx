import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Slidshow from './Slidshow'
import SearchAndFilters from './SearchAndFilters'
import ProductsContents from './ProductsContents'

function Home() {
  return (
    <>
      <Container>
        <Row>
          <Col className='mt-4'>
            <Slidshow />
          </Col>
        </Row>
        <Row className='mt-5'>
          <Col xs={3}><SearchAndFilters /></Col>
          <Col md="auto" ><ProductsContents/></Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
