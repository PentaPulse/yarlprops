import React from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { FaSquarePhone } from "react-icons/fa6";
//import { MdEmail } from "react-icons/md";
//import { FaAddressBook } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
//import { IoLogoWhatsapp } from "react-icons/io";
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import GoogleMapReact from 'google-map-react';

import styless from '../../Home.module.css'
import { Marker, Popup } from 'react-leaflet';
function Contact() {
  const dFlex = 'd-flex vh-100'

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
        <img src='/sample/profile.svg' width={200} />
        <img src='/sample/profile.svg' width={200} />
        <img src='/sample/profile.svg' width={200} />
        <img src='/sample/profile.svg' width={200} />
        <img src='/sample/profile.svg' width={200} />
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
          <div style={{ height: '60vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      />
    </div>
          </Col>
        </Row>
      </Container>
      {/** Below akkas code */}
      <section className={styles.sectionWrapper}>
        <div className={styles.boxWrapper}>
          <div className={styles.infoWrapper}>
            <h2 className={styles.infoTitle}>Contact Information</h2>
            <h3 className={styles.infoSubTitle}>Fill up the form and our Team will get back to you within 24 hours</h3>
            <ul className={styles.infoDetails}>
              <li>
                <FontAwesomeIcon icon={faPhone} />
                <span>Phone:</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Email:</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>Location:</span>
              </li>
            </ul>
            <ul className={styles.socialIcons}>
              <li><i><FaFacebook /></i></li>
              <li><i><FaGithub /></i></li>
            </ul>
          </div>

          <div className={styles.formWrapper}>
            <form method='POST'>
              <h2 className={styles.formTitle}>Send us a message</h2>
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <input type="text" placeholder='First Name' />
                </div>
                <div className={styles.formGroup}>
                  <input type="text" placeholder='Last Name' />
                </div>
                <div className={styles.formGroup}>
                  <input type="email" placeholder='Email' />
                </div>
                <div className={styles.formGroup}>
                  <input type="number" placeholder='Phone' />
                </div>
                <div className={styles.formGroup}>
                  <textarea name="message" placeholder='Write your message'></textarea>
                </div>
              </div>
              <input type='submit' value="Send Message" className={styles.submitButton} />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;