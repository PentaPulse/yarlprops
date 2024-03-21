import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Slidshow from './Slidshow'
import SearchAndFilters from './SearchAndFilters'
import ProductsContents from './ProductsContents'

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
          <Col xs={3}><SearchAndFilters /></Col>
          <Col md="auto" ><ProductsContents handleBuy={handleBuy}/></Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
