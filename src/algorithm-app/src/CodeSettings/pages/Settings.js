// src/components/SettingsPage.jsx
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsContent from '../components/SettingsContent';
import '../nonGlobalStyles/Settings.css';


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'display', label: 'Display' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'language', label: 'Language' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'billing', label: 'Billing' }
  ];

  return (
    <div className="settings-page">
      <button 
          className="back-button"
          onClick={() => navigate('/')} // Navigate to home
        >
          ← Back to Home
        </button>
      <h1 className="settings-header">Settings</h1>
      <div className="settings-container">
        <SettingsSidebar 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <SettingsContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default SettingsPage;