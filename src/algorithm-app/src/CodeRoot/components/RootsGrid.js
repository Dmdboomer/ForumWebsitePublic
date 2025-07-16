import React from 'react';
import RootCard from './RootCard';

const RootsGrid = ({ roots }) => {
  if (roots.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌿</div>
        <h3>No root nodes found</h3>
        <p>Be the first to create a root topic</p>
      </div>
    );
  }

  return (
    <section className="roots-grid">
      {roots.map(root => (
        <RootCard key={root.id} root={root} />
      ))}
    </section>
  );
};

export default RootsGrid;