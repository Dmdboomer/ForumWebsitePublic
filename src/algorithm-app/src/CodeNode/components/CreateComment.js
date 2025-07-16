import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; // Add useRef and useEffect
import PrivateRoute from '../../CodeLoginAuth/components/PrivateRoute';
import { createComment } from "../services/commentsAPI";
import '../nonGlobalStyle/CreateComment.css'

const CreateComment = ({ onCommentCreated }) => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [proStatus, setProStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Add mount tracking ref
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (proStatus === null) {
      setError('Please specify if this comment proves or disproves the root node');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Add request timeout (10 seconds)
    let timeoutId = setTimeout(() => {
      if (isMounted.current) {
        setError('Request timed out. Try refreshing the page.');
        setIsSubmitting(false);
      }
    }, 10000);

    try {
      console.log(content);
      const createdComment = await createComment(id, content, proStatus);
      clearTimeout(timeoutId); // Clear timeout on success
      
      if (!isMounted.current) return; // Check mount before state updates
      
     if (onCommentCreated) {
        onCommentCreated(createdComment); // Pass object directly
      }
      setContent('');
      setProStatus(null);
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      if (isMounted.current) {
        setError(error.message || 'Failed to create comment');
      }
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is always cleared
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <PrivateRoute>
      <div className="topic-form">
        <h2 className="mb-3">Create New Comment</h2>
        
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="radio-input">Comment</label>
            <textarea
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your comment"
              required
              disabled={isSubmitting}
              rows={4}
            />
          </div>
          
          {/* NEW: Radio buttons for proStatus */}
          <div className="radio-group">
            <label className="radio-option">
              Does this comment prove or disprove the root node?
            </label>
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="radio-input"
                  type="radio"
                  name="proStatus"
                  id="proves"
                  value="true"
                  checked={proStatus === true}
                  onChange={() => setProStatus(true)}
                  required
                />
                <label className="form-check-label" htmlFor="proves">
                  Proves
                </label>
              </div>
              <div className="radio-group">
                <input
                  className="radio-input"
                  type="radio"
                  name="proStatus"
                  id="disproves"
                  value="false"
                  checked={proStatus === false}
                  onChange={() => setProStatus(false)}
                />
                <label className="form-check-label" htmlFor="disproves">
                  Disproves
                </label>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : 'Submit Comment'}
            </button>
          </div>
        </form>
      </div>
    </PrivateRoute>
  );
};

export default CreateComment;