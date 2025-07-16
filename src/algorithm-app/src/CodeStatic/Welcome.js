// Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to Our App!</h1>
        <p>Get started by exploring our features and services</p>
        
        <div className="welcome-features">
          <div className="feature">
            <div className="feature-icon">👤</div>
            <h3>Personal Profile</h3>
            <p>Manage your personal information and preferences</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">⚙️</div>
            <h3>App Settings</h3>
            <p>Customize your app experience</p>
          </div>
        </div>
        
        <Link to="/" className="cta-button">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Welcome;