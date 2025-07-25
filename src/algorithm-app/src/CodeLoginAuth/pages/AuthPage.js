// src/components/AuthPage/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../services/auth';
import '../../CodeCSS/AuthPage.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const AuthPage = () => {
  const isProduction = process.env.REACT_APP_ENV === 'production';



  const clientId = isProduction ? process.env.REACT_APP_GOOGLE_CLIENT_ID_PROD : process.env.REACT_APP_GOOGLE_CLIENT_ID_DEV;
  const location = window.location.pathname;
  const [authType, setAuthType] = useState(location.includes('signup') ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loginWithGoogle } = useAuth();

  const switchAuthType = (type) => {
    setAuthType(type);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser(name, email, password);
      switchAuthType('login');
      setError('Signup successful! Please login.');
    } catch (err) {
      console.error("Signup Error:", err.message, err.stack);
      setError('Email already exists. Please use another email.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (error) {
      setError('Google login failed XD');
      console.log(error)
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form">
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${authType === 'login' ? 'active' : ''}`}
            onClick={() => switchAuthType('login')}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${authType === 'signup' ? 'active' : ''}`}
            onClick={() => switchAuthType('signup')}
          >
            Sign Up
          </button>
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed LOL')}
              useOneTap
              size="large"
              text="signin_with"
              theme="filled_blue"
            />
          </GoogleOAuthProvider>
        </div>

        {error && (
          <p className={`auth-message ${error.includes('successful') ? 'success' : 'error'}`}>
            {error}
          </p>
        )}

        {authType === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;