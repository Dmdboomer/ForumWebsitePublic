// topicApi.js
import axios from 'axios';


export const createTopic = async (title, content, UUID) => {
  try {
    const response = await axios.post(
      `/api/roots`,
      { title, content, UUID},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoots = async (id) => {
  try {
    const response = await fetch(`/api/roots/${id}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching root nodes:', error);
    return [];
  }
};