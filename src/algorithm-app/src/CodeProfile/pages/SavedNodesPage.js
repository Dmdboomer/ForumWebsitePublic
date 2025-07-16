// src/components/SavedNodesPage/SavedNodesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';
import { fetchSavedNodes, saveNode } from '../services/profileAPI';

const SavedNodesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedNodes, setSavedNodes] = useState([]);
  const [newNodeId, setNewNodeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.UUID) {
      fetchSavedNodesList();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedNodesList = async () => {
    try {
      const data = await fetchSavedNodes(user.UUID);
      setSavedNodes(data.map(item => item.node_id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNodeId.trim()) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await saveNode(user.UUID, newNodeId.trim());
      await fetchSavedNodesList();
      setNewNodeId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNodeClick = (nodeId) => {
    navigate(`/node/${nodeId}`);
  };

  if (!user) return <p>Please log in to view saved nodes</p>;
  if (loading) return <p>Loading saved nodes...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Saved Nodes</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        {savedNodes.length > 0 ? (
          <ul className="divide-y divide-gray-200 border rounded-lg">
            {savedNodes.map((nodeId, index) => (
              <li 
                key={index} 
                onClick={() => handleNodeClick(nodeId)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                {nodeId}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No saved nodes found</p>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newNodeId}
            onChange={(e) => setNewNodeId(e.target.value)}
            placeholder="Enter node ID to save"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={saving}
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavedNodesPage;