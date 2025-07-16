// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import RootsPage from './CodeRoot/pages/RootsPage';
import NodePage from './CodeNode/pages/NodePage';
import CreateTopic from './CodeRoot/components/CreateTopic';
import CreateChild from './CodeNode/components/CreateChild';
import UserProfilePage from './CodeProfile/UserProfilePage';
import Welcome from './CodeStatic/Welcome';
import Help from './CodeStatic/Help';
import About from './CodeStatic/About';
import SettingsPage from './CodeSettings/pages/Settings';

import PrivateRoute from './CodeLoginAuth/components/PrivateRoute';
import LandingPage from './CodeStatic/LandingPage';
//import LoginPage from './pages/LoginSignupPages/LoginPage';
//import SignupPage from './pages/LoginSignupPages/SignupPage';
import DashboardPage from './CodeLoginAuth/pages/DashboardPage';
import AuthPage from './CodeLoginAuth/pages/AuthPage';
import SearchResultsPage from './CodeHome/SearchResultPage';
import SavedNodesPage from './CodeProfile/pages/SavedNodesPage';

import { ThemeProvider } from './CodeSettings/context/ThemeContext';
import './CodeCSS/App.css'

function App() {
  return (
    <Router>
      <ThemeProvider>
      <div className="container mt-4">
        <Routes>
          <Route path="/node/:id" element={<NodePage />} />

          <Route path="/" element={<RootsPage />} /> 

          <Route path="/topics/new" element={<CreateTopic />} />
          <Route path="/node/:id/newnode" element={<CreateChild />} />
          
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/loginSignupPage" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path = "/search" element ={<SearchResultsPage />} />
          <Route path = "saved" element ={<SavedNodesPage/>} />
        </Routes>
      </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;