import React, { useRef, useEffect } from 'react';
import { Chart, ChartConfiguration, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { CountryChartData } from '../types';

// Register required Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface CountryChartProps {
  chartData: CountryChartData;
}

const CountryChart: React.FC<CountryChartProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#a8b2d1',
              font: {
                size: 10
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw} vessels`;
              }
            }
          }
        },
        animation: {
          duration: 2000
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-container">
      <div className="chart-title">
        <h3>Vessel Distribution</h3>
      </div>
      <div className="chart-wrapper">
        <canvas ref={chartRef} id="country-chart"></canvas>
      </div>
    </div>
  );
};

export default CountryChart;