import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import Login from './components/Login'
import './App.css'

// Main landing page component that combines Hero, Features, and HowItWorks
const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <HowItWorks />
    <Footer />
  </>
)

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
