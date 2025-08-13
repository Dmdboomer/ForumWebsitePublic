const db = require('../db.js');

exports.countMaxEndorses = async (nodeId, type) => {
    try {
        const q = `SELECT c`
        const query = `SELECT COUNT(*) comment_reactions WHERE
                        commentId = ? AND reaction_type = ?`
        const response = await db.query(query, nodeId)
        return response

    } catch (error) {
        console.error('Error fetching Reactions:', err);
        res.status(500).json({ error: "Database error" });
    }
}
