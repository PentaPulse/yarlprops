import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styles from '../../Home.module.css'
import Slidshow from './Slidshow'
import SearchAndFilters from './SearchAndFilters'
import ProductsContents from './ProductsContents'

function Home() {
  return (
    <>
      <Container className={styles.panelContainer}>
        <Row>
          <Col className='mt-2'>
            <Slidshow />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col xs={3}><SearchAndFilters /></Col>
          <Col md="auto" ><ProductsContents/></Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
