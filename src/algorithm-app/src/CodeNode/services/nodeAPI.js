import axios from 'axios';

export const fetchNode = async (id) => {
  const response = await axios.get(`/api/nodes/${id}`);
  return response.data;
};

export const fetchNodeChildren = async (id) => {
  const response = await axios.get(`/api/nodes/${id}/children`);
  return response.data;
};

export const fetchNodePath = async (id) => {
  const response = await axios.get(`/api/nodes/${id}/path`);
  return response.data.reverse(); // Move the reverse logic here
};

export const fetchNodeTree = async (id, depth = 4) => {
  const response = await axios.get(`/api/nodes/${id}/tree`, {
    params: { depth }
  });
  return response.data;
};

export const fetchAllNodeData = async (id) => {
  const [node, children, path, tree] = await Promise.all([
    fetchNode(id),
    fetchNodeChildren(id),
    fetchNodePath(id),
    fetchNodeTree(id)
  ]);
  return { node, children, path, tree };
};

export const completeNode = async (nodeId, score) => {
  try {
    const response = await axios.post(`/api/nodes/${nodeId}/complete`, {
      completedScore: score
    });
    return response.data;
  } catch (error) {
    console.error("Error in completeNode:", error.message);
    throw new Error(`Failed to complete node: ${error.response?.data?.message || error.message}`);
  }
};

export const createChildNodes = async (parentId, title, content) => {
  try {
    const request1 = axios.post('/api/nodes', {
      parent_id: parseInt(parentId),
      title, 
      content, 
      statementTrueFalseFlag: 1
    });

    const request2 = axios.post('/api/nodes', {
      parent_id: parseInt(parentId),
      title, 
      content, 
      statementTrueFalseFlag: 0
    });

    await Promise.all([request1, request2]);
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
};