import { GeoJSONResponse } from '../types';

/**
 * Fetch vessel data from the API
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Promise with GeoJSON response
 */
export const fetchVesselData = async (startDate: string, endDate: string): Promise<GeoJSONResponse> => {
  try {
    const response = await fetch(`/api/vessels?start_date=${startDate}&end_date=${endDate}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch vessel data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vessel data:', error);
    throw error;
  }
};

/**
 * Check API health
 * @returns Promise with health status
 */
export const checkApiHealth = async (): Promise<{ status: string }> => {
  try {
    const response = await fetch('/api/health');
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};