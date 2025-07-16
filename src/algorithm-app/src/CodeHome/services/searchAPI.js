import axios from 'axios';

export const searchAPI = {
  performSearch: async (term, startDate, endDate) => {
    try {
      if (!term?.trim()) throw new Error('Search term is required');
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL || window.location.origin;
      const url = `${baseUrl}/api/search`;
      
      const params = {
        term: encodeURIComponent(term.trim())
      };
      
      if (startDate && !isNaN(new Date(startDate).getTime())) {
        params.startDate = new Date(startDate).toISOString();
      }
      if (endDate && !isNaN(new Date(endDate).getTime())) {
        params.endDate = new Date(endDate).toISOString();
      }

      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
};