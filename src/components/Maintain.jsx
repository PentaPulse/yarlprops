/*import React from 'react'

function Maintain() {
    return (
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div>
                <h1>Site Under Maintenance</h1>
                <p>We apologize for the inconvenience. Our site is currently undergoing maintenance.</p>
            </div>
        </div>
    )
}
*/
// Slideshow.js
import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { styled } from '@mui/system';

const images = [
  'https://via.placeholder.com/600x400?text=Image+1',
  'https://via.placeholder.com/600x400?text=Image+2',
  'https://via.placeholder.com/600x400?text=Image+3',
];

const SlideshowContainer = styled(Box)({
  position: 'relative',
  width: '600px',
  height: '400px',
  overflow: 'hidden',
});

const ImageContainer = styled(Box)({
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
});

const Image = styled('img')({
  width: '600px',
  height: '400px',
  objectFit: 'cover',
});

const NavigationButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
});

const Maintain = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <SlideshowContainer>
      <ImageContainer style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((src, index) => (
          <Image key={index} src={src} alt={`Slide ${index}`} />
        ))}
      </ImageContainer>
      <NavigationButton
        style={{ left: '10px' }}
        onClick={prevSlide}
        color="primary"
        aria-label="previous slide"
      >
        <ArrowBackIos />
      </NavigationButton>
      <NavigationButton
        style={{ right: '10px' }}
        onClick={nextSlide}
        color="primary"
        aria-label="next slide"
      >
        <ArrowForwardIos />
      </NavigationButton>
    </SlideshowContainer>
  );
};

export default Maintain;
