import React from 'react';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import styless from '../../Home.module.css';

function Contact() {
  const defaultProps = {
    center: {
      lat: 9.684224538462379,
      lng: 80.02292933973115
    },
    zoom: 16
  };

  let info = `

  Welcome to YarlProps, where simplicity meets efficiency in managing your rental properties. At YarlProps, we understand the challenges property managers and landlords face in juggling multiple properties, tenants, and administrative tasks. That's why we've developed a comprehensive solution tailored to streamline the rental management process, empowering you to focus on what matters most – growing your business and providing exceptional service to your tenants.

  Founded with a vision to revolutionize the way rental properties are managed, YarlProps brings together cutting-edge technology and industry expertise to offer a user-friendly platform that caters to the diverse needs of property owners and managers alike. Whether you're managing a single apartment complex or an extensive portfolio of properties, our platform is designed to scale seamlessly, providing robust features and customizable options to suit your unique requirements.
  
  At YarlProps, we prioritize simplicity without compromising on functionality. Our intuitive interface makes it easy to navigate through essential tasks such as tenant screening, lease management, rent collection, maintenance requests, and financial reporting. With automated reminders and notifications, you can stay on top of critical deadlines and ensure smooth operations at all times.
  
  We pride ourselves on delivering exceptional customer service and ongoing support to our clients. Our dedicated team is committed to providing personalized assistance and guidance every step of the way, ensuring that you maximize the full potential of our platform to optimize your rental management processes.
  
  Join countless property owners and managers who have embraced the future of rental management with YarlProps. Experience the difference today and discover a simpler, more efficient way to manage your rental properties. Welcome to the future of rental management with YarlProps.
  
  
  `;

  return (
    <>
      <Container className={`${styless.contactContainer} ${'mt-4 d-flex justify-content-center'}`}>
          <h2>OUR TEAM</h2>
        <Row>
          <Col>
            <img src='/sample/profile.svg' className={styless.contactImg} alt='pic' width='18%' />
            <img src='/sample/profile.svg' className={styless.contactImg} alt='pic' width='18%' />
            <img src='/sample/profile.svg' className={styless.contactImg} alt='pic' width='18%' />
            <img src='/sample/profile.svg' className={styless.contactImg} alt='pic' width='18%' />
            <img src='/sample/profile.svg' className={styless.contactImg} alt='pic' width='18%' />
          </Col>
        </Row>

      </Container>
      <Container className={`${styless.contactContainer} ${'mt-4'}`}>
        <p>{info}</p>
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