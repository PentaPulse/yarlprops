import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Main/Layouts/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import { AuthProvider } from '../backend/AuthContext';
import PrivateRoute from '../backend/PrivateRoute';
import Dashboards from './Main/Dashboards/Dashboards';
import AdminProducts from './Main/Dashboards/Admin/AdminProducts';

function Routings({ handleMode }) {
  return (
    <>
      <AuthProvider>
        <Layout handleMode={handleMode}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route path='/guide' element={<Guide />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </Layout>
        <PrivateRoute>
          <Routes>
            <Route path='/dashboard' element={<Dashboards handleMode={handleMode} />} />
            <Route path="/admin/products/*" element={<AdminProducts />} />
          </Routes>
        </PrivateRoute>
      </AuthProvider>
    </>
  )
}

export default Routings;