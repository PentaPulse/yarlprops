import React from 'react'
import { Button } from 'react-bootstrap'

function Contact() {
  return (<>
  <Button>sadaewq</Button>
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className="gg">
      </div>
      <div className="bg-white rounded w-30 p-10">
        <h1>Our Team</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="name"><strong>Name</strong></label>
            <input type='name' placeholder='enter name' name='name'/>
          </div>
        </form>
      </div>      
    </div>
    </>
  )
}

export default Contact
