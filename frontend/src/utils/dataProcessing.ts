import { GeoJSONResponse, VesselData, Vessel } from '../types';

/**
 * Process GeoJSON data into structured vessel data
 * @param geojson The GeoJSON response from the API
 * @returns Processed vessel data
 */
export const processVesselData = (geojson: GeoJSONResponse): VesselData => {
  if (!geojson || !geojson.features) return {};
  
  const vesselData: VesselData = {};
  const countries = new Set<string>();
  const shipTypes = new Set<string>();
  
  geojson.features.forEach(feature => {
    const properties = feature.properties;
    const mmsi = properties.mmsi;
    const vesselName = properties.name || `Vessel ${mmsi}`;
    const shipType = properties.shiptype || 'Unknown';
    const callsign = properties.callsign || 'N/A';
    const country = properties.country || 'Unknown';
    const duration = properties.duration || 'N/A';
    const distance = properties.distance ? parseFloat(properties.distance) : null;
    
    // Add to sets for filters
    countries.add(country);
    shipTypes.add(shipType);
    
    if (!vesselData[mmsi]) {
      vesselData[mmsi] = {
        mmsi,
        name: vesselName,
        type: shipType,
        callsign: callsign,
        country: country,
        duration: duration,
        distance: distance,
        points: [],
        coordinates: [],
        timestamps: [],
        sog: []
      };
    }
    
    const coords = feature.geometry.coordinates;
    if (coords && coords.length === 2) {
      vesselData[mmsi].points.push({
        timestamp: properties.timestamp || '',
        coordinates: coords,
        sog: properties.sog || 0
      });
      vesselData[mmsi].coordinates.push(coords);
      vesselData[mmsi].timestamps.push(properties.timestamp || '');
      vesselData[mmsi].sog.push(properties.sog || 0);
    }
  });
  
  // Sort points by timestamp for each vessel
  Object.keys(vesselData).forEach(mmsi => {
    vesselData[mmsi].points.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Update coordinates array to match sorted points
    vesselData[mmsi].coordinates = vesselData[mmsi].points.map(p => p.coordinates);
    vesselData[mmsi].timestamps = vesselData[mmsi].points.map(p => p.timestamp);
    vesselData[mmsi].sog = vesselData[mmsi].points.map(p => p.sog);
  });
  
  return vesselData;
};

/**
 * Get unique countries from vessel data
 * @param vesselData The processed vessel data
 * @returns Array of unique countries
 */
export const getUniqueCountries = (vesselData: VesselData): string[] => {
  const countries = new Set<string>();
  
  Object.values(vesselData).forEach(vessel => {
    if (vessel.country) {
      countries.add(vessel.country);
    }
  });
  
  return Array.from(countries).sort();
};

/**
 * Get unique ship types from vessel data
 * @param vesselData The processed vessel data
 * @returns Array of unique ship types
 */
export const getUniqueShipTypes = (vesselData: VesselData): string[] => {
  const shipTypes = new Set<string>();
  
  Object.values(vesselData).forEach(vessel => {
    if (vessel.type) {
      shipTypes.add(vessel.type);
    }
  });
  
  return Array.from(shipTypes).sort();
};

/**
 * Filter vessels based on search term, countries, and ship types
 * @param vesselData The processed vessel data
 * @param searchTerm Search term for vessel name or MMSI
 * @param selectedCountries Array of selected countries
 * @param selectedShipTypes Array of selected ship types
 * @returns Filtered vessel data
 */
export const filterVessels = (
  vesselData: VesselData,
  searchTerm: string,
  selectedCountries: string[],
  selectedShipTypes: string[]
): VesselData => {
  const filteredData: VesselData = {};
  const search = searchTerm.toLowerCase();
  
  Object.entries(vesselData).forEach(([mmsi, vessel]) => {
    const matchesSearch = search === '' || 
      vessel.name.toLowerCase().includes(search) || 
      mmsi.includes(search);
    
    const matchesCountry = selectedCountries.length === 0 || 
      selectedCountries.includes(vessel.country);
    
    const matchesType = selectedShipTypes.length === 0 || 
      selectedShipTypes.includes(vessel.type);
    
    if (matchesSearch && matchesCountry && matchesType) {
      filteredData[mmsi] = vessel;
    }
  });
  
  return filteredData;
};

/**
 * Count vessels by country
 * @param vesselData The processed vessel data
 * @returns Object with country counts
 */
export const countVesselsByCountry = (vesselData: VesselData): Record<string, number> => {
  const countryCounts: Record<string, number> = {};
  
  Object.values(vesselData).forEach(vessel => {
    const country = vessel.country || 'Unknown';
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });
  
  return countryCounts;
};

/**
 * Create GeoJSON for vessel path
 * @param vessel The vessel data
 * @returns GeoJSON feature for the vessel path
 */
export const createVesselPathGeoJSON = (vessel: Vessel) => {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: vessel.coordinates
    }
  };
};

/**
 * Create GeoJSON for vessel points
 * @param vessel The vessel data
 * @returns GeoJSON feature collection for vessel points
 */
export const createVesselPointsGeoJSON = (vessel: Vessel) => {
  return {
    type: 'FeatureCollection' as const,
    features: vessel.points.map(point => ({
      type: 'Feature' as const,
      properties: {
        timestamp: point.timestamp,
        sog: point.sog
      },
      geometry: {
        type: 'Point' as const,
        coordinates: point.coordinates
      }
    }))
  };
};