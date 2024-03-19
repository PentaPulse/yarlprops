import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import About from './Main/Layouts/About/about';

function Routings() {
  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/guide' element={<Guide/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

export default Routings;
