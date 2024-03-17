import React from 'react'
import { Col, Container } from 'react-bootstrap'
import Slidshow from './Slidshow'
import SearchAndFilters from './SearchAndFilters'

function Home() {
  return (
    <>
    <Container>
        <Row>
            <Col>
            <Slidshow/>
            </Col>
        </Row>
        <Row>
            <Col md><SearchAndFilters/></Col>
            <Col md="auto">{/*Product listings*/}</Col>
        </Row>
    </Container>
    </>
  )
}

export default Home
