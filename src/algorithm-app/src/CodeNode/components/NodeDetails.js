// NodeDetails.js
import React, { useState, useEffect } from 'react';
import ScoreBar from '../../utils/visuals/ScoreBar';
import '../nonGlobalStyle/NodeDetails.css';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';
import { saveNode, unSaveNode, isNodeSaved } from '../../CodeProfile/services/profileAPI'; // Import APIs


const NodeDetails = ({ node}) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const UUID = user?.UUID;

  // Check if node is already bookmarked
  useEffect(() => {
    if (UUID && node?.id) {
      isNodeSaved( node.id)
        .then(saved => setIsBookmarked(saved))
        .catch(console.error);
    }
  }, [UUID, node?.id]);

  const toggleBookmark = async () => {
    if (!user) return;
    try {
      if (isBookmarked) {
        await unSaveNode( node.id);
      } else {
        await saveNode( node.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  return (
  <div className="node-detail mb-4">
    <button 
        onClick={toggleBookmark}
        className="bookmark-btn"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          color: isBookmarked ? '#f0ac29' : '#ccc'
        }}
        title={isBookmarked ? "Remove bookmark" : "Bookmark this node"}
      >
        {isBookmarked ? '★' : '☆'}
      </button>
    <div className="card-body">
      <h1 className="card-title text-accent">
        {node.title || `Node ${node.id}`}: 
        {node.statementTrueFalseFlag === null
          ? " Current statement to Prove" 
          : node.statementTrueFalseFlag 
            ? " True" 
            : " False"
        }
      </h1>
      <p className="lead text-secondary">Explanation: {node.content}</p>
      <p className="lead text-secondary">Popularity: {node.popularity}</p>
      <p className="lead text-secondary">You are: {user?.username || 'Guest'}</p>
      <p className="lead text-secondary">Likes: {node.likes}</p>
      <ScoreBar 
        score={node.score} 
        height={10}
        color="#74f96b"
        label="Weighted Average Score"
      />
      <ScoreBar 
        score={node.popularity} 
        height={10}
        color="#f0ac29"
        label="Popularity"
      />
      <ScoreBar 
        score={node.non_null_leaf_count / (node.leaf_count_in_subtree / 2) } 
        height={10}
        color="#4285F4"
        label="Completed Leaf Percentage"
      />
    </div>
  </div>
  )
};

export default NodeDetails;