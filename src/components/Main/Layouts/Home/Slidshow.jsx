import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './SlideShow.css';

function slideShow() {
  return (
    <Carousel>

      <Carousel.Item>
        <img style={{height:"80vh"}} className="d-block w-100" src="/slideshow/rent.jpg" alt="First slide" />
        <Carousel.Caption>
          <h3 style={{fontWeight: 'bolder'}}>RENTING BORDING HOUSES & ROOMS</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{height:"80vh"}} className="d-block w-100" src="/slideshow/food-delivery.jpg" alt="Second slide" />
        <Carousel.Caption>
          <h3 style={{fontWeight: 'bolder'}}>FOOD DELIVERY</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{height:"80vh"}} className="d-block w-100" src="/slideshow/Saloon2.jpg" alt="Third slide" />
        <Carousel.Caption>
          <h3 style={{fontWeight: 'bolder'}}>SALOON FOR BOYS</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{height:"80vh"}} className="d-block w-100" src="/slideshow/rentbike2.jpg" alt="Fourth slide" />
        <Carousel.Caption>
          <h3 style={{fontWeight: 'bolder'}}>MOTORBIKES FOR RENT</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

export default slideShow;