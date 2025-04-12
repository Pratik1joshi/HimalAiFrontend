import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth services
export const authService = {
  signup: async (userData) => {
    return api.post('/auth/signup', {
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirm_password,
      first_name: userData.first_name,
      last_name: userData.last_name
    });
  },
  
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  
  verifyEmail: async (data) => {
    // Use correct format for verify endpoint
    return api.post('/auth/verify', {
      email: data.email,
      code: data.code
    });
  },
  
  resendVerification: async (email) => {
    return api.post('/auth/resend-verification', { email });
  }
};

// Set auth token for API calls
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
