import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Main/Layout';
import Home from './Main/Layouts/Home/Home';
import Guide from './Main/Layouts/Guide/Guide';
import Contact from './Main/Layouts/Contact/Contact';
import ProductPage from './Main/Layouts/Home/ProView/ProductPage';
import Structure from './Main/Dashboards/Structure';
import { onAuthStateChanged } from 'firebase/auth';
import { authUser } from '../backend/autharization';

function Routings({ handleMode }) {
  const [status, setStatus] = React.useState(false)
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(authUser, user => {
      if (user) {
        setStatus(true)
      } else {
        setStatus(false)
      }
    })

    return () => unsubscribe();
  })
  return (
    <>
      <Router>
        <Layout handleMode={handleMode}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route path='/guide' element={<Guide />} />
            <Route path='/contact' element={<Contact />} />
            {status ? <Route path='/dashboard' element={<Structure />} /> : <Route path='/' element={<Home />} />}
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default Routings;