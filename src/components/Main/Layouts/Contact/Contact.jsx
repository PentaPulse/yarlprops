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
    </>
  )
}

export default Contact
