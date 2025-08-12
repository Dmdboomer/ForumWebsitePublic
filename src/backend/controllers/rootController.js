const db = require('../db');

exports.getRoots = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM nodes WHERE parent_id IS NULL AND privacy_level = 0'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoot = async (req, res) => {
    const { title, content } = req.body;
    const UUID = req.session.userId; 
    
    // Validate required fields before starting transaction
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    try {
        // Start transaction
        await db.query('START TRANSACTION');
        
        const nodesSql = `INSERT INTO nodes 
                          (leaf_count_in_subtree, popularity, title, content, non_null_leaf_count, allChildrenCompleted, privacy_level) 
                          VALUES (2, 0.5, ?, ?, 0, 0, 0)`;
        
        // Execute SQL with parameterized query
        const [result] = await db.query(nodesSql, [title, content]);
        
        const newNodeID = result.insertId
        
        
        await db.query(`INSERT INTO topic_roots
                        (node_id, title, content)
                        VALUES (?, ?, ?)`, [newNodeID, title, content])
        
        
        await db.query(`INSERT INTO root_privacy
                        (UUID, node_id, permission_type)
                        VALUES (?, ?, ?)`, [UUID, newNodeID, -1])
                        
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

exports.getNodeSecurityLevel = async(req, res) => {
  const {node_id} = req.body;
  try{
    await db.query('START TRANSACTION'); 
    const query = `SELECT privacy_level FROM nodes
                    WHERE node_id = ?`
    const results = db.query(querty, node_id)
    return results;
  } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        
        // Handle specific database errors
        const errorMessage = error.code === 'ER_DUP_ENTRY' 
            ? "DNE" 
            : "IDK";
        
        res.status(500).json({ 
            error: errorMessage,
            detail: error.message 
        });
    }
}

exports.getRootPerms = async(req, res) => {
  const {node_id} = req.body;
  try{
    await db.query('START TRANSACTION'); 
    const query = `SELECT privacy_level FROM nodes
                    WHERE node_id = ?`
    const results = db.query(querty, node_id)
    return results;
  } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        
        // Handle specific database errors
        const errorMessage = error.code === 'ER_DUP_ENTRY' 
            ? "DNE" 
            : "IDK";
        
        res.status(500).json({ 
            error: errorMessage,
            detail: error.message 
        });
    }
}

exports.addUser = async (req, res) => {
  const { node_id, perm_type} = req.body;
  const UUID = req.session.userId; 

  try {
    // Start transaction
    await db.query('START TRANSACTION');
    const query = `INSERT INTO node_privacy 
                    (UUID, node_id, permission_type)
                    VALUES (?, ?, ?)`
    const result = db.query(query, [UUID, node_id, perm_type])

    // Commit transaction
    await db.query('COMMIT');
    
    // Return successful response with inserted ID
    res.status(201).json({ 
        message: "User added sycessfully",
        nodeId: result.insertId 
    });
    
  } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        
        // Handle specific database errors
        const errorMessage = error.code === 'ER_DUP_ENTRY' 
            ? "DNE" 
            : "IDK";
        
        res.status(500).json({ 
            error: errorMessage,
            detail: error.message 
        });
  }
}