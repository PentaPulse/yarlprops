import React from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';



function Contact() {
  
   
  return (
    <>
    <div  className={styles.contactMap}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251709.86090183843!2d79.79166219246085!3d9.683893700000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe55d8c70c5db9%3A0xc4ee5d6945ad9bbd!2sUniversity%20of%20Jaffna!5e0!3m2!1sen!2slk!4v1710826610095!5m2!1sen!2slk" 
              width="400"
               height="450"
                style={{ border: "0" }} 
                allowfullscreen="" 
                loading="lazy" 
                ></iframe>
            </div>
     
      <section className={styles.sectionWrapper}>
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
        
      </section>
      
      
    </>
  );
}

export default Contact;