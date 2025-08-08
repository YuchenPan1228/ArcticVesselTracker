import React from 'react';

interface VesselCountProps {
  totalCount: number;
  filteredCount: number;
}

const VesselCount: React.FC<VesselCountProps> = ({ totalCount, filteredCount }) => {
  return (
    <div className="vessel-count">
      <div className="count-value" id="total-vessels">{totalCount}</div>
      <div className="count-label">Total Vessels</div>
      <div className="count-value" id="filtered-vessels">{filteredCount}</div>
      <div className="count-label">Filtered Vessels</div>
    </div>
  );
};

export default VesselCount;