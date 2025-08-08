import React from 'react';

interface VesselFiltersProps {
  countries: string[];
  shipTypes: string[];
  selectedCountries: string[];
  selectedShipTypes: string[];
  activeFilterCount: number;
  onCountryFilterChange: (countries: string[]) => void;
  onShipTypeFilterChange: (types: string[]) => void;
  onResetFilters: () => void;
}

const VesselFilters: React.FC<VesselFiltersProps> = ({
  countries,
  shipTypes,
  selectedCountries,
  selectedShipTypes,
  activeFilterCount,
  onCountryFilterChange,
  onShipTypeFilterChange,
  onResetFilters
}) => {
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onCountryFilterChange(selected);
  };

  const handleShipTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    onShipTypeFilterChange(selected);
  };

  return (
    <div className="filters-container">
      <div className="filter-title">
        <h3>Filter Vessels</h3>
        <span className="filter-badge" id="active-filters">{activeFilterCount} active</span>
      </div>
      
      <div className="filter-row">
        <div>
          <label htmlFor="country-filter">Country:</label>
          <select 
            id="country-filter" 
            multiple
            value={selectedCountries}
            onChange={handleCountryChange}
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-row">
        <div>
          <label htmlFor="type-filter">Ship Type:</label>
          <select 
            id="type-filter" 
            multiple
            value={selectedShipTypes}
            onChange={handleShipTypeChange}
          >
            {shipTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="reset-filters" onClick={onResetFilters}>
        Reset Filters
      </div>
    </div>
  );
};

export default VesselFilters;