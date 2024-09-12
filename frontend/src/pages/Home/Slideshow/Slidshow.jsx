import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useMediaQuery } from '@mui/material';
import './SlideShow.css';

function SlideShow() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const carouselHeight = isSmallScreen ? '40vh' : isMediumScreen ? '60vh' : '80vh';

  return (
   <Carousel>
      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/rent_img.jpg" alt="First slide" />
        <Carousel.Caption>
          <h3 style={{ fontWeight: 'bolder' }}>RENTING BORDING HOUSES & ROOMS</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/food-delivery.jpg" alt="Second slide" />
        <Carousel.Caption>
          <h3 style={{ fontWeight: 'bolder' }}>FOOD DELIVERY</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/Saloon2.jpg" alt="Third slide" />
        <Carousel.Caption>
          <h3 style={{ fontWeight: 'bolder' }}>SALOON FOR BOYS</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/rentbike2.jpg" alt="Fourth slide" />
        <Carousel.Caption>
          <h3 style={{fontWeight: 'bolder'}}>MOTORBIKES FOR RENT</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

export default SlideShow;