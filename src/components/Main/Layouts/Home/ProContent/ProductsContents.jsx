import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { products } from '../Data/productData';

const ProductsContents = () => {
    return (
        <section id='products' className='block products-block mt-5'>
            <Container fluid='md'>
                <Row xs={1} md={2} lg={3} xl={4}> {/* Display one column for extra small screens and up to four columns for extra large screens */}
                    {products.map((product) => (
                        <Col key={product.id}> {/* Each card takes one column on extra small screens and up to four columns on extra large screens */}
                            <Card style={{ width: '18rem', height: '35rem', margin: '0.5rem'}}>
                                <Card.Img variant="top" src={product.mainimage} style={{ width: '35wh', height: '35vh' }}/>
                                <Card.Body>                    
                                    <Card.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        {product.title}
                                    </Card.Title>
                                    <Card.Text style={{ textAlign: 'justify' }}>
                                        {product.description1}
                                    </Card.Text>
                                    <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '1rem' }}>
                                        Read More
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}

export default ProductsContents;

// const blogData = [
//     {
//         id: 1,
//         image: require('./images/im8.jpeg'),

//         title: 'Bordings for boys in Kokuvil',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
//     },
//     {
//         id: 2,
//         image: require('./images/im6.jpeg'),

//         title: 'Double mattress',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
//     },
//     {
//         id: 3,
//         image: require('./images/im8.jpeg'),

//         title: 'Bording for girls at Hilton Bourding',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
//     },
//     {
//         id: 4,
//         image: require('./images/im11.jpeg'),
    
//         title: 'DSI Bicycle for rent',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, asperiores eaque quibusdam eum quod cum nesciunt.',
//     }

// ]

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