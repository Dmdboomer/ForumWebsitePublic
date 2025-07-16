// src/components/SettingsContent.jsx
import React from 'react';
import {useTheme} from '../context/ThemeContext'
import '../nonGlobalStyles/Settings.css';

const SettingsContent = ({ activeTab }) => {
  const { currentTheme, setTheme, isLoading } = useTheme();

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
                <option>Dashboard</option>
                <option>Projects</option>
                <option>Activity</option>
              </select>
            </div>
            <div className="settings-item">
              <label>Time Zone</label>
              <select>
                <option>(UTC-05:00) Eastern Time</option>
                <option>(UTC-08:00) Pacific Time</option>
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
              <input type="email" defaultValue="user@example.com" />
            </div>
            <div className="settings-item">
              <label>Password</label>
              <input type="password" placeholder="Change password" />
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div>
            <h2>Privacy Settings</h2>
            <p>Control your data privacy and sharing preferences</p>
            <div className="settings-item">
              <label>Data Sharing</label>
              <input type="checkbox" id="data-sharing" />
              <label htmlFor="data-sharing">Allow anonymous usage data collection</label>
            </div>
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