import axios from 'axios';

export const updateThemePreference = async (themeName) => {
  try {
    await axios.post('/api/theme', { themeName }, { 
      withCredentials: true,
      timeout: 5000 // Add timeout
    });
  } catch (error) {
    throw new Error(`Theme update failed: ${error.response?.data?.error || error.message}`);
  }
};

// options: 'light', 'dark', 'blue', 'contrast'
export const fetchUserTheme = async () => {
  const response = await axios.get('/api/theme', {
    withCredentials: true
  });
  return response.data.theme;
};