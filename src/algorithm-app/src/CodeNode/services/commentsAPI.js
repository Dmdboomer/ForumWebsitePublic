// src/services/commentsAPI.js
import axios from 'axios';

export const fetchComments = async (nodeId) => {
  try {
    const response = await axios.get(`/api/nodes/${nodeId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network response was not ok');
  }
};

export const refreshComments = async (nodeId) => {
  try {
    const response = await axios.get(`/api/nodes/${nodeId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to refresh comments');
  }
};

export const createComment = async (nodeId, content, proStatus) => {
  try {
    const response = await axios.post(`/api/nodes/${nodeId}/comments`, 
      { content, proStatus },
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};

export const endorseComment = async (nodeId, commentId) => {
  try {
    const response = await axios.post(
      `/api/nodes/${nodeId}/comments/${commentId}/endorse`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Endorse error:', error);
    throw new Error(error.response?.data?.message || 'Failed to endorse comment');
  }
};

export const reportComment = async (nodeId, commentId) => {
  try {
    const response = await axios.post(
      `/api/nodes/${nodeId}/comments/${commentId}/report`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Report error:', error);
    throw new Error(error.response?.data?.message || 'Failed to report comment');
  }
};

export const unendorseComment = async (nodeId, commentId) => {
  try {
    const response = await axios.post(
      `/api/nodes/${nodeId}/comments/${commentId}/unendorse`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('unendorse error:', error);
    throw new Error(error.response?.data?.message || 'Failed to unendorse comment');
  }
};

export const unreportComment = async (nodeId, commentId) => {
  try {
    const response = await axios.post(
      `/api/nodes/${nodeId}/comments/${commentId}/unreport`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Report error:', error);
    throw new Error(error.response?.data?.message || 'Failed to unreport comment');
  }
};