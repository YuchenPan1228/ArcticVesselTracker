import React from 'react';
import { useMapbox } from '../hooks/useMapbox';

interface MapProps {
  id: string;
}

const Map: React.FC<MapProps> = ({ id }) => {
  const { mapContainer } = useMapbox();

  return (
    <div 
      id={id} 
      ref={mapContainer} 
      className="map-container" 
    />
  );
};

export default Map;