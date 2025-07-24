// TreeVisualization.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import Breadcrumb from './Breadcrumb';

// Centered container for all nodes
const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// NodeCard with theme determined by truthstatus prop
const NodeCard = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid 
    ${({ truthstatus }) => 
      truthstatus === null ? '#2e86c1' : 
      truthstatus ? '#37e418' : '#f85030'};
  background: 
    ${({ truthstatus }) => 
      truthstatus === null ? '#aed6f1' : 
      truthstatus ? '#d5f9ce' : '#f9b498'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const ExpandButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 1px solid #90A4AE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 10;
  cursor: pointer;
`;

const TreeNodeContent = ({ node, depth = 0, isExpanded, onExpand, path }) => {
  const navigate = useNavigate();
  const isLeaf = depth === 4 || !node.children?.length;
  
  const truthstatus = node.statementTrueFalseFlag;
  const showExpandButton = !isLeaf && node.children?.length > 0;

  const statusConfig = 
    truthstatus === null ? 
      ['bg-blue-100 text-blue-800', 'Root'] : 
    truthstatus ? 
      ['bg-green-100 text-green-800', '✓ True'] : 
    ['bg-red-100 text-red-800', '✗ False'];
  
  const [statusClasses, statusText] = statusConfig;

  return (
    <CenteredContainer>
      {showExpandButton && (
        <ExpandButton 
          onClick={(e) => {
            e.stopPropagation();
            onExpand(node.id);
          }}
        >
          {isExpanded ? '-' : '+'}
        </ExpandButton>
      )}
      
      <NodeCard 
        truthstatus={truthstatus}
        onClick={() => navigate(`/node/${node.id}`)}
      >
        <div className="font-medium text-secondary truncate">
          {node.title || node.name}
        </div>
        
        <div className="flex text-secondary flex-wrap gap-1 mt-2 justify-center">
          {node.score !== undefined && (
            (node.score === null || node.score === -1) ?
              <span className = {`${statusClasses}`}>
                Score: N/a
              </span>:
              <span className={`${statusClasses}`}>
                Score: {node.score}
              </span>
          )}
          {truthstatus !== undefined && (
            <span className={`text-xs px-2 py-1 rounded ${statusClasses}`}>
              {statusText}
            </span>
          )}
          {node.children?.length > 0 && !isLeaf && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {node.children.length} children ||
              {node.leaf_count_in_subtree / 2} Leafs
            </span>
          )}
        </div>
      </NodeCard>
    </CenteredContainer>
  );
};

const TreeVisualization = ({ treeData, maxDepth = 4, path }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isTreeVisible, setIsTreeVisible] = useState(true);

  const getAllIds = useCallback((node, ids = []) => {
    ids.push(node.id);
    node.children?.forEach(child => getAllIds(child, ids));
    return ids;
  }, []);

  const renderTreeNodes = (node, depth = 0) => {
    if (depth >= maxDepth) return null;
    
    const isExpanded = expandedNodes.has(node.id);
    return (
      <TreeNode 
        key={node.id}
        label={
          <TreeNodeContent 
            node={node} 
            depth={depth}
            isExpanded={isExpanded}
            onExpand={toggleNode}
            path = {path}
          />
        }
      >
        {isExpanded && node.children?.map(child => (
          renderTreeNodes(child, depth + 1)
        ))}
      </TreeNode>
    );
  };

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return next;
    });
  }, []);

  const toggleExpandAll = () => {
    if (!treeData) return;
    
    if (isTreeVisible) {
      setIsTreeVisible(false);
    } else {
      setIsTreeVisible(true);
      setExpandedNodes(new Set(getAllIds(treeData)));
    }
  };

  if (!treeData) return (
    <div className="text-center py-8 text-gray-500">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <p className="mt-3">Loading node structure...</p>
    </div>
  );

  return (
    <div className="tree-visualization my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Hierarchy Structure</h3>
        <button 
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            isTreeVisible 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
          onClick={toggleExpandAll}
        >
          {isTreeVisible ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      
      {isTreeVisible ? (
        <div className="tree-container --text-secondary p-4 rounded-xl border border-gray-200 shadow-sm">
          Current Path: <Breadcrumb path={path} />
          <Tree 
            lineWidth="2px"
            lineColor="#90A4AE"
            lineBorderRadius="4px"
            label={
              <CenteredContainer>
                <TreeNodeContent 
                  node={treeData}
                  depth={0}
                  isExpanded={expandedNodes.has(treeData.id)}
                  onExpand={toggleNode}
                />
              </CenteredContainer>
            }
          >
            {expandedNodes.has(treeData.id) && treeData.children?.map(child => (
              renderTreeNodes(child, 1)
            ))}
          </Tree>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          Tree is collapsed
        </div>
      )}
    </div>
  );
};

export default TreeVisualization;