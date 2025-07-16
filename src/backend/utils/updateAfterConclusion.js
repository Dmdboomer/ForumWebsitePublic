import {calculateNodeScoreBayesian} from './ScoringAlgorithmBayesian.js';
export const incrementAncestorCounter = async (startId, db) => {
  let currentId = startId;
  
  while (currentId) {
    // Increment the non-null counter field by 1
    await db.query(
      `UPDATE nodes 
       SET non_null_leaf_count = non_null_leaf_count + 1 
       WHERE id = ?`,
      [currentId]
    );
    
    // Get next parent in hierarchy
    const [parentRow] = await db.query(
      `SELECT parent_id FROM nodes WHERE id = ?`,
      [currentId]
    );

    currentId = parentRow[0]?.parent_id;
  }
};

export const updateAncestorScoresSimpleAvg = async (startNodeId, db) => {
  let currentId = startNodeId;
  while (currentId !== null) {
    // Get all direct children scores
    const [children] = await db.query(
      'SELECT score FROM nodes WHERE parent_id = ? AND score IS NOT NULL AND score <> -1',
      [currentId]
    );

    // Calculate average of valid children scores
    const validScores = children.map(c => c.score).filter(s => s !== null);
    const newScore = validScores.length > 0 
      ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
      : null;

    // Update current node with new calculated score
    await db.query('UPDATE nodes SET score = ? WHERE id = ?', [newScore, currentId]);

    // Move to next parent
    const [[nextNode]] = await db.query('SELECT parent_id FROM nodes WHERE id = ?', [currentId]);
    currentId = nextNode ? nextNode.parent_id : null;
  }
}

export const updateAncestorScoresWeightedAvg = async (startNodeId, db) => {
  let currentId = startNodeId;
  
  while (currentId !== null) {
    // Get ALL direct children (regardless of score)
    const [children] = await db.query(
      'SELECT id, score, non_null_leaf_count, allChildrenCompleted FROM nodes WHERE parent_id = ?',
      [currentId]
    );

    // Handle leaf nodes
    if (children.length === 0) {
      await db.query(
        'UPDATE nodes SET allChildrenCompleted = true WHERE id = ?',
        [currentId]
      );
    } 
    // Handle non-leaf nodes
    else {
      let weightedSum = 0;
      let totalWeight = 0;
      let allChildrenCompleted = true;

      children.forEach(child => {
        // Check completion: valid score + allChildrenCompleted flag
        const isChildCompleted = child.score !== null && 
                                child.score !== -1 && 
                                child.allChildrenCompleted;
        
        if (!isChildCompleted) {
          allChildrenCompleted = false;
        }

        // Only include valid scores in the weighted average
        if (child.score !== null && child.score !== -1) {
          const weight = child.non_null_leaf_count; 
          weightedSum += child.score * weight;
          totalWeight += weight;
        }
      });

      const newScore = totalWeight > 0 
        ? weightedSum / totalWeight 
        : null;

      // Update both score and completion flag
      await db.query(
        'UPDATE nodes SET score = ?, allChildrenCompleted = ? WHERE id = ?',
        [newScore, allChildrenCompleted, currentId]
      );
    }

    // Move to next parent
    const [[nextNode]] = await db.query(
      'SELECT parent_id FROM nodes WHERE id = ?',
      [currentId]
    );
    currentId = nextNode ? nextNode.parent_id : null;
  }
};

