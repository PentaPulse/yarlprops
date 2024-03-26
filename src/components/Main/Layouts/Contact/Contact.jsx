import React from 'react'
import styles from './Contact.module.css'
import { Button, TextField ,Container} from '@mui/material'

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
        <Container maxWidth='md'>
            <div className="d-flex flex-column text-center mt-4">
                <h1 className={`${styles.centerHeading}`}>Our Team</h1>
                <div class={styles.homeContainer}>


                    <div class={styles.profileCard}>

                        <div class={styles.img}>
                            <img src='/sample/sachi02.jpg' alt='pic' width='18%' />
                        </div>
                        <div class={styles.caption}>
                            <h3>Sachintha Wijerathna</h3>
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
            </div>
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
            <Container maxWidth='lg' className='' sx={{ bgcolor: '#cfe8fc'}}>
                <div className="d-flex flex-row mt-4">
                    <div className="left d-flex flex-column w-50 text-center mt-4">
                        <div className="address mb-4">
                            <img src="./images/address.svg" alt="address" />
                            <div class="topic">Address</div>
                            <div class="text-one">Ramanathan Rd, </div>
                            <div class="text-two">Jaffna</div>
                        </div>
                        <div className="phone mb-4">
                            <img src="./images/phone.svg" alt="phone" />
                            <div class="topic">Phone</div>
                            <div class="text-one">+94 12 345 6789</div>
                        </div>
                        <div className="email">
                            <img src="./images/email.svg" alt="email" />
                            <div class="topic">Email</div>
                            <div class="text-one">penta5pulse@gmail.com</div>
                        </div>
                    </div>
                    <div className="right d-flex flex-column w-50 gap-3">
                        <h3>Send us a Message</h3>
                        <TextField label='Your Name'></TextField>
                        <TextField label='Your Email'></TextField>
                        <TextField label='Your Message'></TextField>
                        <Button variant='contained'>Send Message</Button>
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