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
    const query = `SELECT * FROM root_privacy rp
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

exports.getMyRoots = async(req, res) => {
  const UUID = req.session.userId
  try{
    await db.query('START TRANSACTION'); 
    const query = `SELECT rp.node_id, title, content, created_at 
                    FROM root_privacy rp 
                    INNER JOIN topic_roots tr
                    ON rp.node_id = tr.node_id
                    WHERE UUID = ? AND permission_type = ?`
    const results = db.query(querty, [UUID, -1])
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

exports.changePerms = async (req, res) => {
  const { node_id, perm_type, addedUserID} = req.body;
  const UUID = req.session.userId;
  

  try {

    if (perm_type != 1 || perm_type != 0){
      return "Not a valid permission";
    }
    // Start transaction
    await db.query('START TRANSACTION');
    const [nodeCreator] = await db.query(`SELECT UUID as creator FROM root_privacy 
                                          WHERE node_id = ? AND permission_type = ?`
                                          , [node_id, -1]);
        if (UUID !== nodeCreator.creator) {
        return "Error: You did not create this node";
    }

    const query = `INSERT INTO root_privacy 
                    (UUID, node_id, permission_type)
                    VALUES (?, ?, ?)`
    const result = db.query(query, [addedUserID, node_id, perm_type])


    // Commit transaction
    await db.query('COMMIT');
    
    // Return successful response with inserted ID
    res.status(201).json({ 
        message: "User added sycessfully",
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

exports.removePerms = async (req, res) => {
  const { node_id, removedUser} = req.body;
  const UUID = req.session.userId;

  try {
    // Start transaction
    await db.query('START TRANSACTION');
    const [nodeCreator] = await db.query(`SELECT UUID as creator FROM root_privacy 
                                          WHERE node_id = ? AND permission_type = ?`
                                          , [node_id, -1]);
        if (UUID !== nodeCreator.creator) {
        return "Error: You did not create this node";
    }

    const query = `DELETE * from root_privacy WHERE
                  node_id = ? AND UUID = ?`
    const result = db.query(query, [addedUser, node_id, removedUser])


    // Commit transaction
    await db.query('COMMIT');
    
    // Return successful response with inserted ID
    res.status(201).json({ 
        message: "User removed sycessfully",
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