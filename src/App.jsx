import React from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default App
