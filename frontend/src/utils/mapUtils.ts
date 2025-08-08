import mapboxgl from 'mapbox-gl';
import { Vessel } from '../types';

// Chart colors that will be used for vessels by country
export const CHART_COLORS = [
  '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0',
  '#9966ff', '#ff9f40', '#8ac249', '#d45087',
  '#f95d6a', '#2f4b7c', '#665191', '#a05195'
];

/**
 * Generate a color map for countries
 * @param countries Array of country names
 * @returns Object mapping country names to colors
 */
export const generateCountryColorMap = (countries: string[]): Record<string, string> => {
  const colorMap: Record<string, string> = {};
  
  countries.forEach((country, index) => {
    colorMap[country] = CHART_COLORS[index % CHART_COLORS.length];
  });
  
  return colorMap;
};

/**
 * Create a Mapbox GL map instance
 * @param container HTML element ID for the map container
 * @returns Mapbox GL map instance
 */
export const createMap = (container: string): mapboxgl.Map => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZG9yamVlbGEiLCJhIjoiY20yZjV0ajVjMDVuNjJycHU5cmVoaWgzNSJ9.sKLqnfQLnaIrXYKpfht6aw';
  
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [10, 30],
    zoom: 2,
    minZoom: 1,
    maxZoom: 15
  });
  
  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  
  return map;
};

/**
 * Add vessel path to map
 * @param map Mapbox GL map instance
 * @param vessel Vessel data
 * @param countryColorMap Map of country colors
 * @param flyTo Whether to fly to the vessel path
 * @returns Object with source and layer IDs
 */
export const addVesselToMap = (
  map: mapboxgl.Map,
  vessel: Vessel,
  countryColorMap: Record<string, string>,
  flyTo: boolean = true
): { sourceIds: string[], layerIds: string[] } => {
  const mmsi = vessel.mmsi;
  const pathId = `vessel-path-${mmsi}`;
  const startId = `start-point-${mmsi}`;
  const endId = `end-point-${mmsi}`;
  const pointsId = `vessel-points-${mmsi}`;
  const highlightId = `vessel-points-highlight-${mmsi}`;
  
  const sourceIds = [pathId, startId, endId, pointsId];
  const layerIds = [pathId, startId, endId, pointsId, highlightId];
  
  // Remove existing layers and sources
  removeVesselFromMap(map, mmsi);
  
  if (!vessel || vessel.coordinates.length === 0) {
    return { sourceIds, layerIds };
  }
  
  const vesselColor = countryColorMap[vessel.country] || '#888';
  
  // Create line path for the vessel
  const pathData = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: vessel.coordinates
    }
  };
  
  // Create start and end markers
  const startPoint = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: vessel.coordinates[0]
    }
  };
  
  const endPoint = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: vessel.coordinates[vessel.coordinates.length - 1]
    }
  };
  
  // Create point collection for all positions
  const pointsData = {
    type: 'FeatureCollection' as const,
    features: vessel.coordinates.map((coord, index) => ({
      type: 'Feature' as const,
      properties: {
        timestamp: vessel.timestamps[index],
        sog: vessel.sog[index] || 0
      },
      geometry: {
        type: 'Point' as const,
        coordinates: coord
      }
    }))
  };
  
  // Add the path to the map
  map.addSource(pathId, {
    type: 'geojson',
    data: pathData
  });
  
  map.addLayer({
    id: pathId,
    type: 'line',
    source: pathId,
    paint: {
      'line-color': vesselColor,
      'line-width': 2,
      'line-opacity': 0.8
    }
  });
  
  // Add start point
  map.addSource(startId, {
    type: 'geojson',
    data: startPoint
  });
  
  map.addLayer({
    id: startId,
    type: 'circle',
    source: startId,
    paint: {
      'circle-radius': 8,
      'circle-color': '#9c27b0',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
  
  // Add end point
  map.addSource(endId, {
    type: 'geojson',
    data: endPoint
  });
  
  map.addLayer({
    id: endId,
    type: 'circle',
    source: endId,
    paint: {
      'circle-radius': 8,
      'circle-color': '#4caf50',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });
  
  // Add all points
  map.addSource(pointsId, {
    type: 'geojson',
    data: pointsData
  });
  
  // Base points
  map.addLayer({
    id: pointsId,
    type: 'circle',
    source: pointsId,
    paint: {
      'circle-radius': 3,
      'circle-color': vesselColor,
      'circle-opacity': 0.7
    }
  });
  
  // Highlight points
  map.addLayer({
    id: highlightId,
    type: 'circle',
    source: pointsId,
    paint: {
      'circle-radius': 4,
      'circle-color': vesselColor,
      'circle-opacity': 0.9
    }
  });
  
  // Add popups to points
  map.on('click', pointsId, (e) => {
    if (!e.features || e.features.length === 0) return;
    
    const feature = e.features[0];
    const geometry = feature.geometry as GeoJSON.Point;
    const coordinates = [...geometry.coordinates] as [number, number];
    const timestamp = feature.properties?.timestamp;
    const sog = feature.properties?.sog;
    
    // Ensure the point is visible
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`
        <div style="font-weight: bold; margin-bottom: 5px;">Position Report</div>
        <div><strong>Time:</strong> ${timestamp}</div>
        <div><strong>Speed:</strong> ${sog} knots</div>
      `)
      .addTo(map);
  });
  
  // Change cursor on hover
  map.on('mouseenter', pointsId, () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', pointsId, () => {
    map.getCanvas().style.cursor = '';
  });
  
  // Fly to the vessel path
  if (flyTo && vessel.coordinates.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    vessel.coordinates.forEach(coord => bounds.extend(coord as mapboxgl.LngLatLike));
    
    map.fitBounds(bounds, {
      padding: 100,
      duration: 2000
    });
  }
  
  return { sourceIds, layerIds };
};

/**
 * Remove vessel from map
 * @param map Mapbox GL map instance
 * @param mmsi Vessel MMSI
 */
export const removeVesselFromMap = (map: mapboxgl.Map, mmsi: string): void => {
  const ids = ['vessel-path', 'start-point', 'end-point', 'vessel-points', 'vessel-points-highlight'];
  
  ids.forEach(id => {
    const layerId = `${id}-${mmsi}`;
    const sourceId = `${id}-${mmsi}`;
    
    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  });
};

/**
 * Clear all vessels from map
 * @param map Mapbox GL map instance
 * @param visibleVessels Set of visible vessel MMSIs
 */
export const clearAllVesselsFromMap = (map: mapboxgl.Map, visibleVessels: Set<string>): void => {
  for (const mmsi of visibleVessels) {
    removeVesselFromMap(map, mmsi);
  }
};