import React from 'react';
import { Vessel, VesselData } from '../types';
import DateRangeSelector from './DateRangeSelector';
import VesselFilters from './VesselFilters';
import VesselSearch from './VesselSearch';
import VesselList from './VesselList';
import VesselCount from './VesselCount';
import VesselStats from './VesselStats';
import CountryChart from './CountryChart';
import MapControls from './MapControls';

interface SidebarProps {
  vesselData: VesselData;
  filteredVesselData: VesselData;
  countries: string[];
  shipTypes: string[];
  selectedCountries: string[];
  selectedShipTypes: string[];
  searchTerm: string;
  selectedVessel: string | null;
  countryChartData: any;
  countryColorMap: Record<string, string>;
  activeFilterCount: number;
  isLoading: boolean;
  onLoadData: (startDate: string, endDate: string) => void;
  onCountryFilterChange: (countries: string[]) => void;
  onShipTypeFilterChange: (types: string[]) => void;
  onSearchChange: (term: string) => void;
  onResetFilters: () => void;
  onVesselSelect: (mmsi: string) => void;
  onClearMap: () => void;
  onShowAll: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  vesselData,
  filteredVesselData,
  countries,
  shipTypes,
  selectedCountries,
  selectedShipTypes,
  searchTerm,
  selectedVessel,
  countryChartData,
  countryColorMap,
  activeFilterCount,
  isLoading,
  onLoadData,
  onCountryFilterChange,
  onShipTypeFilterChange,
  onSearchChange,
  onResetFilters,
  onVesselSelect,
  onClearMap,
  onShowAll
}) => {
  const selectedVesselData = selectedVessel ? vesselData[selectedVessel] : null;
  
  return (
    <nav className="sidebar">
      <h2>Arctic Marine Vessel Tracker</h2>
      
      <div className="vessels-panel">
        <DateRangeSelector 
          onLoadData={onLoadData}
          isLoading={isLoading}
        />
        
        <VesselFilters 
          countries={countries}
          shipTypes={shipTypes}
          selectedCountries={selectedCountries}
          selectedShipTypes={selectedShipTypes}
          activeFilterCount={activeFilterCount}
          onCountryFilterChange={onCountryFilterChange}
          onShipTypeFilterChange={onShipTypeFilterChange}
          onResetFilters={onResetFilters}
        />
        
        <MapControls 
          onClearMap={onClearMap}
          onShowAll={onShowAll}
        />
        
        <VesselCount 
          totalCount={Object.keys(vesselData).length}
          filteredCount={Object.keys(filteredVesselData).length}
        />
        
        <VesselSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <div className="section-title">
          <h3>Vessels</h3>
          <span className="filter-badge" id="visible-vessels">
            {Object.keys(filteredVesselData).length}
          </span>
        </div>
        
        <VesselList 
          vessels={filteredVesselData}
          selectedVessel={selectedVessel}
          countryColorMap={countryColorMap}
          onVesselSelect={onVesselSelect}
        />
        
        <CountryChart chartData={countryChartData} />
        
        <VesselStats vessel={selectedVesselData} />
      </div>
    </nav>
  );
};

export default Sidebar;