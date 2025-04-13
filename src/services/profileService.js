import axios from "axios";

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

export const profileService = {
  // Get current user's profile with points
  getUserProfile: async () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.get(`/users/profile?requesting_user_id=${requestingUserId}`);
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.patch(`/users/${requestingUserId}/profile?requesting_user_id=${requestingUserId}`, profileData);
  }
};

export default profileService;
