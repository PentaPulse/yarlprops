import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './Home/Home';
import Contact from './Home/Contact';

function Routings() {
  return (
    <>
    <Router>
        <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/contactus' element={<Contact/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default Routings;
