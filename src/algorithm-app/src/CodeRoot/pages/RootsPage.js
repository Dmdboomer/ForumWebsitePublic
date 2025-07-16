// src/pages/RootsPage.js
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DashboardComponent from '../../CodeDashboard/components/DashboardComponent';
import useDashboardHover from '../../CodeDashboard/hooks/UseDashboardHover';
import SearchBar from '../../CodeHome/SearchBar';
import RootsHeader from '../components/RootsHeader';
import RootsControls from '../components/RootsControls';
import RootsGrid from '../components/RootsGrid';
import CreateRootModal from '../components/CreateRootModal';
import LoadingState from '../components/LoadingState';
import { fetchRoots } from '../services/rootAPI';
import '../../CodeCSS/App.css';

const RootsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [roots, setRoots] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [sortOption, setSortOption] = React.useState('latest');
  const [searchParams, setSearchParams] = React.useState({});
  
  const {
    dashboardOpen,
    handleHoverEnter,
    handleHoverLeave,
    handleDashboardEnter,
    handleDashboardLeave
  } = useDashboardHover();

  // Parse search parameters from URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchParams({
      term: params.get('q') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || ''
    });
  }, [location.search]);

  const loadRoots = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchRoots(id);
    setRoots(data);
    setLoading(false);
  }, [id]);

  React.useEffect(() => {
    loadRoots();
  }, [loadRoots]);

  const handleNewRootCreated = () => {
    setShowCreateForm(false);
    loadRoots();
  };

  const handleSearch = (searchTerm, filters = {}) => {
    const params = new URLSearchParams({ q: searchTerm });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const sortedRoots = React.useMemo(() => {
    return [...roots].sort((a, b) => 
      sortOption === 'latest' 
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
  }, [roots, sortOption]);

  if (loading) return <LoadingState dashboardOpen={dashboardOpen} />;

  return (
    <div className="page-container">
      <DashboardComponent 
        dashboardOpen={dashboardOpen}
        handleHoverEnter={handleHoverEnter}
        handleHoverLeave={handleHoverLeave}
        handleDashboardEnter={handleDashboardEnter}
        handleDashboardLeave={handleDashboardLeave}
      />

      <main className="roots-container">
        <RootsHeader />
        
        <SearchBar 
          onSearch={handleSearch} 
          initialFilters={searchParams} 
        />

        <RootsControls 
          onCreateRoot={() => setShowCreateForm(true)}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {showCreateForm && (
          <CreateRootModal 
            onClose={handleNewRootCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <RootsGrid roots={sortedRoots} />
      </main>
    </div>
  );
};

export default RootsPage;