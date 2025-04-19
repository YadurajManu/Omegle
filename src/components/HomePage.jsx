import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../firebase';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logOut();
    window.location.href = '/login';
  };

  return (
    <div className="homepage-container">
      <nav className="homepage-nav">
        <div className="logo">
          <div className="logo-text">omegle</div>
          <div className="logo-dot"></div>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/profile')} className="profile-button">My Profile</button>
          <button onClick={handleLogout} className="logout-button">Log out</button>
        </div>
      </nav>

      <div className="homepage-content">
        <h1>Welcome to Omegle</h1>
        <p className="welcome-message">
          You have successfully logged in! Connect with random strangers through video chat or update your profile.
        </p>
        <div className="actions-container">
          <button 
            className="action-button primary" 
            onClick={() => navigate('/video-chat')}
          >
            Start Video Chat
          </button>
          <button className="action-button secondary">Browse Rooms</button>
        </div>
        
        <div className="profile-cta">
          <h2>Complete Your Profile</h2>
          <p>Set up your profile to get the best experience and connect with like-minded people.</p>
          <button onClick={() => navigate('/profile')} className="profile-cta-button">
            Edit Profile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div className="video-chat-cta">
          <h2>Random Video Chat</h2>
          <p>Connect with random strangers from around the world through real-time video chat.</p>
          <button onClick={() => navigate('/video-chat')} className="video-cta-button">
            Start Video Chat
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 