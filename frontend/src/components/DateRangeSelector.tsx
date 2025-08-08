import React from 'react';
import { useDateRange } from '../hooks/useDateRange';

interface DateRangeSelectorProps {
  onLoadData: (startDate: string, endDate: string) => void;
  isLoading: boolean;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onLoadData, isLoading }) => {
  const today = new Date().toISOString().slice(0, 10);
  const defaultStartDate = "2023-08-01";
  const defaultEndDate = "2023-08-07";
  
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isValidDateRange,
    dateRangeErrorMessage
  } = useDateRange(defaultStartDate, defaultEndDate);
  
  const handleLoadClick = () => {
    if (isValidDateRange) {
      onLoadData(startDate, endDate);
    }
  };
  
  return (
    <div>
      <div className="date-range-container">
        <div>
          <label htmlFor="start-date">Start Date:</label>
          <input 
            type="date" 
            id="start-date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={today}
          />
        </div>
        <div>
          <label htmlFor="end-date">End Date:</label>
          <input 
            type="date" 
            id="end-date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={today}
          />
        </div>
      </div>
      
      <button 
        id="load-btn" 
        onClick={handleLoadClick}
        disabled={!isValidDateRange || isLoading}
      >
        <i className="fas fa-sync-alt"></i> Load Vessel Data
      </button>
      
      {dateRangeErrorMessage && (
        <div className="error-message">
          {dateRangeErrorMessage}
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;