import React from 'react';
import { Link } from 'react-router-dom';
import '../../CodeCSS/DashboardPage.css';

const Dashboard = () => {
  const menuItems = [
    { path: "/", icon: "🏠", label: "Home", className: "dashboard-link landing-page" },
    { path: "/profile", icon: "👤", label: "Profile" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
    { path: "/about", icon: "ℹ️", label: "About Us" },
    { path: "/help", icon: "❓", label: "Help" }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h3>Menu</h3>
      </header>

      <nav>
        <ul className="dashboard-links">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={item.className || "dashboard-link"}
              >
                <span className="link-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;