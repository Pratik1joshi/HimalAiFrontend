import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
// Add the API version prefix to match your backend configuration
const API_VERSION = '/api/v1'; 

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth services
export const authService = {
  signup: (userData) => {
    return api.post('/auth/signup', userData);
  },
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  verifyEmail: (data) => {
    return api.post('/auth/verify', data);
  }
};

export default api;
