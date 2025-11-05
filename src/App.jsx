import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import Frontpage from './components/Frontpage'
import './style/Frontpage.css'


function App() {

  return (
     <>
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />

      </Routes>
    </Router>
    
      
    </>
  )
}

export default App
