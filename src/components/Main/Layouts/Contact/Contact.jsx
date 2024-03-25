import React from 'react'
import styles from './Contact.module.css'
import './ContactComps.css'
import { Container} from 'react-bootstrap'

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

function Contact() {
    return (
        <>
            <About />
            <ContactComps />
        </>
    )
}

export default Contact;