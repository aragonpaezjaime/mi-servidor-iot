import { Thermometer, Droplets, MapPin, Clock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const SensorCard = ({ sensor, loading, error, sensorColor }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: sensorColor }}>
        <LoadingSpinner className="h-32" />
      </div>
    );
  }

  if (error || !sensor) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">Sensor no disponible</div>
          <div className="text-sm">{error || 'No hay datos'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" 
         style={{ borderLeftColor: sensorColor }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sensorColor }}></div>
          <h3 className="text-lg font-semibold text-gray-800">{sensor.deviceId}</h3>
        </div>
        <div className="text-xs text-gray-500 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatTime(sensor.timestamp)}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center space-x-2 mb-4 text-gray-600">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{sensor.location}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Temperatura</span>
          </div>
          <div className="text-3xl font-bold" style={{ color: sensorColor }}>
            {sensor.temperature}°C
          </div>
        </div>

        {/* Humidity */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Humedad</span>
          </div>
          <div className="text-3xl font-bold" style={{ color: sensorColor }}>
            {sensor.humidity}%
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Última actualización: {formatDate(sensor.timestamp)} a las {formatTime(sensor.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default SensorCard;