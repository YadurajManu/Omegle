import React from 'react';
import './LoadingFallback.css';

const LoadingFallback = () => {
  return (
    <div className="loading-fallback">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading</h2>
        <p>Please wait while we connect you...</p>
      </div>
    </div>
  );
};

export default LoadingFallback; 