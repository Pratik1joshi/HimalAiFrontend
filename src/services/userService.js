import axios from "axios";

// Base API URL 
const API_URL = "http://localhost:8000/api";

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

export const userService = {
  getUsers: async (page = 1, limit = 10, search = '') => {
    const skip = (page - 1) * limit;
    
    // Get current user ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    // Build query with requesting_user_id parameter
    let url = `/users/?requesting_user_id=${requestingUserId}&skip=${skip}&limit=${limit}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    return apiClient.get(url);
  },

  getUser: async (userId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.get(`/users/${userId}?requesting_user_id=${requestingUserId}`);
  },

  updateUser: async (userId, userData) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.patch(`/users/${userId}?requesting_user_id=${requestingUserId}`, userData);
  },

  deleteUser: async (userId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.delete(`/users/${userId}?requesting_user_id=${requestingUserId}`);
  },

  toggleUserStatus: async (userId, isActive) => {
    return userService.updateUser(userId, { is_active: isActive });
  },

  toggleAdminStatus: async (userId, isAdmin) => {
    return userService.updateUser(userId, { is_admin: isAdmin });
  }
};

export default apiClient;
