import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../backend/AuthContext';
import PrivateRoute from '../backend/PrivateRoute';
import Dashboards from './Main/Dashboards/Dashboards';
import Layout from './Main/Layouts/Layout';

function Routings({ handleMode }) {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout handleMode={handleMode}/>}/>
          <Route path='/dashboard' element={<PrivateRoute><Dashboards handleMode={handleMode} /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default Routings;