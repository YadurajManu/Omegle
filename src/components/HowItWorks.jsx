import React from 'react'
import './HowItWorks.css'

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <h2 className="section-title">How it works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Allow camera access</h3>
              <p>Grant camera and microphone permissions when prompted</p>
            </div>
          </div>
          
          <div className="step-divider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Click "Start Chatting"</h3>
              <p>We'll instantly match you with someone to chat with</p>
            </div>
          </div>
          
          <div className="step-divider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Connect and chat</h3>
              <p>Meet someone new and start a conversation</p>
            </div>
          </div>
        </div>
        
        <div className="cta-container">
          <button className="cta-button">
            Start Chatting Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks 