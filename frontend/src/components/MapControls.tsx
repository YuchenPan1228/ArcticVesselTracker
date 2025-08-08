import React from 'react';

interface MapControlsProps {
  onClearMap: () => void;
  onShowAll: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ onClearMap, onShowAll }) => {
  return (
    <div className="button-container">
      <button id="clear-map" className="clear-map-button" onClick={onClearMap}>
        <i className="fas fa-times"></i> Clear Map
      </button>
      <button id="show-all" className="show-all-button" onClick={onShowAll}>
        <i className="fas fa-eye"></i> Show All Vessels
      </button>
    </div>
  );
};

export default MapControls;