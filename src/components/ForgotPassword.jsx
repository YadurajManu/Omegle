import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordReset } from '../firebase';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setIsSuccess(true);
        setMessage('Password reset email sent! Check your inbox.');
      } else {
        setIsSuccess(false);
        setMessage(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Link to="/login" className="back-to-login">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Login
      </Link>
      
      <div className="forgot-password-background">
        <div className="forgot-bg-circle forgot-bg-circle-1"></div>
        <div className="forgot-bg-circle forgot-bg-circle-2"></div>
      </div>
      
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo">
            <div className="logo-text">omegle</div>
            <div className="logo-dot"></div>
          </div>
          <h2 className="forgot-password-title">Reset Your Password</h2>
          <p className="forgot-password-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
              </svg>
              <input 
                type="email" 
                id="email" 
                placeholder="your.email@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="reset-button" disabled={loading || isSuccess}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="login-link">
            <Link to="/login">Return to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 