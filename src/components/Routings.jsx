import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';

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
