import React from 'react';
import { 
  fetchComments,
  endorseComment,
  unendorseComment,
  reportComment,
  unreportComment,
} from '../services/commentsAPI';
import { useAuth } from '../../CodeLoginAuth/context/AuthContext';
import { completeNode } from '../services/nodeAPI';

const useCommentsLogic = (nodeId) => {
  const [comments, setComments] = React.useState([]);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState({});
  const {user} = useAuth()

  React.useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      try {
        setIsLoading(true);
        if (!nodeId) {
          setComments([]);
          return;
        }

        const commentsData = await fetchComments(nodeId);
        console.log(commentsData);
        if (isMounted) setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadComments();

    return () => { isMounted = false; };
  }, [nodeId, user]);

  const handleNewComment = (newComment) => { 
    setComments(prev => [newComment, ...prev]);
    setShowCommentForm(false);
  };

   const handleEndorse = async (commentId) => {
    if (processing[commentId] || !user) return;
    
    setProcessing(prev => ({...prev, [commentId]: 'endorsing'}));
    try {
      const comment = comments.find(c => c.id === commentId);
      const isEndorsed = comment?.is_endorsed;
      const currentEndorsements = comment?.endorsement_count || 0;
      const newEndorsementCount = isEndorsed ? currentEndorsements - 1 : currentEndorsements + 1;

      if (isEndorsed) {
        await unendorseComment(nodeId, commentId);
      } else {
        await endorseComment(nodeId, commentId);
      }
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              is_endorsed: !isEndorsed,
              endorsement_count: newEndorsementCount
            } 
          : comment
      ));

      // Trigger node completion after 2 endorsements
      if (!isEndorsed && newEndorsementCount === 2) {
        // Use the comment's proStatus instead of hardcoded 1
        const comment = comments.find(c => c.id === commentId);
        const score = comment.prostatus;
        console.log(comment, score)
        completeNode(nodeId, score)
          .then(() => console.log(`Node ${nodeId} completed after 2 endorsements`))
          .catch(err => console.error('Node completion error:', err));
      }
    } catch (error) {
      console.error('Error toggling endorsement:', error);
    } finally {
      setProcessing(prev => {
        const newState = {...prev};
        delete newState[commentId];
        return newState;
      });
    }
  };

  const handleReport = async (commentId) => {
    if (processing[commentId] || !user) return;
    
    setProcessing(prev => ({...prev, [commentId]: 'reporting'}));
    try {
      const isReported = comments.find(c => c.id === commentId)?.is_reported;
      
      if (isReported) {
        await unreportComment(nodeId, commentId);
      } else {
        await reportComment(nodeId, commentId);
      }
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              is_reported: !isReported,
              report_count: isReported 
                ? Math.max(0, comment.report_count - 1)
                : comment.report_count + 1
            } 
          : comment
      ));
    } catch (error) {
      console.error('Error toggling report:', error);
    } finally {
      setProcessing(prev => {
        const newState = {...prev};
        delete newState[commentId];
        return newState;
      });
    }
  };

  return {
    comments,
    showCommentForm,
    isLoading,
    processing,
    setShowCommentForm,
    handleNewComment,
    handleEndorse,
    handleReport
  };
};

export default useCommentsLogic;