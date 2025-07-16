import React from 'react';
import DashboardComponent from '../../CodeDashboard/components/DashboardComponent';

const LoadingState = ({ dashboardOpen }) => (
  <div className="page-container">
    <DashboardComponent 
      dashboardOpen={dashboardOpen}
      // Pass handlers as needed or adjust if they're not used
    />
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading root nodes...</p>
    </div>
  </div>
);

export default LoadingState;