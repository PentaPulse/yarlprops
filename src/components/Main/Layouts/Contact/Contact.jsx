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
