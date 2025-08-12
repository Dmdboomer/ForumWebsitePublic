// CreateTopic.js
import React, { useState } from 'react';
import { createTopic } from '../services/rootAPI'; // Import the API function
import { } from 'react-router-dom';
import PrivateRoute from '../../CodeLoginAuth/components/PrivateRoute';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';

const CreateTopic = ({ onClose, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const {user} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await createTopic(title, content, user.UUID);
      onClose();
    } catch (error) {
      console.error('Error creating topic:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="topic-form">
        <h2>Create New Topic</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
              required
              disabled={isSubmitting}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your topic..."
              rows={5}
              required
              disabled={isSubmitting}
              className="form-control"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Creating...
                </>
              ) : 'Create Topic'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PrivateRoute>
  );
};

export default CreateTopic;