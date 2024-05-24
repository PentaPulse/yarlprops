import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import UserProfile from './Main/Profiles/UserProfile';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import Structure from './Main/Dashboards/Structure';

function Routings({ handleMode }) {
  const accessa = sessionStorage.getItem('usra')
  return (
    <>
      <Router>
        <Layout handleMode={handleMode}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route path='/guide' element={<Guide />} />
            <Route path='/contact' element={<Contact />} />
            <Route exact path='/profile' element={<UserProfile />} />
            {accessa ? <Route path='/dashboard' element={<Structure admin />} /> : <Route path='/dashboard' element={<Structure seller />} />}
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default Routings;