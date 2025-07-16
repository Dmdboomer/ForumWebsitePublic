// CreateChild.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivateRoute from '../../CodeLoginAuth/components/PrivateRoute';
import { createChildNodes } from '../services/nodeAPI'; // Import the API function
import '../../CodeCSS/App.css'

const CreateChild = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createChildNodes(id, title, content);
    
    if (result.success) {
      navigate(`/node/${id}`);
    }
    
    setIsSubmitting(false);
  };

  return (
    <PrivateRoute>
      <div className="topic-form">
        <h2>Create New Child</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter True/False Statement title"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your True/False Statement..."
              rows={5}
              required
              disabled={isSubmitting}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create True/False Statement'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/node/${id}`)}>
            Cancel
          </button>
        </form>
      </div>
    </PrivateRoute>
  );
};

export default CreateChild;