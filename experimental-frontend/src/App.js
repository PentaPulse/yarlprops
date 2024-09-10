import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signin from './components/Signin';
import MarketingPage from './pages/MarketingPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/signin' element={<Signin />} />
          <Route path='/' element={<MarketingPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
