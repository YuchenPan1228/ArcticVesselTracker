import React from 'react';
import { Vessel } from '../types';

interface VesselStatsProps {
  vessel: Vessel | null;
}

const VesselStats: React.FC<VesselStatsProps> = ({ vessel }) => {
  if (!vessel) {
    return (
      <div className="stats-panel">
        <h3>Vessel Statistics</h3>
        <div id="vessel-stats">
          <div className="stats-row">
            <span className="stats-label">Name:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">MMSI:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Type:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Callsign:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Country:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Duration:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Position Reports:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Distance Traveled:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Avg. Speed:</span>
            <span className="stats-value">-</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Time Range:</span>
            <span className="stats-value">-</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average speed
  const avgSpeed = vessel.sog.length > 0
    ? vessel.sog.reduce((sum, speed) => sum + speed, 0) / vessel.sog.length
    : 0;

  // Get time range
  const timeRange = vessel.timestamps.length > 0
    ? `${new Date(vessel.timestamps[0]).toLocaleDateString()} - ${new Date(vessel.timestamps[vessel.timestamps.length - 1]).toLocaleDateString()}`
    : 'N/A';

  return (
    <div className="stats-panel">
      <h3>Vessel Statistics</h3>
      <div id="vessel-stats">
        <div className="stats-row">
          <span className="stats-label">Name:</span>
          <span className="stats-value">{vessel.name}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">MMSI:</span>
          <span className="stats-value">{vessel.mmsi}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Type:</span>
          <span className="stats-value">{vessel.type}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Callsign:</span>
          <span className="stats-value">{vessel.callsign}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Country:</span>
          <span className="stats-value">{vessel.country}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Duration:</span>
          <span className="stats-value">{vessel.duration}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Position Reports:</span>
          <span className="stats-value">{vessel.points.length}</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Distance Traveled:</span>
          <span className="stats-value">
            {vessel.distance ? `${vessel.distance.toFixed(2)} km` : 'N/A'}
          </span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Avg. Speed:</span>
          <span className="stats-value">{avgSpeed.toFixed(1)} knots</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Time Range:</span>
          <span className="stats-value">{timeRange}</span>
        </div>
      </div>
    </div>
  );
};

export default VesselStats;