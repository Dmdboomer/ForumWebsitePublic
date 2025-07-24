import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScoreBar from '../../utils/visuals/ScoreBar';
import { saveNode } from '../../CodeProfile/services/profileAPI'; // Adjust import path as needed
import '../../CodeCSS/RootPage.css'
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';

const RootCard = ({ root }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {user} = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!user.UUID) {
      alert('Please log in to save nodes');
      return;
    }

    try {
      await saveNode(user.UUID, root.id);
      alert('Node saved successfully!');
      setDropdownOpen(false);
    } catch (error) {
      alert(`Save failed: ${error.message}`);
    }
  };

  return (
    <div className={`root-card ${dropdownOpen ? 'dropdown-open' : ''}`}>
      <Link to={`/node/${root.id}`} className="root-link">
        <span>
          <h3 className="root-title">{root.title}  📚</h3>
        </span>

        <div className="root-info">
          <div className="root-meta">
            <ScoreBar 
              score={root.score} 
              height={10}
              color="#74f96b"
              label="Weighted Average Score"
            />
            <ScoreBar 
              score={root.non_null_leaf_count / (root.leaf_count_in_subtree / 2) } 
              height={10}
              color="#4285F4"
              label="Completed Leaf Percentage"
            />
            <ScoreBar 
              score={root.popularity} 
              height={10}
              color="#f0ac29"
              label="Popularity"
            />
          </div>
          <div>
            Total Leafs: {(root.leaf_count_in_subtree / 2) || 0}
          </div>
          {root.created_at && (
              <span className="date">
                Creation Date: {new Date(root.created_at).toLocaleDateString()}
              </span>
            )}
        </div>
      </Link>
    </div>
  );
};

export default RootCard;