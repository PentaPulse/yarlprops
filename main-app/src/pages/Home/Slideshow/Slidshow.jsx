import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import './SlideShow.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../api/firebase';

function SlideShow() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const carouselHeight = isSmallScreen ? '45vh' : isMediumScreen ? '55vh' : '75vh';
  const FontSize = isSmallScreen ? '0.8rem' : isMediumScreen ? '1.0rem' : '1.2rem';

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = await getDocs(collection(db, 'site'));
        const data = q.docs.map((doc) => doc.data());
        setSlides(data);
      } catch (e) {
        console.error("Error fetching slides:", e);
      }
    };
    fetchSlides();
  }, []);

  return (
    <Carousel>
      <Carousel.Item>
        <img 
          src={`${process.env.PUBLIC_URL}/welcome.jpg`} 
          alt="Welcome" 
          style={{ height: carouselHeight }} 
          className="d-block w-100" 
        />
        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          {slide.mediaType === 'image' ? (
            <img 
              src={slide.mediaUrl} 
              alt={slide.title} 
              style={{ height: carouselHeight }} 
              className="d-block w-100" 
            />
          ) : (
            <video
              src={slide.mediaUrl}
              alt={slide.title}
              style={{ height: carouselHeight }} 
              className="d-block w-100"
              controls
              loop
              muted
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          )}
          {/*
          <Carousel.Caption>
            <Link to="/p/rentals">
              <button
                className="bounce-button"
                style={{
                  fontSize: FontSize,
                  backgroundColor: '#018ABD',
                }}
              >
                View Details
              </button>
            </Link>
          </Carousel.Caption>*/}
        </Carousel.Item>
      ))}
      {/*}
      <Carousel.Item>
      <img 
          src={`${process.env.PUBLIC_URL}/maintain.avif`} 
          alt="Maintain-notice" 
          style={{ height: carouselHeight }} 
          className="d-block w-100" 
        />
      </Carousel.Item>
      */}
    </Carousel>
  );
}

export default SlideShow;
