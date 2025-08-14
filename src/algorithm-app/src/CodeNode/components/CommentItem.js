import React from 'react';
import getTimeDisplay from '../../utils/helperFunctions/GetTimeSince';
import '../nonGlobalStyle/CommentItem.css';

const CommentItem = ({ comment, processing, onEndorse, onReport }) => {
  return (
    <div className="comment-item">
      <div className="d-flex">
        <div className="comment-avatar">
          <span className="comment-avatar-initial">
            {comment.username?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="comment-content">
          <p className="comment-text">{comment.comment_text}</p>
          <div className="comment-meta">
            <small className="comment-timestamp">
              Posted {getTimeDisplay(comment.created_at)} by {comment.username || 'Unknown'}
            </small>
            <div className="comment-actions">
              <button
                className={`btn-endorse ${comment.is_endorsed ? 'endorsed' : ''}`}
                onClick={() => onEndorse(comment.id)}
                disabled={processing[comment.id] || !comment.username}
                aria-label={comment.is_endorsed ? "Unendorse comment" : "Endorse comment"}
              >
                {processing[comment.id] === 'endorsing' ? (
                  <span className="action-spinner" />
                ) : (
                  <>
                    Endorse
                    {/* Only show count if greater than 0 */}
                    {comment.endorsement_count > 0 && ` (${comment.endorsement_count})`}
                  </>
                )}
              </button>
              <button 
                className={`btn-report ${comment.is_reported ? 'reported' : ''}`}
                onClick={() => onReport(comment.id)}
                disabled={processing[comment.id] || !comment.username}
                aria-label={comment.is_reported ? "Unreport comment" : "Report comment"}
              >
                {processing[comment.id] === 'reporting' ? (
                  <span className="action-spinner" />
                ) : (
                  <>
                    Report
                    {/* Only show count if greater than 0 */}
                    {comment.report_count > 0 && ` (${comment.report_count})`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;