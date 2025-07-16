const db = require('../db');

exports.getRoots = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM nodes WHERE parent_id IS NULL'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoot = async (req, res) => {
    const { title, content } = req.body;
    
    // Validate required fields before starting transaction
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    try {
        // Start transaction
        await db.query('START TRANSACTION');
        
        const nodesSql = `INSERT INTO nodes 
                          (leaf_count_in_subtree, popularity, title, content, non_null_leaf_count, allChildrenCompleted) 
                          VALUES (0, 0.5, ?, ?, 0, 0)`;
        
        // Execute SQL with parameterized query
        const [result] = await db.query(nodesSql, [title, content]);
        
        
        const newNodeID = result.insertId
        
        
        await db.query(`INSERT INTO topic_roots
                        (node_id, title, content)
                        VALUES (?, ?, ?)`, [newNodeID, title, content])
        

        // Commit transaction
        await db.query('COMMIT');
        
        // Return successful response with inserted ID
        res.status(201).json({ 
            message: "Root node created successfully",
            nodeId: result.insertId 
        });
        
    } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        
        // Handle specific database errors
        const errorMessage = error.code === 'ER_DUP_ENTRY' 
            ? "Duplicate entry detected" 
            : "Database operation failed";
        
        res.status(500).json({ 
            error: errorMessage,
            detail: error.message 
        });
    }
};