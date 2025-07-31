import { useState } from 'react';
import { Activity, RefreshCw, Clock, Wifi } from 'lucide-react';
import { useSensorData } from './hooks/useSensorData';
import SensorCard from './components/SensorCard';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import StatsCard from './components/StatsCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    sensorData,
    historicalData,
    stats,
    loading,
    error,
    lastUpdate,
    retry
  } = useSensorData(30000); // Refresh every 30 seconds

  const sensorColors = {
    'esp32-sala-01': '#ef4444',
    'esp32-cocina-02': '#3b82f6', 
    'esp32-dormitorio-03': '#10b981'
  };

  const expectedSensors = [
    'esp32-sala-01',
    'esp32-cocina-02', 
    'esp32-dormitorio-03'
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await retry();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Nunca';
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard IoT</h1>
                <p className="text-sm text-gray-500">Monitoreo de Sensores DHT11</p>
              </div>
            </div>

            {/* Status and Refresh */}
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className={`w-4 h-4 ${error ? 'text-red-500' : 'text-green-500'}`} />
                <span className={error ? 'text-red-600' : 'text-green-600'}>
                  {error ? 'Desconectado' : 'Conectado'}
                </span>
              </div>

              {/* Last Update */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Última actualización: {formatLastUpdate(lastUpdate)}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Error */}
        {error && !loading && (
          <ErrorMessage 
            message={error}
            onRetry={retry}
            className="mb-6"
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="w-12 h-12" />
          </div>
        )}

        {!loading && (
          <>
            {/* Sensor Cards */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estado Actual de Sensores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expectedSensors.map((sensorId, index) => (
                  <SensorCard
                    key={sensorId}
                    sensor={sensorData[sensorId]}
                    loading={false}
                    error={!sensorData[sensorId] ? 'Sensor no disponible' : null}
                    sensorColor={sensorColors[sensorId]}
                  />
                ))}
              </div>
            </section>

            {/* Charts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gráficas Históricas (24 horas)</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TemperatureChart
                  data={historicalData}
                  loading={false}
                  error={error}
                  onRetry={retry}
                />
                <HumidityChart
                  data={historicalData}
                  loading={false}
                  error={error}
                  onRetry={retry}
                />
              </div>
            </section>

            {/* Stats */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <StatsCard
                    stats={stats}
                    loading={false}
                    error={error}
                  />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Sistema</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sensores Configurados:</span>
                      <span className="font-medium">{expectedSensors.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sensores Activos:</span>
                      <span className="font-medium text-green-600">
                        {Object.keys(sensorData).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intervalo de Actualización:</span>
                      <span className="font-medium">30 segundos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado del Sistema:</span>
                      <span className={`font-medium ${error ? 'text-red-600' : 'text-green-600'}`}>
                        {error ? 'Error' : 'Operativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            Dashboard IoT - Monitoreo de Sensores ESP32 con DHT11
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;