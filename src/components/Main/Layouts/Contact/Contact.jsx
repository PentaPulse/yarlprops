import React from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';

import styless from '../../Home.module.css'
function Contact() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    <>
      <Container className={`${styless.contactContainer} ${'mt-4'}`}>
        <img src='/sample/profile.svg' width='20%' />
        <img src='/sample/profile.svg' width='20%' />
        <img src='/sample/profile.svg' width='20%' />
        <img src='/sample/profile.svg' width='20%' />
        <img src='/sample/profile.svg' width='20%' />
      </Container>
      <Container className={`${styless.contactContainer} ${'mt-4'}`}>
        <p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
      </Container>
      <Container className={`${styless.contactContainer} ${'mt-4'}`}>
        <Row>
          <Col>
            <h4>Send message</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form>
                  <label htmlFor="">Massege type: </label>
                  <Form.Check
                    inline
                    label="Feedback"
                    name="group1"
                    type='radio'
                    id={`inline-radio-1`}
                  />
                  <Form.Check
                    inline
                    label="Problem"
                    name="group1"
                    type='radio'
                    id={`inline-radio-1`}
                  />
                </Form>
              </Col>
            </Row>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingTextarea2" label="Comments">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant='success' width='100%'>Send Message</Button>
          </Col>
        </Row>
      </Container>
      <Container className={`${styless.contactContainer} ${'mt-4'}`}>
        <Row>
          <Col>
            <p>Email address</p>
          </Col>
          <Col>
            <div style={{ height: '500px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Contact;