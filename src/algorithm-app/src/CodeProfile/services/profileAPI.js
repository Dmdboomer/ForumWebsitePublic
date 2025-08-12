import axios from "axios";
// src/api/savedNodesAPI.js
export const fetchSavedNodes = async () => {
  try {
    const response = await axios.post(`/api/saved`, {
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

export const saveNode = async ( nodeId) => {
  try {
    const response = await axios.post(`/api/save`, { node_id: nodeId }, {
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

export const unSaveNode = async ( nodeId) => {
  try {
    const response = await axios.post(`/api/unsave/`, { node_id: nodeId}, {
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
}

export const isNodeSaved = async ( nodeId) => {
  try {
    const response = await axios.post(`/api/is-saved`, { node_id: nodeId }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data.isSaved;
  } catch (error) {
    console.error('Error checking saved status:', error);
    return false;
  }
};