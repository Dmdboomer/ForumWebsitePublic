import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardComponent from '../CodeDashboard/components/DashboardComponent';
import SearchBar from './SearchBar';
import useDashboardHover from '../CodeDashboard/hooks/UseDashboardHover';
import ScoreBar from '../utils/visuals/ScoreBar';
import { searchAPI } from './services/searchAPI';
import '../CodeCSS/App.css'

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  
  const {
    dashboardOpen,
    handleHoverEnter,
    handleHoverLeave,
    handleDashboardEnter,
    handleDashboardLeave
  } = useDashboardHover();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('q') || '';
    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';
    
    setSearchParams({ term, startDate, endDate });
    
    if (term) performSearch(term, startDate, endDate);
  }, [location.search]);

  const performSearch = async (term, startDate, endDate) => {
    setLoading(true);
    try {
      const data = await searchAPI.performSearch(term, startDate, endDate);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filters = {}) => {
    const params = new URLSearchParams({ q: searchTerm });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="page-container">
      <DashboardComponent 
        dashboardOpen={dashboardOpen}
        handleHoverEnter={handleHoverEnter}
        handleHoverLeave={handleHoverLeave}
        handleDashboardEnter={handleDashboardEnter}
        handleDashboardLeave={handleDashboardLeave}
      />

      <main className="search-page">
        <div className="search-header">
          <h1>Search Results</h1>
          <p>Explore matching knowledge items</p>
        </div>

        <SearchBar onSearch={handleSearch} initialFilters={searchParams} />

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching knowledge base...</p>
          </div>
        )}

        <section className="results-section">
          {results.length > 0 ? (
            <div className="results-container">
              <h2>Search Results ({results.length})</h2>
              <div className="results-grid">
                {results.map(result => (
                  <div key={result.id} className="result-card">
                    <a href={`/node/${result.id}`} className="result-link">
                      <div className="result-content">
                        <h3 className="result-title">{result.title}</h3>
                        <div className="result-meta">
                          <span>Leaves: {result.leaf_count_in_subtree || 0}</span>
                          <ScoreBar 
                            score={(result.score)} 
                            height={5}
                            color="#74f96b"
                            label="Weighted Average Score"
                          />
                          {result.date && <span>Date: {new Date(result.date).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !loading && searchParams.searchTerm && (
              <div className="empty-results">
                <p>No results found for "{searchParams.searchTerm}"</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                >
                  New Search
                </button>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
};

export default SearchResultsPage;