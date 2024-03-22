import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { authUser } from '../../../backend/autharization';

function Photos() {
  return (
    <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Row>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '140px' }}>
          <Col>
            <img src={authUser.currentUser.photoURL} alt='pic' width='100%' style={{ borderRadius: '100%' }} />
          </Col>
          <Col>
            <Row>
              <Col>
              <div style={{ marginLeft: 'auto' }}>
                <Card style={{ width: '50rem' }}>
                  <Card.Body>
                    <Card.Title><h1>{authUser.currentUser.displayName}</h1></Card.Title>
                    <Card.Body><h4>{authUser.currentUser.email}</h4></Card.Body>
                    <Card.Body><h4>{authUser.currentUser.phoneNumber || 'Your phonenumber'}</h4></Card.Body>
                  </Card.Body>
                </Card>
              </div>
              </Col>{/** *
                  <Col><h1>{authUser.currentUser.displayName}</h1></Col>
                  <Col><h4>{authUser.currentUser.email}</h4></Col>
                  <Col><h4>{authUser.currentUser.phoneNumber || 'Your phonenumber'}</h4></Col>*/}
            </Row>
        </Col>
        </div>
      </Row>
      <br />
      <Container style={{ width: '100rem', marginTop: '20px' }}>
        <Accordion>
          <Accordion.Item eventKey="0" flush>
            <Accordion.Header><h4>Personal</h4></Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header><h4>Educational</h4></Accordion.Header>
            <Accordion.Body>

              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header><h4>Security</h4></Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </Container>
  );
}

export default Photos;
