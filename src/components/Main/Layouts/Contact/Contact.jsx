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
                <p align='center'>Welcome all for YarlProps System. In our system you can buy and rent any item as your wish.  </p>
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
            <Container maxWidth='lg' className='' >{/*sx={{ bgcolor: '#cfe8fc'}}*/}
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
                        <Button variant='contained' onClick={handleSubmit}>Send Message</Button>
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