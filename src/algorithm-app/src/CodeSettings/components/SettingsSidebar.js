// src/components/SettingsSidebar.jsx
import React from 'react';
import '../nonGlobalStyles/Settings.css';

const SettingsSidebar = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="settings-sidebar">
      <div className="sidebar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;