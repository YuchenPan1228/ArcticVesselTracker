import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="legend">
      <h3>Index</h3>
      <div className="legend-item">
        <div className="legend-color" style={{ background: '#9c27b0' }}></div>
        <span>Starting Point</span>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{ background: '#4caf50' }}></div>
        <span>Ending Point</span>
      </div>
      <div className="legend-item">
        <div className="legend-color" style={{ background: '#00b4d8' }}></div>
        <span>Position Points</span>
      </div>
    </div>
  );
};

export default MapLegend;