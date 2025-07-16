import React from 'react';
import '../../CodeCSS/App.css'

const ActionButtons = ({ node, navigate, nodeId }) => (
  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
    <button 
      className="btn btn-secondary me-md-2" 
      onClick={() => navigate(`/node/${nodeId}/newnode`)}
    >
      Create New True/False Statement
    </button>
    
    {node.parent_id && (
      <button 
        className="btn btn-outline-secondary me-md-2" 
        onClick={() => navigate(`/node/${node.parent_id}`)}
      >
        Back to Parent
      </button>
    )}
    
    <button 
      className="btn btn-outline-info" 
      onClick={() => navigate('/')}
    >
      Back to Roots
    </button>
  </div>
);

export default ActionButtons;