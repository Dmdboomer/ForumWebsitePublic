import axios from "axios";
// src/api/savedNodesAPI.js
export const fetchSavedNodes = async (UUID) => {
  try {
    const response = await axios.post(`/api/saved`, { UUID }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Axios automatically parses the error response
      throw new Error(error.response.data.error || 'Failed to fetch saved nodes');
    } else {
      throw error;
    }
  }
};

export const saveNode = async (UUID, nodeId) => {
  try {
    const response = await axios.post(`/api/save`, { UUID, node_id: nodeId }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Saving failed');
    } else {
      throw error;
    }
  }
};