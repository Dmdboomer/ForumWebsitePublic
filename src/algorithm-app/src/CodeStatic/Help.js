// Help.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const Help = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  
  const faqs = [
    {
      category: "Account",
      questions: [
        { q: "How do I reset my password?", a: "Visit the login page and click 'Forgot Password'." },
        { q: "Can I change my email address?", a: "Yes, in your profile settings under Account Information." }
      ]
    },
    {
      category: "Billing",
      questions: [
        { q: "When will I be charged?", a: "Subscriptions renew automatically at the end of each billing period." },
        { q: "How do I update payment method?", a: "Go to Settings > Billing > Payment Methods." }
      ]
    },
    {
      category: "Features",
      questions: [
        { q: "How do I use the dashboard?", a: "The dashboard provides quick access to all app features via the menu." },
        { q: "Where are my saved items?", a: "Saved items are available in the Collections section of your profile." }
      ]
    }
  ];

  return (
    <div className="page-container">
      <h1 className="page-header">❓ Help Center</h1>
      
      <div className="help-section">
        <h2>Frequently Asked Questions</h2>
        
        {faqs.map((category, index) => (
          <div key={index} className="faq-category">
            <div 
              className="faq-header" 
              onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
            >
              <h3>{category.category}</h3>
              <span>{activeCategory === category.category ? '▼' : '▶'}</span>
            </div>
            
            {activeCategory === category.category && (
              <div className="faq-questions">
                {category.questions.map((faq, qIndex) => (
                  <div key={qIndex} className="faq-item">
                    <h4>Q: {faq.q}</h4>
                    <p>A: {faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="contact-section">
        <h2>Still Need Help?</h2>
        <p>Contact our support team:</p>
        <div className="contact-options">
          <button className="contact-button">
            📧 Email Support
          </button>
          <button className="contact-button">
            💬 Live Chat
          </button>
          <button className="contact-button">
            📞 Call Us
          </button>
        </div>
        <Link to="/" className="dashboard-link">
          <span>back</span>
        </Link>
      </div>
    </div>
  );
};

export default Help;