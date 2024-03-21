import React from 'react'
import styles from './Contact.module.css'
import { Col, Container, Row } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';


function About() {
    return (
        <>
            <Photos />
            <InfoPP />
        </>
    )
}

function Photos() {
    return (
        <>
            <Container>
                <h2 align='center'>OUR TEAM</h2>
                <img src='/sample/profile.svg' className={styles.contactImg} alt='pic' width='18%' />
                <img src='/sample/profile.svg' className={styles.contactImg} alt='pic' width='18%' />
                <img src='/sample/profile.svg' className={styles.contactImg} alt='pic' width='18%' />
                <img src='/sample/profile.svg' className={styles.contactImg} alt='pic' width='18%' />
                <img src='/sample/profile.svg' className={styles.contactImg} alt='pic' width='18%' />
            </Container>
        </>
    )
}

function InfoPP() {
    return (
        <>
            <Container>
                <p align='center'>Welcome all for YarlProps System. In our system you can buy and rent any item as your wish.  </p>
            </Container>
        </>
    )
}

function ContactComps() {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <ContactInfo />
                    </Col>
                    <Col>
                        <ContactForm />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

function ContactInfo() {
    return (
        <>
            <div className={styles.contactInfo}>
                <h2>We are here</h2>
                <h4>Email us : </h4>
                <p>penta5pulse@gmail.com</p>
                <h4>Post us : </h4>
                <p>postal box maintaining 😁</p>
                <h4>Locate us : </h4>
                <div style={{ height: '500px', width: '100%' }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.9665147625187!2d80.02048177478142!3d9.68389897839459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1711006328892!5m2!1sen!2slk" width='80%' height={150} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title='googleMap'/>
                </div>
            </div>
        </>
    )
}

function ContactForm() {
    return (
        <>
        <div className={styles.contactForm}></div>
            <h2>Feel free to contact us</h2>
            
        </>
    )
}

function Contact() {
    return (
        <>
            <About />
            <ContactComps />
            <Container>
                <section className={styles.sectionWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={styles.boxWrapper}>
                        <div className={styles.infoWrapper}>
                            <h2 className={styles.infoTitle}>Contact Information</h2>
                            <h3 className={styles.infoSubTitle}>Fill up the form and our Team will get back to you within 24 hours</h3>
                            <ul className={styles.infoDetails}>
                                <li>
                                    <i><FontAwesomeIcon icon={faPhone} /></i>
                                    <span>Phone:</span>
                                </li>
                                <li>
                                    <i><FontAwesomeIcon icon={faEnvelope} /></i>
                                    <span>Email:</span>
                                </li>
                                <li>
                                    <i><FontAwesomeIcon icon={faLocationDot} /></i>
                                    <span>Location:</span>
                                </li>
                                <li>

                                </li>
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
                                    <div className={`${styles.formGroup} ${styles.radioGroup}`}>
                                        <div className={styles.radioOption}>
                                            <label> Type:</label>
                                        </div>
                                        <div className={styles.radioOption}>
                                            <input type="radio" id="feedback" name="messageType" value="feedback" />
                                            <label htmlFor="feedback">Feedback</label>
                                        </div>
                                        <div className={styles.radioOption}>
                                            <input type="radio" id="issue" name="messageType" value="issue" />
                                            <label htmlFor="issue">Issue</label>
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <textarea name="message" placeholder='Write your message'></textarea>
                                    </div>
                                </div>
                                <input type='submit' value="Send Message" className={styles.submitButton} />
                            </form>
                        </div>
                    </div>
                    <div className={styles.contactMap}>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.966514762512!2d80.02048177450527!3d9.68389897839516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1711036475479!5m2!1sen!2slk"
                            width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </section>
            </Container>
        </>
    )
}

export default Contact;
