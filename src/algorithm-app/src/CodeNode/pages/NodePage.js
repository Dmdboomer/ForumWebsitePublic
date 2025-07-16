import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NodeDetails from '../components/NodeDetails';
import CommentsSection from '../components/CommentsSection';
import ChildrenList from '../components/ChildrenList';
import ActionButtons from '../components/ActionButtons';
import Breadcrumb from '../components/Breadcrumb';
import TreeVisualization from '../components/TreeVisualization';
import DashboardComponent from '../../CodeDashboard/components/DashboardComponent';
import useDashboardHover from '../../CodeDashboard/hooks/UseDashboardHover';
import { fetchAllNodeData } from '../services/nodeAPI';
import '../../CodeCSS/App.css';

const NodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [node, setNode] = React.useState(null);
  const [children, setChildren] = React.useState([]);
  const [path, setPath] = React.useState([]);
  const [treeData, setTreeData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const {
    dashboardOpen,
    handleHoverEnter,
    handleHoverLeave,
    handleDashboardEnter,
    handleDashboardLeave
  } = useDashboardHover();

  // Fetch node data
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { node, children, path, tree } = await fetchAllNodeData(id);
        setNode(node);
        setChildren(children);
        setPath(path);
        setTreeData(tree);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return (
    <div className="page-container">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading node details...</p>
      </div>
    </div>
  );

  if (!node) return (
    <div className="page-container">
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <h3>Node not found or unavailable</h3>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <DashboardComponent 
        dashboardOpen={dashboardOpen}
        handleHoverEnter={handleHoverEnter}
        handleHoverLeave={handleHoverLeave}
        handleDashboardEnter={handleDashboardEnter}
        handleDashboardLeave={handleDashboardLeave}
      />
      <Breadcrumb path={path} />
      
      <div className="node-container">
        <NodeDetails node={node} />
        
        <CommentsSection nodeId={id}/>

        <h3 className="root-title">Children</h3>
        <ChildrenList children={children} />
        
        <ActionButtons node={node} navigate={navigate} nodeId={id} />

        <TreeVisualization treeData={treeData} maxDepth={8} path={path} />
      </div>
    </div>
  );
};

export default NodePage;