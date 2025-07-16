import React, { useState } from 'react';
import { useEffect } from 'react';
import '../CodeCSS/App.css';


const SearchBar = ({ onSearch, initialFilters = {} }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDate, setStartDate] = useState(initialFilters.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters.endDate || '');

  useEffect(() => {
    setSearchTerm(initialFilters.term || '');
    setStartDate(initialFilters.startDate || '');
    setEndDate(initialFilters.endDate || '');
  }, [initialFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, { startDate, endDate });
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search knowledge repository..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="icon-search"></i> Search
        </button>
        <button 
          type="button" 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▲' : '▼'} Advanced
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-options">
          <div className="date-filters">
            <div className="date-filter">
              <label>From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-filter">
              <label>To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="date-input"
              />
            </div>
            <button
              type="button"
              className="btn-clear-dates"
              onClick={handleClearDates}
            >
              Clear Dates
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;