import React from 'react'
import styles from './Contact.module.css'
import './ContactComps.css'
import { Col, Container, Row } from 'react-bootstrap'

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
            <h1 className={`${styles.centerHeading}`}>Our Team</h1>
            <div class={styles.homeContainer}>


                <div class={styles.profileCard}>

                    <div class={styles.img}>
                        <img src='/sample/sachi02.jpg' alt='pic' width='18%' />
                    </div>
                    <div class={styles.caption}>
                        <h3>Sachintha Wigerathna</h3>
                        <p>Team Leader</p>

                    </div>
                </div>
                <div class={styles.profileCard}>
                    <div class={styles.img}>
                        <img src='/sample/man.jpg' alt='pic' width='18%' />
                    </div>
                    <div class={styles.caption}>
                        <h3>Charith Rajapaksha</h3>
                        <p>Team member</p>

                    </div>
                </div>
                <div class={styles.profileCard}>
                    <div class={styles.img}>
                        <img src='/sample/man.jpg' alt='pic' width='18%' />
                    </div>
                    <div class={styles.caption}>
                        <h3>Mith Jayakodi</h3>
                        <p>Team member</p>

                    </div>
                </div>
                <div class={styles.profileCard}>
                    <div class={styles.img}>
                        <img src='/sample/priya01.jpg' alt='pic' width='18%' />
                    </div>
                    <div class={styles.caption}>
                        <h3>R.Priyadarshani</h3>
                        <p>Team member</p>

                    </div>
                </div>
                <div class={styles.profileCard}>
                    <div class={styles.img}>
                        <img src='/sample/jan1.jpg' alt='pic' width='18%' />
                    </div>
                    <div class={styles.caption}>
                        <h3>Janani Welipitiya</h3>
                        <p>Team member</p>

                    </div>
                </div>
            </div>

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
        <div class="contactContainer">
            <div class="content">
                <div class="left-side">
                    <div class="address details">
                        <i class='bx bx-map'></i>
                        <div class="topic">Address</div>
                        <div class="text-one">No 50, kalawana</div>
                        <div class="text-two">Ratnapura</div>
                    </div>
                    <div class="phone details">
                        <i class='bx bx-phone-call'></i>
                        <div class="topic">Phone</div>
                        <div class="text-one">+94 70 323 3232</div>
                        <div class="text-two">+94 76 325 2332</div>
                    </div>
                    <div class="email details">
                        <i class='bx bx-envelope'></i>
                        <div class="topic">Email</div>
                        <div class="text-one">slcodehub@gmail.com</div>
                        <div class="text-two">Dilshan@gmail.caom</div>
                    </div>
                </div>
                <div class="right-side">
                    <div class="topic-text">Send us a Message</div><br/>
                    <p>if you have any work from me any types of quries relates to my tutorial,you can send me Message
                        form here. it's my pleasure to help you.</p><br/>
    
                    <form action="#">
                        <div class="input-box">
                            <input type="text" placeholder="Enter your name"/>
                        </div>
                        <div class="input-box">
                            <input type="email" placeholder="Enter your email"/>
                        </div>
                        <div class="input-box message-box">
                            <textarea></textarea>
                        </div>
                        <div class="button">
                            <input type="button" value="Send Now"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    
        </>
    )
}

function ContactInfo() {
    return (
        <>
            <div className={styles.contactInfo}>
                <h2 className={styles.formTitle}>We are here</h2>
                <h4>Email us : </h4>
                <p>penta5pulse@gmail.com</p>
                <h4>Post us : </h4>
                <p>postal box maintaining 😁</p>
                <h4>Locate us : </h4>
                <div style={{ height: '500px', width: '100%' }}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.9665147625187!2d80.02048177478142!3d9.68389897839459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1711006328892!5m2!1sen!2slk" width='80%' height={150} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title='googleMap' />
                </div>
            </div>
        </>
    )
}

function ContactForm() {
    return (
        <>
            <div className={styles.formWrapper}>
                <form method='POST'>
                    <h2 className={styles.formTitle}>Feel free to contact us</h2>
                    <div className={styles.formFields}>
                        <Row>
                            <Col>
                                <div className={styles.formGroup}>
                                    <input type="text" placeholder='First Name' />
                                </div>
                            </Col>
                            <Col>
                                <div className={styles.formGroup}>
                                    <input type="text" placeholder='Last Name' />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className={styles.formEmail}>
                                    <input type="email" placeholder='Email' />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className={styles.formGroup}>
                                    <textarea name="message" placeholder='Write your message'></textarea>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <input type='submit' value="Send Message" className={styles.submitButton} />
                </form>
            </div>
        </>
    )
}

function Contact() {
    return (
        <>
            <About />
            <ContactComps />
        </>
    )
}

export default Contact;