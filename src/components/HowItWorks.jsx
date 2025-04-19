import React from 'react'
import './HowItWorks.css'

const HowItWorks = () => {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-header">
        <span className="section-tag">Simple Process</span>
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">Start video chatting in less than a minute with our streamlined process</p>
      </div>
      
      <div className="how-it-works-container">
        <div className="steps-flow">
          <div className="step-cards">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.2 4H18.8C20.0191 4 21 4.98095 21 6.2V17.8C21 19.019 20.0191 20 18.8 20H5.2C3.98095 20 3 19.019 3 17.8V6.2C3 4.98095 3.98095 4 5.2 4H8.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.5 4H12.5C13.3284 4 14 4.67157 14 5.5V6.5C14 7.32843 13.3284 8 12.5 8H11.5C10.6716 8 10 7.32843 10 6.5V5.5C10 4.67157 10.6716 4 11.5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9V13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Allow camera access</h3>
                <p>Grant camera and microphone permissions when prompted by your browser</p>
              </div>
            </div>
            
            <div className="step-connection">
              <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12H99M99 12L88 1M99 12L88 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Click "Start Chatting"</h3>
                <p>We'll instantly match you with someone new who's online and ready to chat</p>
              </div>
            </div>
            
            <div className="step-connection">
              <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12H99M99 12L88 1M99 12L88 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Connect and chat</h3>
                <p>Meet someone new and start a conversation – share interests, stories or simply say hello</p>
              </div>
            </div>
          </div>
          
          <div className="video-demo">
            <div className="video-card">
              <div className="video-screen">
                <div className="video-screen-content">
                  <div className="video-person-one"></div>
                  <div className="video-person-two"></div>
                </div>
                <div className="video-status connecting">Connecting...</div>
                <div className="video-status connected">Connected</div>
              </div>
              <div className="video-controls-demo">
                <div className="video-control camera-on"></div>
                <div className="video-control mic-on"></div>
                <div className="video-control share-screen"></div>
                <div className="video-control end-chat"></div>
              </div>
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
          <div className="cta-caption">No registration required • Start instantly</div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks 