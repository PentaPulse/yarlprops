import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import { AuthProvider } from '../backend/AuthContext';
import PrivateRoute from '../backend/PrivateRoute';
import AdminProducts from './Main/Dashboards/Admin/AdminProducts';
import Dashboards from './Main/Dashboards/Dashboards';
import Layout from './Main/Layouts/Layout';
//import { ProductProvider } from '../backend/ProductContext';

function Routings({ handleMode, handleDashboardState, dash }) {
  return (
    <>
        <AuthProvider>
          <Layout handleMode={handleMode} >
            <Routes>
              <Route path="/admin/products/*" element={<AdminProducts />} />
              <Route exact path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/guide' element={<Guide />} />
              <Route path='/contact' element={<Contact />} />
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </Layout>
          <Routes>
            <Route path='/dashboard' element={<PrivateRoute><Dashboards handleMode={handleMode} /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
    </>
  )
}

export default Routings;