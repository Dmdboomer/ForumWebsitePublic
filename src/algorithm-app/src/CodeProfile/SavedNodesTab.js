import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../CodeLoginAuth/context/AuthContext';
import { fetchSavedNodes, saveNode, unSaveNode } from './services/profileAPI';

const SavedNodesTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedNodes, setSavedNodes] = useState([]);
  const [newNodeId, setNewNodeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsaving, setUnsaving] = useState({}); // Track unsaving state per node
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
      const data = await fetchSavedNodes();
      // Store nodes as objects with node_id property
      setSavedNodes(data);
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
      await saveNode( newNodeId.trim());
      // Refresh the list after saving
      await fetchSavedNodesList();
      setNewNodeId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add unsave functionality
  const handleUnsave = async (nodeId) => {
    setUnsaving(prev => ({ ...prev, [nodeId]: true }));
    setError(null);
    
    try {
      await unSaveNode( nodeId);
      // Optimistically update UI without refetching
      setSavedNodes(prev => prev.filter(item => item.node_id !== nodeId));
    } catch (err) {
      setError(`Failed to unsave node: ${err.message}`);
      console.error('Unsave error:', err);
    } finally {
      setUnsaving(prev => {
        const newState = { ...prev };
        delete newState[nodeId];
        return newState;
      });
    }
  };

  const handleNodeClick = (nodeId) => {
    navigate(`/node/${nodeId}`);
  };

  if (!user) return <p className="p-4 text-center">Please log in to view saved nodes</p>;
  if (loading) return <p className="p-4 text-center">Loading saved nodes...</p>;

  return (
    <div className="saved-nodes-tab">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <h3 className="p-4 border-b">Your Saved Nodes</h3>
      
      <div className="saved-nodes-list">
        {savedNodes.length > 0 ? (
          <ul className="divide-y">
            {savedNodes.map((item) => (
              <li 
                key={item.node_id}
                className="p-4 hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center"
              >
                <span 
                  onClick={() => handleNodeClick(item.node_id)}
                  className="cursor-pointer flex-grow hover:text-blue-600"
                >
                  {item.node_id}
                </span>
                <button
                  onClick={() => handleUnsave(item.node_id)}
                  disabled={unsaving[item.node_id]}
                  className="ml-4 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                >
                  {unsaving[item.node_id] ? 'Removing...' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No saved nodes found</p>
        )}
      </div>
      
      <div className="p-4 bg-gray-50">
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

export default SavedNodesTab;