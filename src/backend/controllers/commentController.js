const db = require('../db');

// Update getComments to include endorsement/report status
exports.getComments = async (req, res) => {
  const nodeId = req.params.id;
  const userId = req.query.userId;
  if (!nodeId) return res.status(400).json({ error: "Missing node ID" });

  try {
    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM comment_reactions 
         WHERE comment_id = c.id AND reaction_type = 1) AS endorsement_count,
        (SELECT COUNT(*) FROM comment_reactions 
         WHERE comment_id = c.id AND reaction_type = 2) AS report_count,
        EXISTS(SELECT 1 FROM comment_reactions 
               WHERE comment_id = c.id AND user_id = ? AND reaction_type = 1) AS is_endorsed,
        EXISTS(SELECT 1 FROM comment_reactions 
               WHERE comment_id = c.id AND user_id = ? AND reaction_type = 2) AS is_reported
      FROM comments c
      WHERE c.node_id = ?
    `;

    const [rows] = await db.query(query, [userId, userId, nodeId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: "Database error" });
  }
};


exports.createComment = async (req, res) => {
  const nodeId = req.params.id;
  const { content, proStatus } = req.body;


  if (!content) {
    return res.status(400).json({ 
      error: "Comment content is required" 
    });
  }

  try {
    const sql = `INSERT INTO comments (node_id, comment_text, proStatus) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [nodeId, content, proStatus]);
    
    // Get newly created comment with its ID
    const [newComment] = await db.query(
      `SELECT * FROM comments WHERE id = ?`,
      [result.insertId]
    );
    
    // Send successful response with created comment
    res.status(201).json(newComment[0]);

  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Helper function to handle reactions (add/remove)
const handleReaction = async (req, res, type, action, successMsg) => {
  const { cid: commentId } = req.params;
  const { uid: userId } = req.params;

  try {
    if (action === 'add') {
      const [existing] = await db.query(
        `SELECT 1 
         FROM comment_reactions 
         WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
      
      if (existing.length) {
        return res.status(400).json({ error: "User already reacted to this comment" });
      }

      await db.query(
        `INSERT INTO comment_reactions 
         (comment_id, user_id, reaction_type) 
         VALUES (?, ?, ?)`,
        [commentId, userId, type]
      );
    } 
    else { // 'remove' action
      await db.query(
        `DELETE FROM comment_reactions 
         WHERE comment_id = ? AND user_id = ?`,
        [commentId, userId]
      );
    }
    
    res.status(201).json({ message: successMsg });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "User already reacted to this comment" });
    }
    console.error(`Error ${action}ing reaction:`, err);
    const actionType = action === 'add' ? action : 'remove';
    res.status(500).json({ error: `Failed to ${actionType} reaction` });
  }
};

// Controller exports
exports.getCommentEndorseCount = async (req, res) => {
  try {
    const count = await countReactions(req.params.id, 1);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.getCommentReportCount = async (req, res) => {
  try {
    const count = await countReactions(req.params.id, 2);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.endorseComment = (req, res) => 
  handleReaction(req, res, 1, 'add', "Comment endorsed");

exports.reportComment = (req, res) => 
  handleReaction(req, res, 2, 'add', "Comment reported");

exports.unendorseComment = (req, res) => 
  handleReaction(req, res, null, 'remove', "Comment endorsement removed");

exports.unreportComment = (req, res) => 
  handleReaction(req, res, null, 'remove', "Comment report removed");