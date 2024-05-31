import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import Structure from './Main/Dashboards/Structure';
import { AuthProvider } from '../backend/AuthContext';
import PrivateRoute from '../backend/PrivateRoute';

function Routings({ handleMode }) {
  return (
    <>
      <Router>
        <AuthProvider>
          <Layout handleMode={handleMode}>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/home' element={<Home />} />
              <Route path='/guide' element={<Guide />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/dashboard' element={<PrivateRoute><Structure /></PrivateRoute>} />
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </>
  )
}

export default Routings;