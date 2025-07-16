import React from 'react';
import Dashboard from '../pages/Dashboard';
import Header from '../../CodeLoginAuth/components/Header';
import '../../CodeCSS/App.css';

export default function DashboardComponent({ 
  dashboardOpen, 
  handleHoverEnter, 
  handleHoverLeave, 
  handleDashboardEnter, 
  handleDashboardLeave 
}) {
  return (
    <>
      <div 
        className="hamburger-icon" 
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        ☰
      </div>
      
      {dashboardOpen && (
        <div 
          className="dashboard-panel"
          onMouseEnter={handleDashboardEnter}
          onMouseLeave={handleDashboardLeave}
        >
          <Dashboard />
          <Header></Header>
        </div>
      )}
    </>
  );
}