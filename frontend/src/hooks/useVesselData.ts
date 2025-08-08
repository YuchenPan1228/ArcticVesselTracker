import { useState, useEffect, useCallback } from 'react';
import { fetchVesselData } from '../utils/api';
import { processVesselData, getUniqueCountries, getUniqueShipTypes } from '../utils/dataProcessing';
import { VesselData, GeoJSONResponse } from '../types';

interface UseVesselDataReturn {
  vesselData: VesselData;
  loading: boolean;
  error: string | null;
  countries: string[];
  shipTypes: string[];
  loadVesselData: (startDate: string, endDate: string) => Promise<void>;
}

export const useVesselData = (): UseVesselDataReturn => {
  const [vesselData, setVesselData] = useState<VesselData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [shipTypes, setShipTypes] = useState<string[]>([]);

  const loadVesselData = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data: GeoJSONResponse = await fetchVesselData(startDate, endDate);
      const processedData = processVesselData(data);
      
      setVesselData(processedData);
      setCountries(getUniqueCountries(processedData));
      setShipTypes(getUniqueShipTypes(processedData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error loading vessel data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    vesselData,
    loading,
    error,
    countries,
    shipTypes,
    loadVesselData
  };
};