import { useState, useCallback } from 'react';

interface UseDateRangeReturn {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  isValidDateRange: boolean;
  dateRangeErrorMessage: string | null;
}

export const useDateRange = (initialStartDate: string, initialEndDate: string): UseDateRangeReturn => {
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  
  const isValidDateRange = useCallback(() => {
    if (!startDate || !endDate) {
      return false;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start <= end;
  }, [startDate, endDate]);
  
  const dateRangeErrorMessage = useCallback(() => {
    if (!startDate || !endDate) {
      return 'Please select both start and end dates';
    }
    
    if (!isValidDateRange()) {
      return 'End date must be after start date';
    }
    
    return null;
  }, [startDate, endDate, isValidDateRange]);
  
  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isValidDateRange: isValidDateRange(),
    dateRangeErrorMessage: dateRangeErrorMessage()
  };
};