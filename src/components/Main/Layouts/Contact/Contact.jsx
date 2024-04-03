import React, { useState } from 'react'
import styles from './Contact.module.css'
import { Button, TextField ,Container} from '@mui/material'
import { sendMessage } from '../../../../backend/database'

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
            <div className="d-flex flex-column text-center mt-4">
                <h1 className={`${styles.centerHeading}`}>Our Team</h1>
                <div className={styles.homeContainer}>


                    <div className={styles.profileCard}>

                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/sachi02.jpg' alt='memberImage01'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Sachintha Wijerathna</h3>
                            <p>Team Leader</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/Charith.jpg' alt='memberImage02'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Charith Gayashan</h3>
                            <p>Team member</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/mith.jpeg' alt='memberImage03'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Mith Jayakodi</h3>
                            <p>Team member</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/priya01.jpg' alt='memberImage04'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>R.Priyadarshani</h3>
                            <p>Team member</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/jan1.jpg' alt='memberImage05'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Janani Welipitiya</h3>
                            <p>Team member</p>

                        </div>
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
                <div className={styles.aboutUs}>
                    <h2>About Us - Who We Are?</h2><br/>
                    <p>
                        At University of Jaffna Boarding and Vehicle Rent Management
                        System, we are dedicated to revolutionizing the way university
                        students manage their accommodation and transportation needs.
                    </p>
                    <p>
                        Our platform is designed with the aim of simplifying the process
                        of finding suitable boarding accommodations and renting vehicles
                        for students, ensuring convenience, accessibility, and
                        affordability.
                    </p>
                    <p>
                        With years of experience in understanding the unique challenges
                        faced by university students, we have developed a comprehensive
                        system that caters specifically to their needs. Whether you're a
                        freshman looking for your first boarding house or a senior seeking
                        a reliable vehicle for your commute, our platform offers a
                        seamless solution tailored just for you.
                    </p>
                    <p>
                        Our team is comprised of passionate individuals who are committed
                        to providing top-notch services and support to our users. We
                        strive to maintain transparency, integrity, and professionalism in
                        all our interactions, ensuring that every user feels valued and
                        supported throughout their journey with us.
                    </p>
                    <p>
                        By leveraging cutting-edge technology and innovative solutions, we
                        aim to empower university students to take control of their
                        accommodation and transportation arrangements, allowing them to
                        focus on what truly matters – their education and personal growth.
                    </p>
                    <p>
                        Thank you for choosing University of Jaffna Boarding and Vehicle
                        Rent Management System. We look forward to serving you and being a
                        part of your university experience
                    </p>
                </div>
                <p style={{ fontSize: '22px', textAlign: 'center', fontWeight: 'bold'}}>Welcome all for YarlProps System. In our system you can buy and rent any item as your wish.  </p>
            </Container>
        </>
    )
}

function ContactComps() {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [message,setMessage]=useState('')
    const handleSubmit=()=>{
        sendMessage(name,email,message)
        setName('')
        setEmail('')
        setMessage('')
    }
    return (
        <>
            <Container maxWidth='lg' style={{ fontSize: '20px'}} >{/*sx={{ bgcolor: '#cfe8fc'}}*/}
                <div className="d-flex flex-row mt-4">
                    <div className="left d-flex flex-column w-50 text-center mt-4">
                        <div className="address mb-4">
                            <img src="social-icons/address.svg" alt="address" width={30}/>
                            <div class="topic">Address</div>
                            <div class="text-one">Ramanathan Rd, </div>
                            <div class="text-two">Jaffna</div>
                        </div>
                        <div className="phone mb-4">
                            <img src="social-icons/phone.svg" alt="phone" width={30}/>
                            <div class="topic">Phone</div>
                            <div class="text-one">+94 12 345 6789</div>
                        </div>
                        <div className="email">
                            <img src="social-icons/email.svg" alt="email" width={30}/>
                            <div class="topic">Email</div>
                            <div class="text-one">penta5pulse@gmail.com</div>
                        </div>
                    </div>
                    <div className="right d-flex flex-column w-50 gap-3">
                        <h3>Send us a Message</h3>
                        <TextField label='Your Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                        <TextField label='Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <TextField label='Your Message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
                        <Button style={{ backgroundColor: '#0d6efd'}} variant='contained' onClick={handleSubmit}>Send Message</Button>
                    </div>
                </div>
            </Container>
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