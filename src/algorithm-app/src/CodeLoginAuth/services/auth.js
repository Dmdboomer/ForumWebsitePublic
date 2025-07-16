import axios from 'axios';

// Session check
export const checkSession = async () => {
  try {
    const response = await axios.get('/api/user', { withCredentials: true });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status !== 200) {
      throw new Error('Not authenticated');
    }
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/login', { email, password }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status !== 200) {
      throw new Error('Login failed');
    }
    throw error;
  }
};

// Signup
export const signupUser = async (name, email, password) => {
  try {
    const response = await axios.post('/api/signup', { name, email, password }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    if (response.status !== 201) {
      throw new Error(response.data.error || 'Signup failed');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Signup failed');
    }
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await axios.post('/api/logout', {}, {
      withCredentials: true
    });
    if (response.status !== 200) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    if (!error.response || error.response.status !== 200) {
      throw new Error('Logout failed');
    }
    throw error;
  }
};

// Dashboard data
export const getDashboardData = async () => {
  try {
    const response = await axios.get('/dashboard', { withCredentials: true });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status !== 200) {
      throw new Error('Failed to fetch dashboard data');
    }
    throw error;
  }
};

// Google login
export const loginWithGoogleAPI = async (token) => {
  try {
    const response = await axios.post('/api/auth/google', { token }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (!error.response || error.response.status !== 200) {
      throw new Error('Google login failed');
    }
    throw error;
  }
};