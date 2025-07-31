import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const StatsCard = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Generales</h3>
        <LoadingSpinner className="h-32" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Generales</h3>
        <div className="text-center text-gray-500 h-32 flex items-center justify-center">
          Error al cargar estadísticas
        </div>
      </div>
    );
  }

  const sensorColors = {
    'esp32-sala-01': '#ef4444',
    'esp32-cocina-02': '#3b82f6', 
    'esp32-dormitorio-03': '#10b981'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">Estadísticas Generales</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.summary.totalDevices}</div>
          <div className="text-sm text-gray-600">Sensores Activos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.summary.totalReadings}</div>
          <div className="text-sm text-gray-600">Total Lecturas</div>
        </div>
      </div>

      {/* Device Stats */}
      <div className="space-y-4">
        {stats.data && stats.data.map((device, index) => (
          <div key={device._id} className="border-l-4 pl-4 py-2" 
               style={{ borderLeftColor: sensorColors[device._id] || '#6b7280' }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{device._id}</h4>
              <span className="text-xs text-gray-500">{device.location}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Temperature Stats */}
              <div>
                <div className="text-gray-600 mb-1">Temperatura</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Promedio:</span>
                    <span className="font-medium">{device.avgTemperature?.toFixed(1) || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-500">Min:</span>
                    </div>
                    <span className="font-medium">{device.minTemperature || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span className="text-gray-500">Max:</span>
                    </div>
                    <span className="font-medium">{device.maxTemperature || 0}°C</span>
                  </div>
                </div>
              </div>

              {/* Humidity Stats */}
              <div>
                <div className="text-gray-600 mb-1">Humedad</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Promedio:</span>
                    <span className="font-medium">{device.avgHumidity?.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-500">Min:</span>
                    </div>
                    <span className="font-medium">{device.minHumidity || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span className="text-gray-500">Max:</span>
                    </div>
                    <span className="font-medium">{device.maxHumidity || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Lecturas: {device.totalReadings}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;