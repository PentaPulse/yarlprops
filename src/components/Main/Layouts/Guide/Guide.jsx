import React from 'react'
import styles from '../../Home.module.css';
import ProductPage from  '../Home/ProductPage';

function Guide() {
  return (
    <>
    <div className={`${styles.guideContainer} ${'vh-90'}`}>
      <ProductPage />
    </div>
    </>
  )
}

export default Guide;
