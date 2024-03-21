import React from 'react'
import styles from './Contact.module.css'
import { Container } from 'react-bootstrap'

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
                <ContactInfo />
                <ContactForm />
            </Container>
        </>
    )
}

function ContactInfo() {
    return (
        <>

        </>
    )
}

function ContactForm() {
    return (
        <>

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
