const db = require('../db');

exports.getSearch = async (req, res) => {
    const { term } = req.query;
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    if (!term) {
        return res.status(400).json({ error: 'Search term required' });
    }
    try {
        const sql = `
            SELECT 
                nodes.id,
                topic_roots.title,
                topic_roots.created_at AS date,
                nodes.score,
                nodes.non_null_leaf_count,
                nodes.popularity
            FROM topic_roots
            INNER JOIN nodes ON topic_roots.node_id = nodes.id
            WHERE topic_roots.title LIKE ?
            ${startDate ? 'AND topic_roots.created_at >= ?' : ''}
            ${endDate ? 'AND topic_roots.created_at <= ?' : ''}
            ORDER BY topic_roots.created_at DESC
            LIMIT 20;
        `;

        const params = [`%${term}%`];
        if (startDate) params.push(startDate);
        if (endDate) params.push(endDate);

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error('DB query failed:', err);
        res.status(500).json({ error: 'Database error' });
    }
};