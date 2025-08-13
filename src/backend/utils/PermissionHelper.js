// permissionHelper.js
const db = require('../db.js');

exports.checkNodePermission = async (nodeId, userUUID, action) => {
    // Step 1: Traverse to root node
    const rootNode = await getRootNode(nodeId);
    if (!rootNode) throw new Error('Root node not found');

    const privacyLevel = rootNode.privacy_level;

    // Step 2: Apply root-level security rules
    switch (privacyLevel) {
        case 0: // Public access
            return true;
        case 1: // Viewable by anyone, but edit restricted
            return action === 0 ? true : hasPermissionRecord(rootNode.node_id, userUUID) == 1;
        case 2: // Fully restricted (requires explicit permissions)
            return await hasPermissionRecord(rootNode.node_id, userUUID) == action;
        default:
            throw new Error(`Unknown privacy level: ${privacyLevel}`);
    }
}

async function getRootNode(nodeId) {
    let currentNodeId = nodeId;
    let depth = 0;
    const maxDepth = 100;

    while (currentNodeId && depth < maxDepth) {
        const nodes = await db.query('SELECT * FROM nodes WHERE node_id = ?', [currentNodeId]);
        if (!nodes.length) break;
        
        const node = nodes[0];
        if (node.parent_id === null) return node;
        
        currentNodeId = node.parent_id;
        depth++;
    }
    return null;
}

async function hasPermissionRecord(rootNodeId, userUUID) {
    if (!userUUID) return false; // No user session
    
    const permissions = await db.query(
        'SELECT 1 FROM root_privacy WHERE node_id = ? AND UUID = ?',
        [rootNodeId, userUUID]
    );
    return permissions[0];
}
