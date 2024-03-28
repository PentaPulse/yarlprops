import React from 'react'
import { Card } from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaAngleRight } from "react-icons/fa";
//import { Link } from 'react-router-dom';

const blogData = [
    {
        id: 1,
        image: require('./images/im8.jpeg'),

        title: 'Bordings for boys in Kokuvil',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
        //link: 'https:www.google.com'
    },
    {
        id: 2,
        image: require('./images/im6.jpeg'),

        title: 'Double mattress',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
        //link: 'https:www.facebook.com'
    },
    {
        id: 3,
        image: require('./images/im8.jpeg'),

        title: 'Bording for girls at Hilton Bourding',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
        //link: 'https:www.twitter.com'
    },
    {
        id: 4,
        image: require('./images/im11.jpeg'),
    
        title: 'DSI Bicycle for rent',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
        //link: 'https:www.twitter.com'
    }

]

const renderCard = (blog) => (
    <Col xs={2} md={3} key={blog.id}>
        <div className='holder'>
            <Card style={{ width: '18rem', height: '30rem'}}>
                <Card.Img variant="top" src={blog.image} />
                <Card.Body>
                    <Card.Title style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: '550' }}>{blog.title}</Card.Title>
                    <Card.Text style={{ textAlign: 'justify' }}>
                        {blog.description}
                    </Card.Text>
                    {/* Add your link */}
                    {/* <Link to={`/product/${blog.id}`} className="btn btn-primary" style={{ position: 'absolute', left: '29%', top: '85%' }}>Read More <FaAngleRight /></Link> */}
                    <a href={blog.link} className="btn btn-primary" style={{ position: 'absolute', left: '29%', top: '85%' }}>Read More <FaAngleRight /></a>
                </Card.Body>
            </Card>
        </div>
    </Col>
);

function ProductsContents() {
    return (
        <div className='d-flex justify-content-center align-items-center'>
            <section id="blog" className="block blog-block mt-5">
                <Container fluid>
                    <Row>
                        {blogData.map(renderCard)}
                    </Row>
                    <br />
                    {/* Example for rendering the cards again */}
                    <Row>
                        {blogData.map(renderCard)}
                    </Row>
                    <br/>
                    <Row>
                        {blogData.map(renderCard)}
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default ProductsContents;

// function ProductsContents() {
//     return (
//         <div>
//             <section id="blog" className="block blog-block">
//                 <Container fluid>
//                     <div className="title-holder" style={{ textAlign: 'center' }}>
//                         <h1>Our Categories</h1>
//                         {/* <div className="subtitle" style={{ paddingBottom: '20px'}}>Needed items and find bordings</div> */}
//                         <h5 style={{ paddingBottom: '20px', fontStyle: 'italic'}}>Needed items and find bordings</h5>
//                     </div>
//                     <Row>
//                         {
//                             blogData.map(blog => {
//                                 return (
//                                     <Col sm={4} key={blog.id}>
//                                         <div className='holder'>
//                                             <Card style={{ width: '18rem', height: '30rem' }}>
//                                                 <Card.Img variant="top" src={blog.image} />
//                                                 <Card.Body>
//                                                     <Card.Title style={{textAlign: 'center', fontStyle: 'italic', fontWeight:'550'}}>{blog.title}</Card.Title>
//                                                     <Card.Text style={{textAlign: 'justify'}}>
//                                                         {blog.description}
//                                                     </Card.Text>
//                                                     <a href={blog.link} className="btn btn-primary" style={{position: 'absolute', left: '29%', top: '85%'}}>Read More <FaAngleRight /></a>
//                                                 </Card.Body>
//                                             </Card>
//                                         </div>
//                                     </Col>
//                                 )
//                             })
//                         }
//                     </Row>
//                     <br />
//                     <Row>
//                         {
//                             blogData.map(blog => {
//                                 return (
//                                     <Col sm={4} key={blog.id}>
//                                         <div className='holder'>
//                                             <Card style={{ width: '18rem', height: '30rem' }}>
//                                                 <Card.Img variant="top" src={blog.image} />
//                                                 <Card.Body>
//                                                     <Card.Title style={{textAlign: 'center', fontStyle: 'italic', fontWeight:'550'}}>{blog.title}</Card.Title>
//                                                     <Card.Text style={{textAlign: 'justify'}}>
//                                                         {blog.description}
//                                                     </Card.Text>
//                                                     <a href={blog.link} className="btn btn-primary" style={{position: 'absolute', left: '29%', top: '85%'}}>Read More <FaAngleRight /></a>
//                                                 </Card.Body>
//                                             </Card>
//                                         </div>
//                                     </Col>
//                                 )
//                             })
//                         }
//                     </Row>
//                 </Container>
//             </section>
//         </div>
//     );
// }

// export default ProductsContents;

