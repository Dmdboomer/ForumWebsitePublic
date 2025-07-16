import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScoreBar from '../../utils/visuals/ScoreBar';
import { saveNode } from '../../CodeProfile/services/profileAPI'; // Adjust import path as needed
import '../../CodeCSS/App.css'

const RootCard = ({ root, userUUID }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    if (!userUUID) {
      alert('Please log in to save nodes');
      return;
    }

    try {
      await saveNode(userUUID, root.id);
      alert('Node saved successfully!');
      setDropdownOpen(false);
    } catch (error) {
      alert(`Save failed: ${error.message}`);
    }
  };

  return (
    <div className="root-card">
      <Link to={`/node/${root.id}`} className="root-link">
        <div className="root-icon">
          <span>📚</span>
        </div>
        <div className="root-info">
          <h3 className="root-title">{root.title}</h3>
          <div className="root-meta">
            <span className="sub-topics">Leafs: {root.leaf_count_in_subtree || 0}</span>
            <span className="popularity">Popularity: {root.popularity}</span>
            <ScoreBar 
              score={root.score} 
              height={10}
              color="#4285F4"
              label="Weighted Average Score"
            />
            {root.created_at && (
              <span className="date">
                {new Date(root.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Dropdown menu */}
      <div className="root-actions" ref={dropdownRef}>
        <button 
          className="dropdown-toggle"
          onClick={(e) => {
            console.log("Button clicked!"); // Add this
            e.preventDefault();
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          ⋮
        </button>
        
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSave();
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RootCard;