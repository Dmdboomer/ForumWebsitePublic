import { useState, useRef } from 'react';
import '../../CodeCSS/App.css';

export default function useDashboardHover() {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const dashboardTimer = useRef(null);

  const handleHoverEnter = () => {
    clearTimeout(dashboardTimer.current);
    setDashboardOpen(true);
  };

  const handleHoverLeave = () => {
    dashboardTimer.current = setTimeout(() => {
      setDashboardOpen(false);
    }, 300);
  };

  const handleDashboardEnter = () => {
    clearTimeout(dashboardTimer.current);
  };

  const handleDashboardLeave = () => {
    dashboardTimer.current = setTimeout(() => {
      setDashboardOpen(false);
    }, 300);
  };

  return {
    dashboardOpen,
    handleHoverEnter,
    handleHoverLeave,
    handleDashboardEnter,
    handleDashboardLeave
  };
}