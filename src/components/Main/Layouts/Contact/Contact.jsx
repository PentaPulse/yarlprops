import React, { useState } from 'react'
import styles from './Contact.module.css'
//import { Button, TextField ,Container} from '@mui/material'
import { sendMessage } from '../../../../backend/database'
import Image1 from "./images/contact1.jpg"
//import Image2 from "./images/aboutus.avif"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import img3 from './images/hello2a.png';


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
         <section className={styles.hero1} >
    <div className={styles.content2}>
   
    </div>
    </section>
    
       

        <section>
            <div className="d-flex flex-column text-center mt-4">
                <h1 className={`${styles.centerHeading}`}>Our Team</h1>
                <div className={styles.homeContainer}>


                    <div className={styles.profileCard}>

                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/sachi.jpg' alt='memberImage01'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Sachintha Wijerathna</h3>
                            <p>Team Leader</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='/sample/charith.jpg' alt='memberImage02'/>
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
                            <img className={styles.image} src='/sample/priya.jpg' alt='memberImage04'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>R.Priyadarshani</h3>
                            <p>Team member</p>

                        </div>
                    </div>
                    <div className={styles.profileCard}>
                        <div className={styles.imageContainer}>
                            <img className={styles.image} src='sample/jan.jpg' alt='memberImage05'/>
                        </div>
                        <div className={styles.caption}>
                            <h3>Janani Welipitiya</h3>
                            <p>Team member</p>

                        </div>
                    </div>
                </div>
            </div>
            </section>

            
    

          

        </>
    )
}

function InfoPP() {
    return (
        <>
        <Container>
            
                <h3 align='center'>Welcome all for YarlProps System. In our system you can buy and rent any item as your wish.  </h3>
                </Container>

            <section className={styles.hero} style={{backgroundImage:`url(${Image1})`}}>
    <div className={styles.content1}>
    <h1>Contact Us</h1>
    <h4>We are committed to supporting you, first and foremost! We continually strive to exceed expectations and deliver superior 24/7 Days Support.
         You can always count on us for live help whenever you need assistance. Call us now!</h4>
    </div>
    </section>
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
            <section>
            
        
            <Row>
                       
                    
              <Col sm={8}>
        <div className={styles.contact}>
          <div className={styles.textContainer}>
            <h1>Send us a message</h1>
            <div className={styles.item1}>
              <h5>Mail</h5>
              <span>pentapulse@gmail.com</span>
            </div>
            <div className={styles.item1}>
              <h5>Address</h5>
              <span>Ramanadan Road,Jaffna</span>
            </div>
            <div className={styles.item1}>
              <h5>Phone</h5>
              <span>+94771112223</span>
            </div>
           
          </div>
          <div className={styles.formContainer}>
              <form>
                <input type="text" required placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} />
                <input type="email" required placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <textarea rows={8} placeholder='Message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
                <button onClick={handleSubmit}>Send Message</button>
    
              </form>
    
            </div>
        </div>
        </Col> 
    
        <Col sm={4} className={styles.hero3}>
                <Image src={img3}  fluid/>
         </Col>
        </Row>
    
        <Row>
            <Col>
            <iframe  className={styles.gmap} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.966514762512!2d80.02048177450527!3d9.683898978395154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1712031159798!5m2!1sen!2slk" 
            width="1300" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </Col>
        </Row>
        
        
        </section>
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