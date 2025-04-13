import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance with auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error("No user data found in localStorage");
      return null;
    }
    
    const user = JSON.parse(userData);
    if (!user.id) {
      console.error("User ID missing in stored user data:", user);
      return null;
    }
    
    console.log("Found user ID:", user.id);
    return user.id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
};

// Transaction service object
export const transactionService = {
  // Get all transactions and handle filtering on frontend
  getAllTransactions: async (filters = {}) => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Log the actual URL with parameters to debug
      console.log("User ID for transaction request:", userId);
      
      // Build URL properly - CRITICAL FIX
      const url = new URL(`${API_URL}/transactions/`);
      url.searchParams.append('requesting_user_id', userId);
      
      // Add other parameters
      if (filters.skip) url.searchParams.append('skip', filters.skip);
      if (filters.limit) url.searchParams.append('limit', filters.limit);
      if (filters.startDate) url.searchParams.append('start_date', filters.startDate);
      if (filters.endDate) url.searchParams.append('end_date', filters.endDate);
      if (filters.category) url.searchParams.append('category', filters.category);
      if (filters.paymentMethod) url.searchParams.append('payment_method', filters.paymentMethod);
      
      console.log("Making request to:", url.toString());
      
      const response = await axios.get(url.toString(), {
        headers: getAuthHeader()
      });
      
      return response;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Get a specific transaction by id
  getTransactionById: async (id) => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Fix: Properly format URL with query parameters
      const response = await axios.get(`${API_URL}/transactions/${id}?requesting_user_id=${userId}`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  // Create a new transaction
  createTransaction: async (transactionData) => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Fix: Properly format URL with query parameters (no slash before question mark)
      const response = await axios.post(`${API_URL}/transactions?requesting_user_id=${userId}`, 
        transactionData, 
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating transaction:", error.response?.data || error);
      throw error;
    }
  },

  // Update an existing transaction
  updateTransaction: async (id, transactionData) => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Fix: URL formatting
      const response = await axios.patch(
        `${API_URL}/transactions/${id}?requesting_user_id=${userId}`, 
        transactionData, 
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Fix: URL formatting
      const response = await axios.delete(
        `${API_URL}/transactions/${id}?requesting_user_id=${userId}`, 
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error.response?.data || error);
      throw error;
    }
  },

  // Get transaction statistics
  getTransactionStats: async (period = 'month') => {
    try {
      // Get user ID - required by the API
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      
      // Fix: URL formatting for stats endpoint
      const response = await axios.get(
        `${API_URL}/transactions/stats?requesting_user_id=${userId}&period=${period}`, 
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching transaction stats:", error.response?.data || error);
      throw error;
    }
  }
};
