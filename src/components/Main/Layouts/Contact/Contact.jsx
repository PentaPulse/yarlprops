<<<<<<< HEAD
import React from 'react';
import './Contact.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaSquarePhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
function Contact() {
  return (
    <>
      <section className="section-wrapper">
        <div className="box-wrapper">
          <div className="info-wrapper">
            <h2 className='info-title'>Contact Information</h2>
            <h3 className='info-sub-title'>Fill up the form and our Team will get back to you within 24 hours</h3>
            <ul className="info-details">
              <li>
              <i><FaSquarePhone /></i>
                <span>Phone:</span>
              </li>

              <li>
              <i><MdEmail /></i>
                <span>Email:</span>
              </li>
              <li>
              <i><FaAddressBook /></i>
                <span>Address:</span>
              </li>
            </ul>
            <ul className='social-icons'>
              <li><i><FaFacebook /></i></li>
              <li><i><FaGithub /></i></li>
              <li><i><IoLogoWhatsapp /></i></li>


            </ul>
            
          </div>

          <div className="form-wrapper">
            <form action="#" method='POST'>
              <h2 className="form-title">Send us a message</h2>
              <div className="form-fields">
                <div className="form-group">
                  <input type="text" placeholder='First Name'/>

                </div>
                <div className="form-group">
                  <input type="text" placeholder='Last Name'/>

                </div>
                <div className="form-group">
                  <input type="email" placeholder='Email'/>

                </div>
                <div className="form-group">
                  <input type="number" placeholder='Phone'/>

                </div>
                <div className="form-group">
                  <textarea name="message" placeholder='Write your message'></textarea>

                </div>
              </div>
              <input type='submit' value="Send Message" className='submit-button'/>
            </form>
          </div>
          

        </div>
      </section>
=======
import React from 'react'
import styles from '../../Home.module.css'

function Contact() {
  return (
    <>
      <div className={`${'d-flex justify-content-center align-items-center vh-100'} ${styles.contactContainer}`}>
        <div className="gg">
        </div>
        <div className="bg-white rounded w-30 p-10">
          <h1>Our Team</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="name"><strong>Name</strong></label>
              <input type='name' placeholder='enter name' name='name' />
            </div>
          </form>
        </div>
      </div>
>>>>>>> 6680e04fcd2323fce6cbc9ff05872bc3747ffd3b
    </>
  );
}

export default Contact;
