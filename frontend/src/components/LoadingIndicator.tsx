import React from 'react';

interface LoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isLoading, 
  message = 'Loading vessel data...' 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <span>{message}</span>
    </div>
  );
};

export default LoadingIndicator;