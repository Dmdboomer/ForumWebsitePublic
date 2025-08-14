import React from 'react';
import CreateComment from './CreateComment';
import CommentItem from './CommentItem';
import useCommentsLogic from './useCommentsLogic';
import '../nonGlobalStyle/CommentsSection.css';

const CommentsSection = ({ nodeId }) => {
  const {
    comments,
    showCommentForm,
    isLoading,
    processing,
    setShowCommentForm,
    handleNewComment,
    handleEndorse,
    handleReport
  } = useCommentsLogic(nodeId);

  if (isLoading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="comment-stuff mb-4">
      <div className="comment-stuff d-flex justify-content-between align-items-center py-3">
        <h2 className="comment-stuff mb-4">Attempts to solve</h2>
        <button 
          className={`btn btn-sm ${showCommentForm ? 'btn-outline-secondary' : 'btn-primary'}`}
          onClick={() => setShowCommentForm(!showCommentForm)}
          disabled={!nodeId}
        >
          {showCommentForm ? 'Cancel' : 'Add New'}
        </button>
      </div>
      
      {showCommentForm && (
        <div className="card-body border-bottom">
          <CreateComment 
            onCommentCreated={handleNewComment}
            nodeId={nodeId}
          />
        </div>
      )}
      
      <div className="list-group list-group-flush">
        {comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-secondary">No comments yet</p>
            <button 
              className="btn btn-link text-accent"
              onClick={() => setShowCommentForm(true)}
              disabled={!nodeId}
            >
              Be the first to add a comment
            </button>
          </div>
        ) : (
          comments.map(comment => 
            comment && (
              <CommentItem 
                key={comment.id}
                comment={comment}
                processing={processing}
                onEndorse={handleEndorse}
                onReport={handleReport}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default CommentsSection;