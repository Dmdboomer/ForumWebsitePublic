import React from 'react';

const RootsControls = ({ onCreateRoot, sortOption, setSortOption }) => (
  <div className="controls">
    <button className="btn btn-primary" onClick={onCreateRoot}>
      + New Root Topic
    </button>
    
    <div className="controls">
      <label>Sort by: </label>
      <select 
        value={sortOption} 
        onChange={(e) => setSortOption(e.target.value)}
        className="btn"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  </div>
);

export default RootsControls;