export const updateAncestorNewNode = async (startId, db) => {
  let currentId = startId;
  
  while (currentId) {
    // leaf count +1
    await db.query(
      `UPDATE nodes 
       SET leaf_count_in_subtree = leaf_count_in_subtree + 1
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