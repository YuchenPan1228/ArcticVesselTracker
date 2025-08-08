import { useMemo } from 'react';
import { VesselData } from '../types';
import { countVesselsByCountry } from '../utils/dataProcessing';
import { generateCountryColorMap } from '../utils/mapUtils';

interface UseChartDataReturn {
  countryChartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  };
  countryColorMap: Record<string, string>;
}

export const useChartData = (vesselData: VesselData): UseChartDataReturn => {
  const countryCounts = useMemo(() => countVesselsByCountry(vesselData), [vesselData]);
  
  const countryLabels = useMemo(() => Object.keys(countryCounts), [countryCounts]);
  
  const countryColorMap = useMemo(() => 
    generateCountryColorMap(countryLabels), 
    [countryLabels]
  );
  
  const countryChartData = useMemo(() => ({
    labels: countryLabels,
    datasets: [{
      data: Object.values(countryCounts),
      backgroundColor: countryLabels.map(country => countryColorMap[country]),
      borderWidth: 0
    }]
  }), [countryLabels, countryCounts, countryColorMap]);
  
  return {
    countryChartData,
    countryColorMap
  };
};