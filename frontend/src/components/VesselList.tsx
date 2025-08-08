import React from 'react';
import { Vessel } from '../types';

interface VesselListProps {
  vessels: Record<string, Vessel>;
  selectedVessel: string | null;
  countryColorMap: Record<string, string>;
  onVesselSelect: (mmsi: string) => void;
}

const VesselList: React.FC<VesselListProps> = ({ 
  vessels, 
  selectedVessel, 
  countryColorMap,
  onVesselSelect 
}) => {
  const vesselArray = Object.values(vessels);
  
  if (vesselArray.length === 0) {
    return (
      <div className="vessel-list">
        <div style={{ textAlign: 'center', padding: '20px', color: '#8892b0' }}>
          No vessels found matching your filters
        </div>
      </div>
    );
  }
  
  return (
    <div className="vessel-list">
      {vesselArray.map(vessel => (
        <div 
          key={vessel.mmsi}
          className={`vessel-card ${selectedVessel === vessel.mmsi ? 'selected' : ''}`}
          onClick={() => onVesselSelect(vessel.mmsi)}
        >
          <div className="vessel-name">{vessel.name}</div>
          <div className="vessel-details">
            <div className="detail-label">MMSI:</div>
            <div>{vessel.mmsi}</div>
            <div className="detail-label">Type:</div>
            <div>{vessel.type}</div>
            <div className="detail-label">Country:</div>
            <div>{vessel.country}</div>
            <div className="detail-label">Points:</div>
            <div>{vessel.points.length}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VesselList;