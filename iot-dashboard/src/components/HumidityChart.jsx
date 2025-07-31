import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HumidityChart = ({ data, loading, error, onRetry }) => {
  const sensorColors = {
    'esp32-sala-01': '#ef4444',
    'esp32-cocina-02': '#3b82f6', 
    'esp32-dormitorio-03': '#10b981'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Humedad en Tiempo Real (%)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Tiempo'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Humedad (%)'
        },
        min: 0,
        max: 100
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <LoadingSpinner className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <ErrorMessage 
          message="Error al cargar datos de humedad" 
          onRetry={onRetry}
          className="h-64 flex flex-col justify-center"
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos de humedad disponibles
        </div>
      </div>
    );
  }

  // Group data by device
  const deviceData = {};
  data.forEach(reading => {
    if (!deviceData[reading.deviceId]) {
      deviceData[reading.deviceId] = [];
    }
    deviceData[reading.deviceId].push(reading);
  });

  // Sort each device data by timestamp
  Object.keys(deviceData).forEach(deviceId => {
    deviceData[deviceId].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });

  // Create labels from timestamps
  const allTimestamps = [...new Set(data.map(reading => reading.timestamp))].sort();
  const labels = allTimestamps.map(timestamp => 
    new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  );

  // Create datasets for each sensor
  const datasets = Object.keys(deviceData).map(deviceId => ({
    label: deviceId,
    data: allTimestamps.map(timestamp => {
      const reading = deviceData[deviceId].find(r => r.timestamp === timestamp);
      return reading ? reading.humidity : null;
    }),
    borderColor: sensorColors[deviceId] || '#6b7280',
    backgroundColor: `${sensorColors[deviceId] || '#6b7280'}20`,
    tension: 0.4,
    pointBackgroundColor: sensorColors[deviceId] || '#6b7280',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: false
  }));

  const chartData = {
    labels,
    datasets
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HumidityChart;