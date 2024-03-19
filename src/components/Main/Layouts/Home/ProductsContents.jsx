import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { authUser } from '../../../../backend/autharization'
import { Signin } from '../../../common/sign/Sign'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import Button from 'react-bootstrap/Button';
//import Card from 'react-bootstrap/Card';
import { FaAngleRight } from "react-icons/fa";

const blogData = [
  {
    id: 1,
    image: require('./images/im8.jpeg'),
    
    title: 'Kokuvil bording for boys',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.google.com'
  },
  {
    id: 2,
    image: require('./images/im6.jpeg'),
    
    title: 'dobel mattress',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.facebook.com'
  },
  {
    id: 3,
    image: require('./images/im8.jpeg'),
  
    title: 'hilton bording for gils',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
    link: 'https://www.twitter.com'
  }
]



function ProductsContents() {
  const handleReadmore=()=>{
    if(!authUser.currentUser){
        <Signin/>
    }
  }
  return (
    <div>
      <section id="blog" className="block blog-block">
      <Container fluid>
        <div className="title-holder">
          <h1>Our Categories</h1>
          <div className="subtitle">get needed items and find bordings</div>
        </div>
        <Row>
          {
            blogData.map(blog => {
              return (
                <Col sm={4} key={blog.id}>
                  <div className='holder'>
                    <Card style={{ width: '18rem' }}>
                      <Card.Img variant="top" src={blog.image} />
                      <Card.Body>
                        
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Text>
                          {blog.description}
                        </Card.Text>
                        <a href={blog.link} className="btn btn-primary">Read More <FaAngleRight /></a>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              )
            })
          }
        </Row>
        <br/>
        <Row>
          {
            blogData.map(blog => {
              return (
                <Col sm={4} key={blog.id}>
                  <div className='holder'>
                    <Card style={{ width: '18rem' }}>
                      <Card.Img variant="top" src={blog.image} />
                      <Card.Body>
                        
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Text>
                          {blog.description}
                        </Card.Text>
                        <a href={blog.link} className="btn btn-primary">Read More <FaAngleRight /></a>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              )
            })
          }
        </Row>
      </Container>
    </section>
    </div>
  )
}

export default ProductsContents
