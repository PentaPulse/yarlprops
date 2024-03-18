import React from 'react';
import styles from './Contact.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { FaSquarePhone } from "react-icons/fa6";
//import { MdEmail } from "react-icons/md";
//import { FaAddressBook } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
function Contact() {
  return (
    <>
      <section className={styles.sectionWrapper}>
        <div className={styles.boxWrapper}>
          <div className={styles.infoWrapper}>
            <h2 className={styles.infoTitle}>Contact Information</h2>
            <h3 className={styles.infoSubTitle}>Fill up the form and our Team will get back to you within 24 hours</h3>
            <ul className={styles.infoDetails}>
              <li>
              <FontAwesomeIcon icon={faPhone} />
                <span>Phone:</span>
              </li>
              <li>
              <FontAwesomeIcon icon={faEnvelope} />
                <span>Email:</span>
              </li>
              <li>
              <FontAwesomeIcon icon={faLocationDot} />
                <span>Location:</span>
              </li>
            </ul>
            <ul className={styles.socialIcons}>
              <li><i><FaFacebook /></i></li>
              <li><i><FaGithub /></i></li>
              <li><i><IoLogoWhatsapp /></i></li>
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