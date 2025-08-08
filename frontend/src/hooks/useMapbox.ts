import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Vessel } from '../types';
import { createMap, addVesselToMap, removeVesselFromMap, clearAllVesselsFromMap } from '../utils/mapUtils';

interface UseMapboxReturn {
  mapContainer: React.RefObject<HTMLDivElement>;
  visibleVessels: Set<string>;
  selectedVessel: string | null;
  showVessel: (vessel: Vessel, countryColorMap: Record<string, string>, flyTo?: boolean) => void;
  hideVessel: (mmsi: string) => void;
  selectVessel: (mmsi: string | null) => void;
  clearAllVessels: () => void;
  showAllVessels: (vessels: Vessel[], countryColorMap: Record<string, string>) => void;
}

export const useMapbox = (): UseMapboxReturn => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [visibleVessels, setVisibleVessels] = useState<Set<string>>(new Set());
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = createMap(mapContainer.current.id);
      
      // Clean up on unmount
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }
  }, []);

  const showVessel = (vessel: Vessel, countryColorMap: Record<string, string>, flyTo: boolean = true) => {
    if (!mapInstance.current) return;
    
    addVesselToMap(mapInstance.current, vessel, countryColorMap, flyTo);
    setVisibleVessels(prev => new Set(prev).add(vessel.mmsi));
  };

  const hideVessel = (mmsi: string) => {
    if (!mapInstance.current) return;
    
    removeVesselFromMap(mapInstance.current, mmsi);
    setVisibleVessels(prev => {
      const updated = new Set(prev);
      updated.delete(mmsi);
      return updated;
    });
    
    if (selectedVessel === mmsi) {
      setSelectedVessel(null);
    }
  };

  const selectVessel = (mmsi: string | null) => {
    setSelectedVessel(mmsi);
  };

  const clearAllVessels = () => {
    if (!mapInstance.current) return;
    
    clearAllVesselsFromMap(mapInstance.current, visibleVessels);
    setVisibleVessels(new Set());
    setSelectedVessel(null);
  };

  const showAllVessels = (vessels: Vessel[], countryColorMap: Record<string, string>) => {
    if (!mapInstance.current) return;
    
    // Clear existing vessels
    clearAllVessels();
    
    // Add all vessels
    const newVisibleVessels = new Set<string>();
    vessels.forEach(vessel => {
      addVesselToMap(mapInstance.current!, vessel, countryColorMap, false);
      newVisibleVessels.add(vessel.mmsi);
    });
    
    setVisibleVessels(newVisibleVessels);
  };

  return {
    mapContainer,
    visibleVessels,
    selectedVessel,
    showVessel,
    hideVessel,
    selectVessel,
    clearAllVessels,
    showAllVessels
  };
};