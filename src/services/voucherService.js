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

export const voucherService = {
  // Get all vouchers with pagination
  getVouchers: async (page = 1, limit = 100, activeOnly = false) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    const skip = (page - 1) * limit;
    return apiClient.get(`/vouchers?requesting_user_id=${requestingUserId}&skip=${skip}&limit=${limit}&active_only=${activeOnly}`);
  },

  // Get a specific voucher
  getVoucher: async (voucherId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.get(`/vouchers/${voucherId}?requesting_user_id=${requestingUserId}`);
  },

  // Create a new voucher (admin only)
  createVoucher: async (voucherData) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    // Make sure we properly format the data according to the backend schema
    const requestData = {
      code: voucherData.code,
      title: voucherData.title,
      description: voucherData.description || "",
      amount: parseFloat(voucherData.amount),
      type: voucherData.type || "FIXED",
      is_active: voucherData.is_active,
      // Fix: Use points_cost instead of points to match backend expectation
      points_cost: parseInt(voucherData.points_cost) || 0,
      valid_from: voucherData.valid_from ? new Date(voucherData.valid_from).toISOString() : null,
      valid_until: voucherData.valid_until ? new Date(voucherData.valid_until).toISOString() : null,
      usage_limit: parseInt(voucherData.usage_limit) || 1,
      min_purchase_amount: parseFloat(voucherData.min_purchase_amount) || 0,
      image_url: voucherData.image_url || null
    };
    
    console.log("Sending voucher data to backend:", requestData);
    
    return apiClient.post(`/vouchers?requesting_user_id=${requestingUserId}`, requestData);
  },

  // Update an existing voucher (admin only)
  updateVoucher: async (voucherId, voucherData) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    // Fix: Ensure points_cost is correctly named if present in the update data
    if (voucherData.points !== undefined && voucherData.points_cost === undefined) {
      voucherData.points_cost = voucherData.points;
      delete voucherData.points;
    }
    
    return apiClient.patch(`/vouchers/${voucherId}?requesting_user_id=${requestingUserId}`, voucherData);
  },

  // Delete a voucher (admin only)
  deleteVoucher: async (voucherId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.delete(`/vouchers/${voucherId}?requesting_user_id=${requestingUserId}`);
  },

  // Validate a voucher without redeeming
  validateVoucher: async (code, purchaseAmount = 0) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.post(
      `/vouchers/validate/${code}?requesting_user_id=${requestingUserId}&purchase_amount=${purchaseAmount}`
    );
  },

  // Redeem a voucher
  redeemVoucher: async (code, purchaseAmount = 0) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.post(
      `/vouchers/redeem/${code}?requesting_user_id=${requestingUserId}&purchase_amount=${purchaseAmount}`
    );
  },

  // Purchase a voucher with points
  purchaseVoucher: async (voucherId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    return apiClient.post(`/vouchers/${voucherId}/purchase?requesting_user_id=${requestingUserId}`);
  },

  // Get all vouchers purchased by the user
  getPurchasedVouchers: async () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const requestingUserId = currentUser.id;
    
    if (!requestingUserId) {
      throw new Error("User ID not found. Please log in again.");
    }
    
    // Try with v1 prefix - the API likely follows the same pattern as other endpoints
    return apiClient.get(`/v1/vouchers/purchased?requesting_user_id=${requestingUserId}`);
  },

  // Use a mock implementation as fallback if the API isn't ready yet
  getPurchasedVouchersFallback: async () => {
    return {
      data: [] // Return empty array as there are no purchased vouchers yet
    };
  }
};

export default voucherService;
