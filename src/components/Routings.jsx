import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Layout from './Home/Layout';
import Home from './Home/Home';
import Guide from './Home/Guide';
import Contact from './Home/Contact';

function Routings() {
  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route exact path='/' component={Home}/>
          <Route path='/guide' component={Guide}/>
          <Route path='/contact' component={Contact}/>
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

export default Routings;
