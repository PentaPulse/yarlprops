import React from 'react'
import { Carousel } from 'react-bootstrap';
import styles from '../../Home.module.css'

function Slidshow() {
  return (
    <div className={styles.slidshowContainer}>
      <Carousel fade>
        <Carousel.Item>
          <img src='/slideshow/rent.jpg' alt='slide 1' text="First slide" height={300} width={700} />
          <Carousel.Caption>
            <h3>RENT BODIM HOUSES</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='/slideshow/food-delivery.jpg' alt='slide 2' text="Second slide" height={300} width={700} />
          <Carousel.Caption>
            <h3>FOOD</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src='/slideshow/salon.jpeg' alt='slide 3' text="Third slide" height={300} width={700} />
          <Carousel.Caption>
            <h3>SALON</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Slidshow
