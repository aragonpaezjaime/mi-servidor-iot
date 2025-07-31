import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../config/api';

export const useSensorData = (refreshInterval = 30000) => {
  const [recentData, setRecentData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchRecentData = useCallback(async () => {
    try {
      const response = await apiService.getRecentReadings();
      if (response.data.success) {
        setRecentData(response.data.data || []);
        setError(null);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('Error fetching recent data:', err);
      setError('Error al cargar datos recientes');
    }
  }, []);

  const fetchHistoricalData = useCallback(async (hours = 24) => {
    try {
      const response = await apiService.getHistoricalReadings(hours);
      if (response.data.success) {
        setHistoricalData(response.data.data || []);
        setError(null);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Error al cargar datos históricos');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiService.getStats();
      if (response.data.success) {
        setStats(response.data);
        setError(null);
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error al cargar estadísticas');
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRecentData(),
        fetchHistoricalData(24),
        fetchStats()
      ]);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching all data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchRecentData, fetchHistoricalData, fetchStats]);

  const retry = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchAllData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchAllData, refreshInterval]);

  // Group recent data by sensor for easy access
  const sensorData = recentData.reduce((acc, reading) => {
    acc[reading.deviceId] = reading;
    return acc;
  }, {});

  return {
    recentData,
    historicalData,
    stats,
    sensorData,
    loading,
    error,
    lastUpdate,
    retry,
    fetchHistoricalData
  };
};