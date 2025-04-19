import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, getUserProfile, updateUserProfile } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: '',
    gender: '',
    birthdate: '',
    phoneNumber: '',
    interests: [],
    photoURL: '',
    createdAt: null,
    lastLogin: null
  });
  const [newInterest, setNewInterest] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (uid) => {
    setLoading(true);
    try {
      const result = await getUserProfile(uid);
      if (result.success) {
        setProfile({
          ...profile,
          ...result.data,
          // Convert empty values to empty strings
          displayName: result.data.displayName || '',
          username: result.data.username || '',
          bio: result.data.bio || '',
          location: result.data.location || '',
          gender: result.data.gender || '',
          birthdate: result.data.birthdate || '',
          phoneNumber: result.data.phoneNumber || '',
          interests: result.data.interests || [],
          photoURL: result.data.photoURL || '',
          createdAt: result.data.createdAt || null,
          lastLogin: result.data.lastLogin || null
        });
      } else {
        setMessage({
          text: 'Failed to load profile: ' + result.error,
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred: ' + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleInterestAdd = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleInterestRemove = (interest) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interest)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await updateUserProfile(user.uid, {
        displayName: profile.displayName,
        username: profile.username,
        bio: profile.bio,
        location: profile.location,
        gender: profile.gender,
        birthdate: profile.birthdate,
        phoneNumber: profile.phoneNumber,
        interests: profile.interests,
        photoURL: profile.photoURL
      });

      if (result.success) {
        setMessage({
          text: 'Profile updated successfully!',
          type: 'success'
        });
      } else {
        setMessage({
          text: 'Failed to update profile: ' + result.error,
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred: ' + error.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-sidebar">
        <div className="profile-avatar-container">
          <div 
            className="profile-avatar" 
            style={{ backgroundImage: profile.photoURL ? `url(${profile.photoURL})` : 'none' }}
          >
            {!profile.photoURL && profile.displayName && profile.displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{profile.displayName || 'Your Name'}</h2>
          <p className="profile-username">@{profile.username || 'username'}</p>
        </div>
        
        <div className="profile-nav">
          <button 
            className={`profile-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            <span>Personal Info</span>
          </button>
          
          <button 
            className={`profile-nav-item ${activeTab === 'interests' ? 'active' : ''}`}
            onClick={() => setActiveTab('interests')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
            </svg>
            <span>Interests</span>
          </button>
          
          <button 
            className={`profile-nav-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06C19.72 10.55 20.16 9.95 20.47 9.28C20.01 8.58 19.44 7.97 18.8 7.45C18.33 8.02 17.76 8.51 17.13 8.9C16.69 8.16 16.15 7.5 15.54 6.93C15.65 6.38 15.71 5.82 15.71 5.25C15.71 4.97 15.69 4.69 15.66 4.42C15.91 4.33 16.18 4.26 16.45 4.22C15.43 2.85 14.03 1.77 12.43 1.17C12.21 1.1 11.98 1.04 11.75 1C11.61 1.83 11.5 2.66 11.44 3.5C10.72 3.17 9.96 2.95 9.17 2.85C8.6 2.09 7.93 1.41 7.18 0.85C6.22 1.21 5.33 1.71 4.54 2.34C4.91 3.1 5.38 3.8 5.95 4.4C5.32 4.82 4.76 5.34 4.3 5.93C3.55 6.07 2.81 6.31 2.1 6.63C1.89 7.42 1.77 8.22 1.77 9.05C1.77 9.65 1.84 10.24 1.96 10.81C2.73 11.04 3.54 11.15 4.36 11.15C4.86 11.15 5.33 11.1 5.8 11.01C5.65 11.54 5.58 12.09 5.58 12.67C5.58 13.52 5.76 14.32 6.09 15.07C5.4 15.67 4.81 16.37 4.34 17.14C4.81 18.07 5.44 18.92 6.18 19.64C6.82 19.07 7.38 18.42 7.85 17.7C8.53 18.33 9.32 18.84 10.2 19.19C10.11 20.03 10.11 20.89 10.21 21.73C11.09 22.04 12.02 22.21 13 22.21C13.3 22.21 13.59 22.19 13.88 22.15C14.01 21.25 14.06 20.34 14.01 19.42C14.9 19.27 15.73 18.98 16.48 18.57C17.11 19.14 17.83 19.6 18.61 19.95C19.31 19.29 19.9 18.5 20.34 17.62C19.54 17.05 18.66 16.61 17.73 16.31C17.82 15.8 17.87 15.26 17.87 14.71C17.87 14.05 17.8 13.38 17.66 12.74C18.63 12.31 19.52 11.73 20.29 11.04L19.14 12.94ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" fill="currentColor"/>
            </svg>
            <span>Account</span>
          </button>
          
          <button 
            className="profile-nav-item back-button"
            onClick={() => navigate('/home')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your personal information and account settings</p>
        </div>
        
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form className="profile-form" onSubmit={handleSubmit}>
          {activeTab === 'personal' && (
            <div className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="displayName">Full Name</label>
                  <input 
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea 
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input 
                    type="text"
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select 
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthdate">Birthdate</label>
                  <input 
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={profile.birthdate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input 
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="photoURL">Profile Photo URL</label>
                <input 
                  type="url"
                  id="photoURL"
                  name="photoURL"
                  value={profile.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <small className="input-hint">Enter the URL of your profile picture</small>
              </div>
            </div>
          )}
          
          {activeTab === 'interests' && (
            <div className="profile-section">
              <h2 className="section-title">Your Interests</h2>
              <p className="section-description">
                Add your interests to help us match you with like-minded people.
              </p>
              
              <div className="interests-container">
                {profile.interests.length > 0 ? (
                  <div className="interests-list">
                    {profile.interests.map((interest, index) => (
                      <div key={index} className="interest-tag">
                        <span>{interest}</span>
                        <button 
                          type="button" 
                          onClick={() => handleInterestRemove(interest)}
                          className="remove-interest"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-interests">You haven't added any interests yet.</p>
                )}
                
                <div className="add-interest-form">
                  <div className="form-group interest-input-group">
                    <input 
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add a new interest"
                    />
                    <button 
                      type="button" 
                      className="add-interest-btn"
                      onClick={handleInterestAdd}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="profile-section">
              <h2 className="section-title">Account Information</h2>
              
              <div className="account-info">
                <div className="account-info-item">
                  <div className="account-info-label">Email Address</div>
                  <div className="account-info-value">{user?.email}</div>
                </div>
                
                <div className="account-info-item">
                  <div className="account-info-label">Account Created</div>
                  <div className="account-info-value">
                    {profile.createdAt && profile.createdAt.seconds ? 
                      new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                
                <div className="account-info-item">
                  <div className="account-info-label">Last Login</div>
                  <div className="account-info-value">
                    {profile.lastLogin && profile.lastLogin.seconds ? 
                      new Date(profile.lastLogin.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>These actions are irreversible. Please be careful.</p>
                
                <div className="danger-buttons">
                  <button 
                    type="button" 
                    className="danger-button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset your profile? This will clear all your personal information.')) {
                        // Reset profile function would go here
                        setMessage({
                          text: 'This feature is not yet implemented.',
                          type: 'error'
                        });
                      }
                    }}
                  >
                    Reset Profile
                  </button>
                  
                  <button 
                    type="button" 
                    className="danger-button delete-account"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Delete account function would go here
                        setMessage({
                          text: 'This feature is not yet implemented.',
                          type: 'error'
                        });
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="save-profile-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 