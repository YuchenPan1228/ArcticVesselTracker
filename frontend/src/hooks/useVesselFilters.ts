import { useState, useCallback, useMemo } from 'react';
import { VesselData } from '../types';
import { filterVessels } from '../utils/dataProcessing';

interface UseVesselFiltersReturn {
  searchTerm: string;
  selectedCountries: string[];
  selectedShipTypes: string[];
  filteredVesselData: VesselData;
  activeFilterCount: number;
  setSearchTerm: (term: string) => void;
  setSelectedCountries: (countries: string[]) => void;
  setSelectedShipTypes: (types: string[]) => void;
  resetFilters: () => void;
}

export const useVesselFilters = (vesselData: VesselData): UseVesselFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedShipTypes, setSelectedShipTypes] = useState<string[]>([]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCountries([]);
    setSelectedShipTypes([]);
  }, []);

  const filteredVesselData = useMemo(() => {
    return filterVessels(
      vesselData,
      searchTerm,
      selectedCountries,
      selectedShipTypes
    );
  }, [vesselData, searchTerm, selectedCountries, selectedShipTypes]);

  const activeFilterCount = useMemo(() => {
    return (
      (searchTerm ? 1 : 0) +
      (selectedCountries.length > 0 ? 1 : 0) +
      (selectedShipTypes.length > 0 ? 1 : 0)
    );
  }, [searchTerm, selectedCountries, selectedShipTypes]);

  return {
    searchTerm,
    selectedCountries,
    selectedShipTypes,
    filteredVesselData,
    activeFilterCount,
    setSearchTerm,
    setSelectedCountries,
    setSelectedShipTypes,
    resetFilters
  };
};