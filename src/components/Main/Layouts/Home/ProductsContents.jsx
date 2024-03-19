import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { authUser } from '../../../../backend/autharization'
import { Signin } from '../../../common/sign/Sign'

function ProductsContents() {
  const handleReadmore=()=>{
    if(!authUser.currentUser){
        <Signin/>
    }
  }
  return (
    <div>
    <Card style={{ width: '18rem' }} className='rounded'>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Bodim</Card.Title>
        <Card.Text>
          Near to University of Jaffna
        </Card.Text>
        <Button onClick={handleReadmore} variant="primary">Read more</Button>
      </Card.Body>
    </Card>
    </div>
  )
}

export default ProductsContents
