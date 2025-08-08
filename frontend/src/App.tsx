import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import MapLegend from './components/MapLegend';
import MapOverlay from './components/MapOverlay';
import LoadingIndicator from './components/LoadingIndicator';
import { useVesselData } from './hooks/useVesselData';
import { useVesselFilters } from './hooks/useVesselFilters';
import { useMapbox } from './hooks/useMapbox';
import { useChartData } from './hooks/useChartData';
import './styles/global.css';
import { Vessel } from './types';

const App: React.FC = () => {
  // Load vessel data
  const { 
    vesselData, 
    loading, 
    error, 
    countries, 
    shipTypes, 
    loadVesselData 
  } = useVesselData();
  
  // Filter vessels
  const {
    searchTerm,
    selectedCountries,
    selectedShipTypes,
    filteredVesselData,
    activeFilterCount,
    setSearchTerm,
    setSelectedCountries,
    setSelectedShipTypes,
    resetFilters
  } = useVesselFilters(vesselData);
  
  // Map controls
  const {
    mapContainer,
    visibleVessels,
    selectedVessel,
    showVessel,
    hideVessel,
    selectVessel,
    clearAllVessels,
    showAllVessels
  } = useMapbox();
  
  // Chart data
  const { countryChartData, countryColorMap } = useChartData(vesselData);
  
  // Handle vessel selection
  const handleVesselSelect = (mmsi: string) => {
    if (selectedVessel === mmsi) {
      // Deselect if already selected
      hideVessel(mmsi);
      selectVessel(null);
    } else {
      // Select new vessel
      const vessel = vesselData[mmsi];
      if (vessel) {
        showVessel(vessel, countryColorMap);
        selectVessel(mmsi);
      }
    }
  };
  
  // Handle show all vessels
  const handleShowAll = () => {
    const vessels = Object.values(filteredVesselData);
    showAllVessels(vessels, countryColorMap);
  };
  
  // Auto-load data on first render
  useEffect(() => {
    const startDate = "2023-08-01";
    const endDate = "2023-08-07";
    loadVesselData(startDate, endDate);
  }, [loadVesselData]);
  
  // Auto-select first vessel when data loads
  useEffect(() => {
    if (!loading && Object.keys(vesselData).length > 0 && !selectedVessel) {
      const firstVessel = Object.keys(vesselData)[0];
      handleVesselSelect(firstVessel);
    }
  }, [loading, vesselData, selectedVessel]);
  
  return (
    <div className="app">
      <Sidebar 
        vesselData={vesselData}
        filteredVesselData={filteredVesselData}
        countries={countries}
        shipTypes={shipTypes}
        selectedCountries={selectedCountries}
        selectedShipTypes={selectedShipTypes}
        searchTerm={searchTerm}
        selectedVessel={selectedVessel}
        countryChartData={countryChartData}
        countryColorMap={countryColorMap}
        activeFilterCount={activeFilterCount}
        isLoading={loading}
        onLoadData={loadVesselData}
        onCountryFilterChange={setSelectedCountries}
        onShipTypeFilterChange={setSelectedShipTypes}
        onSearchChange={setSearchTerm}
        onResetFilters={resetFilters}
        onVesselSelect={handleVesselSelect}
        onClearMap={clearAllVessels}
        onShowAll={handleShowAll}
      />
      
      <Map id="map" />
      
      <MapLegend />
      <MapOverlay />
      <LoadingIndicator isLoading={loading} />
      
      {error && (
        <div className="error-message" style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default App;