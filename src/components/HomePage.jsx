import React from 'react';
import { logOut } from '../firebase';
import './HomePage.css';

const HomePage = () => {
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
          <button onClick={handleLogout} className="logout-button">Log out</button>
        </div>
      </nav>

      <div className="homepage-content">
        <h1>Welcome to Omegle</h1>
        <p className="welcome-message">
          You have successfully logged in! This is a dummy homepage. 
          In a real application, you would see your chat interface here.
        </p>
        <div className="actions-container">
          <button className="action-button primary">Start Chatting</button>
          <button className="action-button secondary">Browse Rooms</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 