// Vessel Data Types
export interface VesselPoint {
  timestamp: string;
  coordinates: [number, number]; // [longitude, latitude]
  sog: number; // Speed Over Ground in knots
}

export interface Vessel {
  mmsi: string;
  name: string;
  type: string;
  callsign: string;
  country: string;
  duration: string;
  distance: number | null;
  points: VesselPoint[];
  coordinates: [number, number][]; // Array of [longitude, latitude]
  timestamps: string[];
  sog: number[];
}

export interface VesselData {
  [mmsi: string]: Vessel;
}

// GeoJSON Types
export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    mmsi: string;
    name?: string;
    shiptype?: string;
    callsign?: string;
    country?: string;
    duration?: string;
    distance?: string;
    timestamp?: string;
    sog?: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Filter Types
export interface VesselFilters {
  countries: string[];
  shipTypes: string[];
  searchTerm: string;
}

// Chart Data Types
export interface CountryChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

// Map Types
export interface MapSource {
  id: string;
  type: 'geojson';
  data: any;
}

export interface MapLayer {
  id: string;
  type: string;
  source: string;
  paint: Record<string, any>;
}