import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Products from './pages/Products';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  )
}

export default App