import axios from "axios";

// Base API URL with proper prefix
const API_URL = "http://localhost:8000/api/v1";

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth service
export const authService = {
  // Login method - corresponds to the login in AuthContext
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // Signup method
  signup: async (userData) => {
    return apiClient.post('/auth/signup', userData);
  },

  // Verify email - using the correct endpoint name 'verify' instead of 'verify-email'
  verifyEmail: async (verificationData) => {
    return apiClient.post('/auth/verify', verificationData);
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return apiClient.post('/auth/request-password-reset', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return apiClient.post('/auth/reset-password', { token, password });
  },

  // Check admin status
  checkAdmin: async (email, token) => {
    return apiClient.get('/auth/check-admin', { 
      params: { email },
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

// Export the API client for other services
export default apiClient;
