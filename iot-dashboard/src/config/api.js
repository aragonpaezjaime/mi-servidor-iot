import axios from 'axios';

const API_BASE_URL = 'https://mi-servidor-iot-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const endpoints = {
  recent: '/api/sensors/recent',
  historical: (hours) => `/api/sensors/historical/${hours}`,
  device: (deviceId) => `/api/sensors/${deviceId}`,
  stats: '/api/sensors/stats',
  readings: '/api/readings'
};

// API methods
export const apiService = {
  getRecentReadings: () => api.get(endpoints.recent),
  getHistoricalReadings: (hours = 24) => api.get(endpoints.historical(hours)),
  getDeviceReadings: (deviceId, limit = 100) => api.get(`${endpoints.device(deviceId)}?limit=${limit}`),
  getStats: () => api.get(endpoints.stats),
  getAllReadings: () => api.get(endpoints.readings),
};

export default api;