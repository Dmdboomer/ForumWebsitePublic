const db = require('../db')

exports.getTree = async (req, res) => {
  const depth = parseInt(req.query.depth) || 4;
  try {
    const { id } = req.params;

    const [rootRows] = await db.query('SELECT * FROM nodes WHERE id = ?', [id]);
    if (rootRows.length === 0) {
      console.error(`Node ${id} not found`);
      return res.status(404).json({ error: 'Node not found' });
    }

    const root = rootRows[0];
    const rootNode = { ...root, children: [] }; // Create root node object

    // BFS initialization
    let queue = [{ node: rootNode, depth: 0 }];
    let currentQueue = [];

    while (queue.length > 0) {
      const { node, depth: currentDepth } = queue.shift();
      
      // Only fetch children if we haven't reached max depth
      if (currentDepth < depth) {
        const [children] = await db.query(
          'SELECT * FROM nodes WHERE parent_id = ?',
          [node.id]
        );

        // Process children
        children.forEach(child => {
          const childNode = { 
            ...child, 
            children: [] 
          };
          
          // Add child to parent's children
          node.children.push(childNode);
          
          // Prepare for next level processing
          currentQueue.push({ 
            node: childNode, 
            depth: currentDepth + 1 
          });
        });
      }

      // Move to next level when current queue is empty
      if (queue.length === 0) {
        queue = currentQueue;
        currentQueue = [];
      }
    }

    res.json(rootNode); // Directly return root node
  } catch (error) {
    console.error("Tree fetch failed:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};