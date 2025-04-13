"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(null);

  // Setup axios instance for authenticated requests
  const authAxios = axios.create({
    baseURL: API_URL
  });

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = authAxios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => authAxios.interceptors.request.eject(interceptor);
  }, []);

  // Check for existing authentication on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        
        if (userJson && token) {
          const user = JSON.parse(userJson);
          // Ensure is_admin is explicitly a boolean
          user.is_admin = user.is_admin === true;
          setCurrentUser(user);
          setAuthTokens({
            accessToken: token,
            refreshToken: localStorage.getItem('refresh_token')
          });
          
          // Optionally validate token with backend
          // await authAxios.get('/api/v1/users/me');
        }
      } catch (error) {
        console.error("Error loading user:", error);
        logout(); // Clear invalid session
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Create form data for OAuth2 authentication
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await axios.post(`${API_URL}/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, user } = response.data;
      
      // Check if user is admin
      try {
        console.log("Checking admin status for:", email);
        const adminCheckResponse = await axios.get(`${API_URL}/auth/check-admin`, {
          params: { email: email },
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        console.log("Admin check response data:", adminCheckResponse.data);
        
        // Fix: Extract is_admin property from response object
        const isAdmin = adminCheckResponse.data.is_admin === true;
        user.is_admin = isAdmin;
        console.log("User admin status set to:", isAdmin);
      } catch (adminCheckError) {
        console.error("Error checking admin status:", adminCheckError);
        user.is_admin = false;
      }
      
      // Store tokens and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setAuthTokens({
        accessToken: access_token,
        refreshToken: refresh_token
      });
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const logout = async () => {
    console.log("Logout function called");
    try {
      // Send request to backend to invalidate token if you have such an endpoint
      console.log("Current user state:", currentUser);
      console.log("AuthTokens state:", authTokens);
      console.log("Access token from localStorage:", localStorage.getItem('access_token'));
      
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        console.log("Attempting to call backend logout endpoint");
        try {
          await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log("Backend logout request successful");
        } catch (apiError) {
          console.error("Backend logout request failed:", apiError.response?.status, apiError.response?.data || apiError.message);
        }
      } else {
        console.log("No access token found, skipping backend logout call");
      }
    } catch (error) {
      console.error("Error during logout process:", error);
      // Continue with logout even if backend request fails
    } finally {
      // Clear local storage
      console.log("Clearing local storage and resetting state");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setAuthTokens(null);
      console.log("Logout process completed");
    }
  };

  const value = {
    currentUser,
    authTokens,
    login,
    logout,
    authAxios,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
