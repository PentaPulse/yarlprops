import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './Home/Home';
import Contact from './Home/Contact';
import Guide from './Home/Guide';

function Routings() {
  return (
    <>
    <Router>
        <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/contactus' element={<Contact/>}/>
            <Route path='/guide' element={<Guide/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default Routings;
