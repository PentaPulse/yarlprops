import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import UserProfile from './Main/Profiles/UserProfile';
import Admin from './Main/Dashboards/Admin1';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import { authUser } from '../backend/autharization';

function Routings({ handleMode }) {

  if (authUser.currentUser) {
    return (
      <>
        <Router>
          <Layout handleMode={handleMode}>
            <Routes>
              <Route path='/admin' element={<Admin />} />
              <Route exact path='/profile' element={<UserProfile />} />
            </Routes>
          </Layout>
        </Router>
      </>
    )
  }
  return (
    <>
      <Router>
        <Layout handleMode={handleMode}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route path='/guide' element={<Guide />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default Routings;
