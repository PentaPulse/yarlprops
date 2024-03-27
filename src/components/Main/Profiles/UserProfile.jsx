import React from 'react';
import { authUser } from '../../../backend/autharization';
import { Col, Form, Row, Accordion, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Photos() {
  const [cookies,setCookie]=useCookies(['uid','photo','dpn','email','phone'])
  const navigate = useNavigate()

  const user = authUser.currentUser
  if (user) {
    setCookie('uid',user.uid)
    setCookie('photo',user.photoURL)
    setCookie('dpn',user.displayName)
    setCookie('email',user.email)
    setCookie('phone',user.phoneNumber)
    console.log(cookies)
  }
  else {
    navigate('/')
  }
  return (
    <Container className='d-flex flex-column align-items-center flex-wrap'>
      <div className='d-flex align-items-center' style={{ marginTop: '140px' }}>
        <div>
          <img src={cookies.photo} alt='pic' width='40%' style={{ borderRadius: '100%', width: '90%', height: 'auto' }} />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Card border="dark" style={{ width: '50rem' }}>
            <Card.Body>
              <Card.Title><h1>{cookies.dpn || 'Display name'}</h1></Card.Title>
              <Card.Body><h4>{cookies.email || 'Your email'}</h4></Card.Body>
              <Card.Body><h4>{cookies.phone || 'Your phonenumber'}</h4></Card.Body>
            </Card.Body>
          </Card>
        </div>
      </div>
      <br />
      <Container style={{ width: '100rem', marginTop: '20px' }}>
        <Accordion>
          <Accordion.Item eventKey="0" flush>
            <Accordion.Header><h4>Personal</h4></Accordion.Header>
            <Accordion.Body>
              <Form>
                <Row>
                  <Row>
                    <Col>
                      <Form.Control size="lg" placeholder="First name" />
                    </Col>
                    <Col>
                      <Form.Control size="lg" placeholder="Last name" />
                    </Col>
                  </Row>

                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label></Form.Label>
                  <Form.Control size="lg" placeholder="Address" />
                </Form.Group>


              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header><h4>Educational</h4></Accordion.Header>
            <Accordion.Body>

              <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Faculty</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>Department</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>Year of Study</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
              </Form>
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
