// About.js
import React from 'react';
import { Link } from 'react-router-dom';
const About = () => {
  return (
    <div className="page-container">
      <h1 className="page-header">ℹ️ About Us</h1>
      
      <div className="about-content">
        <p>
          Welcome to our platform! We're dedicated to providing you with the best service 
          with a focus on reliability, customer service, and uniqueness.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          To simplify and enhance your digital experience through innovative solutions 
          that are both powerful and easy to use.
        </p>
        
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>N/A</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>ChatGPT</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍🎨</div>
            <h3>Deepseek</h3>
            <p>UI/UX Designer</p>
          </div>
        </div>
      </div>
      <Link to="/" className="dashboard-link">
          <span>back</span>
        </Link>
    </div>
  );
};

export default About;