import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useMediaQuery } from '@mui/material';
import './SlideShow.css';

function SlideShow() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const carouselHeight = isSmallScreen ? '40vh' : isMediumScreen ? '60vh' : '80vh';
  const FontSize = isSmallScreen ? '1.0rem' : isMediumScreen ? '1.3rem' : '1.6rem';

  return (
   <Carousel>
      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/rent_img.jpg" alt="First slide" />
        <Carousel.Caption>
          {/* <Typography 
            varient='h3' 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: {xs:'1.5rem', sm:'2rem', md:'3rem', lg:'4rem'},
              lineHeight: 1.2,
            }}>
              RENTING BORDING HOUSES & ROOMS
            </Typography> */}
          <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>RENTING BORDING HOUSES & ROOMS</h3>
          <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/food-delivery.jpg" alt="Second slide" />
        <Carousel.Caption>
        {/* <Typography 
            varient='h3' 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs:'0.8rem', sm:'1rem', md:'1.2rem', lg:'1.4rem' },
              lineHeight: 1.2,
            }}>
            FOOD DELIVERY
          </Typography> */}
          <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>FOOD DELIVERY</h3>
          <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/Saloon2.jpg" alt="Third slide" />
        <Carousel.Caption>
          {/* <Typography 
            varient='h3' 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs:'0.8rem', sm:'1rem', md:'1.2rem', lg:'1.4rem' },
              lineHeight: 1.2,
            }}>
            SALOON FOR BOYS
          </Typography> */}
          <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>SALOON FOR BOYS</h3>
          <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/rentbike2.jpg" alt="Fourth slide" />
        <Carousel.Caption>
          {/* <Typography 
            varient='h3' 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: { xs:'0.8rem', sm:'1rem', md:'1.2rem', lg:'1.4rem' },
              lineHeight: 1.2,
            }}>
            MOTORBIKES FOR RENT
          </Typography> */}
          <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>MOTORBIKES FOR RENT</h3>
          <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

export default SlideShow;