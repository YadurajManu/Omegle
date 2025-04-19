import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <div className="hero-container">
      <nav className="hero-nav">
        <div className="hero-logo">
          <div className="logo-text">omegle</div>
          <div className="logo-dot"></div>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="#login" className="nav-button">Log in</a>
        </div>
      </nav>

      <div className="hero-content">
        <div className="badge-container">
          <div className="badge">New</div>
          <div className="badge-text">Introducing enhanced video chat experience</div>
        </div>
        <h1 className="hero-title">
          Connect with <span className="highlight">strangers</span> in random video chats
        </h1>
        <p className="hero-subtitle">
          Meet new people from around the world in secure, high-quality video calls. No account needed, just click and connect with someone new instantly.
        </p>
        <div className="hero-cta">
          <button className="start-button">
            Start chatting now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="stats">
            <div className="stat">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Daily users</div>
            </div>
            <div className="stat">
              <div className="stat-number">190+</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-element visual-circle-1"></div>
        <div className="visual-element visual-circle-2"></div>
        <div className="visual-element visual-diamond"></div>
        <div className="visual-element visual-line-1"></div>
        <div className="visual-element visual-line-2"></div>
        <div className="mockup">
          <div className="video-container">
            <div className="video-placeholder">
              <div className="video-person"></div>
            </div>
            <div className="video-ui">
              <div className="video-controls">
                <div className="video-control-item camera">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L20 7V17L15 14M4 7H15V17H4C2.9 17 2 16.1 2 15V9C2 7.9 2.9 7 4 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="video-control-item mic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1C10.9 1 10 1.9 10 3V13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13V3C14 1.9 13.1 1 12 1Z" fill="white"/>
                    <path d="M17.3 11C17.3 14.2 14.76 16.8 11.65 16.97V20H12.35V16.97C15.45 16.8 18 14.2 18 11V10H17.3V11ZM6 10V11C6 14.2 8.55 16.8 11.65 16.97V20H12.35V16.97C9.24 16.8 6.7 14.2 6.7 11V10H6Z" fill="white"/>
                  </svg>
                </div>
                <div className="video-control-item end-call">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM17 15.9L15.9 17L12 13.1L8.1 17L7 15.9L10.9 12L7 8.1L8.1 7L12 10.9L15.9 7L17 8.1L13.1 12L17 15.9Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Hero 