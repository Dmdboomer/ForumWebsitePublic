const db = require('../db');

exports.getSaved = async (req, res) => {
  try {
    const UUID = req.session.userId; 

    const [rows] = await db.query(
      'SELECT * FROM user_saved WHERE UUID = ?',
      [UUID]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSave = async (req, res) => {
    const { node_id } = req.body;
    const UUID = req.session.userId; 

    try {
        // Start transaction
        await db.query('START TRANSACTION'); 

        const nodesSql = `INSERT INTO user_saved 
                          (UUID, node_id) 
                          VALUES (?, ?)`;
        
        // Execute SQL with parameterized query
        const [result] = await db.query(nodesSql, [UUID, node_id]);
        
        
        await db.query('COMMIT');
        
        // Return successful response with inserted ID
        res.status(201).json({ 
            message: "node saved successfully",
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

exports.unSave = async (req, res) => {
  const { node_id } = req.body;
  const UUID = req.session.userId; 

    try {
        // Start transaction
        await db.query('START TRANSACTION'); 

        const nodesSql = `DELETE from user_saved
                          WHERE UUID = ? AND node_id = ?`;
        
        // Execute SQL with parameterized query
        const [result] = await db.query(nodesSql, [UUID, node_id]);
        
        
        await db.query('COMMIT');
        
        // Return successful response with inserted ID
        res.status(201).json({ 
            message: "node saved successfully",
        });
        
    } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        
        // Handle specific database errors
        const errorMessage = error.code === 'ER_DUP_ENTRY' 
            ? "IDK" 
            : "huh?";
        
        res.status(500).json({ 
            error: errorMessage,
            detail: error.message 
        });
    }
}

exports.isSaved = async (req, res) => {
  const { node_id } = req.body;
  const UUID = req.session.userId; 

  
  try {
    const [rows] = await db.query(
      'SELECT 1 FROM user_saved WHERE UUID = ? AND node_id = ?',
      [UUID, node_id]
    );
    res.json({ isSaved: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};