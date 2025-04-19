import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-logo">
          <span className="logo-text">cupid</span>
          <div className="logo-dot"></div>
        </div>
        <h1 className="hero-title">Connect with someone new</h1>
        <p className="hero-subtitle">Anonymous video chats with people around the world</p>
        <button className="start-button">
          Start Chatting
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div className="hero-visual">
        <div className="visual-element visual-circle"></div>
        <div className="visual-element visual-square"></div>
        <div className="visual-element visual-line"></div>
      </div>
    </div>
  )
}

export default Hero 