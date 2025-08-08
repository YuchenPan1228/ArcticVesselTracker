import React from 'react';

interface VesselSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const VesselSearch: React.FC<VesselSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-container">
      <label htmlFor="vessel-search">Search Vessel:</label>
      <input 
        type="text" 
        id="vessel-search" 
        placeholder="Type vessel name or MMSI..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default VesselSearch;