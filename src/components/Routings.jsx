import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './Home/Home';

function Routings() {
  return (
    <>
    <Router>
        <Routes>
            <Route exact path='/' element={<Home/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default Routings;
