const db = require('../db');
const { incrementAncestorCounter, updateScoreAfterConclusionBayesian,
  updateAncestorScoresSimpleAvg, updateAncestorScoresWeightedAvg } = require('../utils/updateAfterConclusion');
const { updateAncestorNewNode } = require('../utils/updateAncestorNewNode');

// Get node by ID
exports.getNode = async (req, res) => {
  try {
    const [node] = await db.query(
      `SELECT n.*, 
       (SELECT COUNT(*) FROM node_reactions WHERE node_id = n.id AND reaction_type = 1) AS likes,
       (SELECT COUNT(*) FROM node_reactions WHERE node_id = n.id AND reaction_type = 2) AS dislikes
       FROM nodes n WHERE id = ?`, 
      [req.params.id]
    );
    
    if (!node.length) return res.status(404).json({ error: 'Node not found' });
    
    // Add user's reaction if UUID is provided in query
    if (req.query.uid) {
      const [userReaction] = await db.query(
        'SELECT reaction_type FROM node_reactions WHERE node_id = ? AND UUID = ?',
        [req.params.id, req.query.uid]
      );
      
      if (userReaction.length) {
        node[0].userReaction = userReaction[0].reaction_type;
      }
    }
    
    res.json(node[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get children of a node with reaction counts
exports.getChildren = async (req, res) => {
  try {
    const [children] = await db.query(
      `SELECT *
       FROM nodes n WHERE parent_id = ?`,
      [req.params.id]
    );
    
    // Add user reactions if UUID is provided
    if (req.params.uid) {
      for (const child of children) {
        const [userReaction] = await db.query(
          'SELECT reaction_type FROM node_reactions WHERE node_id = ? AND UUID = ?',
          [child.id, req.params.uid]
        );
        child.userReaction = userReaction.length ? userReaction[0].reaction_type : null;
      }
    }
    
    res.json(children);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Create new node
exports.createNode = async (req, res) => {
  const { parent_id, title, content, statementTrueFalseFlag } = req.body;

  // Validate request parameters
  if (!parent_id ) {
    return res.status(400).json({ error: 'Parent ID and scores array are required' });
  }

  try {
    await db.query('START TRANSACTION');

    // Lock parent node for update
    const [parent] = await db.query(
      'SELECT id, score FROM nodes WHERE id = ? FOR UPDATE',
      [parent_id]
    );
    
    // Check if parent exists
    if (parent.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Parent node not found' });
    }

    const parentNode = parent[0];
    
    // Verify parent is a leaf (has NULL score or -2 (for adding 2 in a row))
    if (!((parentNode.score === null ) || (parentNode.score === -2))) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Cannot add children to non-leaf node' });
    }
    

    if (title === null) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Must have a title' });
    }

    if (content.score === null) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Must have Content' });
    }
    
    // Convert parent to non-leaf
    if (parentNode.score === -2){
      await db.query(
      'UPDATE nodes SET score = -1 WHERE id = ?',
      [parent_id]
      );
    }
    else if (parentNode.score === null){
      await db.query(
      'UPDATE nodes SET score = -2 WHERE id = ?',
      [parent_id]
      );
    }
    
    
    // Create child nodes
    const childIds = [];
    const [result] = await db.query(
      `INSERT INTO nodes (parent_id, leaf_count_in_subtree, popularity, title, content, statementTrueFalseFlag, non_null_leaf_count, allChildrenCompleted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [parent_id, 2, 0.5 , title, content, statementTrueFalseFlag, 0, 0]
    );
    childIds.push(result.insertId);

    // Update parent and ancestors
    await updateAncestorNewNode(parent_id, db);

    await db.query('COMMIT');
    res.status(201).json({ ids: childIds });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Node creation failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handleReaction = async (req, res, type, action, successMsg) => {
  const { id: nodeId } = req.params;
  const UUID = req.session.userId;

  try {
    if (action === 'add') {
      const [existing] = await db.query(
        `SELECT 1 
         FROM node_reactions 
         WHERE node_id = ? AND UUID = ?`,
        [nodeId, UUID]
      );
      
      if (existing.length) {
        return res.status(400).json({ error: "User already reacted to this node" });
      }

      await db.query(
        `INSERT INTO node_reactions 
         (node_id, UUID, reaction_type) 
         VALUES (?, ?, ?)`,
        [nodeId, UUID, type]
      );
    } 
    else { // 'remove' action
      await db.query(
        `DELETE FROM node_reactions 
         WHERE node_id = ? AND UUID = ?`,
        [nodeId, UUID]
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

exports.likeNode= (req, res) => 
  handleReaction(req, res, 1, 'add', "Comment endorsed");

exports.dislikeNode = (req, res) => 
  handleReaction(req, res, 2, 'add', "Comment reported");

exports.unlikeNode = (req, res) => 
  handleReaction(req, res, null, 'remove', "Comment endorsement removed");

exports.undislikeNode = (req, res) => 
  handleReaction(req, res, null, 'remove', "Comment report removed");

// Get path from node to root
exports.getPathToRoot = async (req, res) => {
  try {
    const path = [];
    let currentId = req.params.id;
    
    while (currentId) {
      const [node] = await db.query(
        'SELECT * FROM nodes WHERE id = ?',
        [currentId]
      );
      
      if (!node.length) break;
      
      path.push(node[0]);
      currentId = node[0].parent_id;
    }
    
    res.json(path);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};


// Add this new endpoint
exports.completeNode = async (req, res) => {
  const { completedScore } = req.body;
  const nodeId = req.params.id;
  console.log(completedScore);

  try {
    // Validate input - now accepts any number between 0 and 1
    if (typeof completedScore !== 'number' || completedScore < 0 || completedScore > 1) {
      return res.status(400).json({ error: 'Invalid score. Must be between 0 and 1' });
    }

    await db.query('START TRANSACTION');

    // Lock node to prevent concurrent modifications
    const [[node]] = await db.query(
      `SELECT id, parent_id, score, 
       (SELECT COUNT(*) FROM nodes WHERE parent_id = n.id) AS child_count
       FROM nodes n
       WHERE id = ? FOR UPDATE`,
      [nodeId]
    );
    
    
    if (!node) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Node not found' });
    }

    // Validate completion status
    if (node.score !== null) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Node already completed' });
    }
    if (node.child_count > 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot complete non-leaf nodes' });
    }

    // Update leaf node
    await db.query(
      'UPDATE nodes SET score = ?, non_null_leaf_count = 1, allChildrenCompleted = 1 WHERE id = ?', 
      [completedScore, nodeId]
    );

    //await updateAncestorScoresSimpleAvg(node.parent_id, db);

    await incrementAncestorCounter(node.parent_id,db);
    await updateAncestorScoresWeightedAvg(node.parent_id,db);


    //await incrementAncestorCount(node.parent_id,db);
    //await updateScoreAfterConclusionBayesian(node.parent_id,db);

    await db.query('COMMIT');
    res.status(200).json({ message: 'Node completed successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Completion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};