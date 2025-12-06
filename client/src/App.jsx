import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>App</div>} />
        <Route path="/about" element={<div>About</div>} />
        
      </Routes>
    </Router>
  )
}

export default App