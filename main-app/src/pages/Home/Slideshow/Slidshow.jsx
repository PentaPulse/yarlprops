import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useMediaQuery} from '@mui/material';
import { Link } from 'react-router-dom';
import './SlideShow.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../api/firebase';

function SlideShow() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const carouselHeight = isSmallScreen ? '45vh' : isMediumScreen ? '55vh' : '75vh';
  const FontSize = isSmallScreen ? '0.8rem' : isMediumScreen ? '1.0rem' : '1.2rem';

  const [slides, setSlides] = useState([])

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = await getDocs(collection(db, 'site'))
        const data = q.docs.map((doc) => doc.data())
        setSlides(data)
      } catch (e) { }
    }
    fetchSlides()
  }, [])

  return (
    <Carousel>
      {slides.length
      ?
      slides.map((slide, index) => (
        <Carousel.Item>
          {slide.mediaType === 'image' &&
            <img src={slide.mediaUrl} alt={slide.title} style={{ height: carouselHeight }} className="d-block w-100"  />
          }
          {slide.mediaType === 'video' &&
            <video
              src={slide.mediaUrl}
              alt={slide.title}
              style={{ height: carouselHeight }} className='d-block w-100' 
              controls // Adds play, pause, volume, etc. controls to the video
              loop // Loops the video if you want it to repeat
              muted // Mutes the video if you want it silent by default
              autoPlay // Autoplays the video when the component renders
              playsInline // Ensures the video plays inline on mobile devices
            >
              Your browser does not support the video tag.
            </video>
          }
          <Carousel.Caption>
            <Link to="/p/rentals">
              <button
                className='bounce-button'
                style={{
                  fontSize: FontSize,
                  backgroundColor: '#018ABD',
                }}>
                View Details
              </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))
    :<Carousel.Item>
      Loading
      </Carousel.Item>}
    </Carousel>
  );
}

// function SlideShow() {
//   const isSmallScreen = useMediaQuery('(max-width:600px)');
//   const isMediumScreen = useMediaQuery('(max-width:960px)');

//   const carouselHeight = isSmallScreen ? '45vh' : isMediumScreen ? '55vh' : '75vh';
//   const FontSize = isSmallScreen ? '0.8rem' : isMediumScreen ? '1.0rem' : '1.2rem';

//   return (
//    <Carousel>
//       {/* <Carousel.Item>
//         <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/rent_img.jpg" alt="First slide" />
//         <Carousel.Caption>
//           <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>RENTING BORDING HOUSES & ROOMS</h3>
//           <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
//         </Carousel.Caption>
//       </Carousel.Item> */}

//       {/* <Carousel.Item>
//         <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/food-delivery.jpg" alt="Second slide" />
//         <Carousel.Caption>
//           <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>FOOD DELIVERY</h3>
//           <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//         </Carousel.Caption>
//       </Carousel.Item> */}

//       {/* <Carousel.Item>
//         <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/Saloon2.jpg" alt="Third slide" />
//         <Carousel.Caption>
//           <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>SALOON FOR BOYS</h3>
//           <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
//         </Carousel.Caption>
//       </Carousel.Item> */}

//       <Carousel.Item>
//         <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/bikerentcosta.jpg" alt="Fourth slide" />
//         <Carousel.Caption>
//           {/* <Typography 
//             varient='h3' 
//             sx={{ 
//               fontWeight: 'bold',
//               textAlign: 'center',
//               fontSize: { xs:'0.8rem', sm:'1rem', md:'1.2rem', lg:'1.4rem' },
//               lineHeight: 1.2,
//             }}>
//             MOTORBIKES FOR RENT
//           </Typography> */}
//           {/* <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>MOTORBIKES FOR RENT</h3> */}
//           {/* <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p> */}
//           <Link to="/p/rentals">
//             <button 
//               className='bounce-button'
//               style={{ 
//                 fontSize: FontSize
//               }}>
//               View Details
//             </button>
//           </Link>
//         </Carousel.Caption>
//       </Carousel.Item>

//       <Carousel.Item>
//         <img style={{ height: carouselHeight }} className="d-block w-100" src="/slideshow/taxiservice.jpg" alt="Fourth slide" />
//         <Carousel.Caption>
//           {/* <Typography 
//             varient='h3' 
//             sx={{ 
//               fontWeight: 'bold',
//               textAlign: 'center',
//               fontSize: { xs:'0.8rem', sm:'1rem', md:'1.2rem', lg:'1.4rem' },
//               lineHeight: 1.2,
//             }}>
//             MOTORBIKES FOR RENT
//           </Typography> */}
//           {/* <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>TAXI SERVICE</h3> */}
//           {/* <p style={{ fontSize: FontSize, lineHeight: 1.2, fontStyle: 'italic' }}>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p> */}
//           <Link to="/p/services">
//             <button
//               className='bounce-button'
//               style={{ 
//                 fontSize: FontSize
//               }}>
//               View Details
//             </button>
//           </Link>
//         </Carousel.Caption>
//       </Carousel.Item>

//       <Carousel.Item>
//         <video style={{ height: carouselHeight }} className='d-block w-100' controls autoPlay loop muted>
//             <source src="/slideshow/KKSALOON.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//         </video>
//         <Carousel.Caption>
//           {/* <h3 style={{ fontSize: FontSize, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.0 }}>KK SALOON</h3>
//           <p style={{ fontSize: FontSize, lineHeight: 1.0, fontStyle: 'italic' }}>Make your appointment.</p> */}
//           <Link to="/p/services">
//             <button
//               className='bounce-button'
//               style={{ 
//                 fontSize: FontSize 
//               }}>
//               View Details
//             </button>
//           </Link>
//         </Carousel.Caption>
//       </Carousel.Item>

//     </Carousel>
//   );
// }

export default SlideShow;