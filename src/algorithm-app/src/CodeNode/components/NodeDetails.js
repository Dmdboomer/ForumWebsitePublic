// NodeDetails.js
import React from 'react';
import ScoreBar from '../../utils/visuals/ScoreBar';
import '../nonGlobalStyle/NodeDetails.css';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';

const NodeDetails = ({ node}) => {
  const {user} = useAuth()

  return (
  <div className="node-detail mb-4">
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