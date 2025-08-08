import React from 'react';

const MapOverlay: React.FC = () => {
  return (
    <div className="map-overlay">
      <h3>Vessel Trajectory</h3>
      <br />
      <p>This tool displays vessel movements using real AIS data.</p>
      <p>Select a vessel from the list to view its complete journey during the selected date range.</p>
      <p>Use filters to analyze specific vessel types and countries.</p>
    </div>
  );
};

export default MapOverlay;