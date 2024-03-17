import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './SlideShow.css';

function slideShow() {
  return (
    <Carousel>

      <Carousel.Item>
        {/* Add the first image here */}
        <img style={{height:"90vh"}} className="d-block w-100" src="/SSimges/car1.jpg" alt="First slide" />
        <Carousel.Caption>
          <h3>Ferrari Version</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        {/* Add the second image here */}
        <img style={{height:"90vh"}} className="d-block w-100" src="/SSimges/car2.jpg" alt="Second slide" />
        <Carousel.Caption>
          <h3>Audi Version</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        {/* Add third image here */}
        <img style={{height:"90vh"}} className="d-block w-100" src="/SSimges/car3.jpg" alt="Third slide" />
        <Carousel.Caption>
          <h3>BMW Version</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

export default slideShow;
