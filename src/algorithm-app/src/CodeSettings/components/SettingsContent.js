// src/components/SettingsContent.jsx
import React from 'react';
import {useTheme} from '../context/ThemeContext'
import '../nonGlobalStyles/Settings.css';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';

const SettingsContent = ({ activeTab }) => {
  const { currentTheme, setTheme, isLoading } = useTheme();
  const{user} = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h2>General Settings</h2>
            <p>Application preferences and basic configurations</p>
            <div className="settings-item">
              <label>Default View</label>
              <select>
                <option>Home</option>
              </select>
            </div>
            <div className="settings-item">
              <label>Time Zone</label>
              <select>
                <option>(UTC+08:00) China Time</option>
              </select>
            </div>
          </div>
        );
      
      case 'account':
        return (
          <div>
            <h2>Account Settings</h2>
            <p>Manage your account information</p>
            <div className="settings-item">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder={user ? user.email || 'please login' : 'please login'}
                disabled 
              />
            </div>
            <div className="settings-item">
              <label>Password</label>
              <input type="password" placeholder="Change password" disabled/>
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div>
            <h2>Privacy Settings</h2>
            <p>Control your data privacy and sharing preferences</p>
          </div>
        );
      
      case 'display':
    return (
      <div className="settings-item">
        <label>Theme</label>
            <select
              value={currentTheme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
              disabled={isLoading}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="blue">Ocean Blue</option>
              <option value="contrast">High Contrast</option>
            </select>
      </div>
    );
      
      // Add similar cases for other tabs
      case 'notifications':
        return <h2>Notification Settings - Configure alerts and messages</h2>;
      case 'language':
        return <h2>Language Settings - Choose your preferred language</h2>;
      case 'accessibility':
        return <h2>Accessibility Settings - Screen reader and keyboard options</h2>;
      case 'billing':
        return <h2>Billing Settings - Manage subscriptions and payments</h2>;
      default:
        return <h2>Select a settings category</h2>;
    }
  };

  return (
    <div className="settings-content">
      {renderContent()}
      <div className="settings-footer">
        <button className="cancel-button">Cancel</button>
        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
};

export default SettingsContent;