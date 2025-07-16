import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserTheme, updateThemePreference } from '../services/themeAPI'; // Adjust path as needed
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [themeOptions] = useState([
    'light', 
    'dark', 
    'blue', 
    'contrast'
    // Add new themes here in the future
  ]);

  useEffect(() => {
    let isMounted = true;
    
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        const localTheme = localStorage.getItem('theme');
        const serverTheme = isLoggedIn ? await fetchUserTheme() : null;
        const theme = serverTheme || localTheme || getSystemTheme();
        
        if (isMounted) {
          applyThemeToDocument(theme);
          setCurrentTheme(theme);
          localStorage.setItem('theme', theme);
        }
      } catch (err) {
        console.error('Theme load error:', err);
        if (isMounted) applyThemeToDocument('light');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTheme();

    return () => { isMounted = false };
  }, [isLoggedIn]); // 👈 Re-run when login status changes

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  const applyThemeToDocument = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  };

  const setTheme = async (themeName) => {
    if (!themeOptions.includes(themeName)) return;
    
    // Apply immediately to DOM first
    applyThemeToDocument(themeName); // 👈 DOM update FIRST
    setCurrentTheme(themeName);       // 👈 State update SECOND
    localStorage.setItem('theme', themeName);
    
    try {
      await updateThemePreference(themeName);
    } catch (err) {
      console.error('Theme sync failed:', err);
      // Optional: Revert to previous theme on error
    }
  };

  // To add new themes dynamically (call this in settings UI)
  const addThemeOption = (newTheme) => {
    if (!themeOptions.includes(newTheme)) {
      themeOptions.push(newTheme);
      // In real app, you'd trigger a state update here
    }
  };

  const value = {
    currentTheme,
    setTheme,
    isLoading,
    themeOptions,
    addThemeOption // For future theme expansions
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};