import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Slidshow from './Slideshow/Slidshow';
import SearchAndFilters from './SearchAndFilters/SearchAndFilters';
import Categories from './Filters/Categories';
import ProductsContents from './ProContent/ProductsContents';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Slideshow2 from './Slideshow/Slideshow2';

function Home({ handleBuy }) {
  const [select,setSelect] = useState(true)

  return (
    <>
      <Row>
        <Col >
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="s1" onClick={()=>setSelect(true)} control={<Radio />} label="Slideshow with react bootstrap" />
              <FormControlLabel value="s2" onClick={()=>setSelect(false)} control={<Radio />} label="Slideshow with material ui" />
            </RadioGroup>
          </FormControl>
          {select?<Slidshow/>:<Slideshow2/>}
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col><SearchAndFilters /></Col>
      </Row>
      <Row className='mt-3'>
        <Col><Categories /></Col>
      </Row>
      <Row className='mt-3'>
        <ProductsContents />
      </Row>
    </>
  )
}

export default Home;
