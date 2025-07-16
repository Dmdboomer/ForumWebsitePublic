import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkSession, loginUser, logoutUser, loginWithGoogleAPI } from '../services/auth'; // Add logoutUser import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track authentication errors

  // Initialize session on app load
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component
    
    const initializeAuth = async () => {
      try {
        const userData = await checkSession();
        if (isMounted) setUser(userData);
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setError('Session validation failed');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  // Handle login with proper error handling
  const login = async (email, password) => {
    setLoading(true); // Set loading during login process
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setError(null); // Clear previous errors
      return userData; // Return data for redirection
    } catch (err) {
      setError('Login failed. Check credentials');
      throw err; // Rethrow for UI handling
    } finally {
      setLoading(false);
    }
  };

  // Add logout functionality
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (token) => {
    setLoading(true);
    try {
      const userData = await loginWithGoogleAPI(token);
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      setError('Google login failed BRUH');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, loginWithGoogle, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);