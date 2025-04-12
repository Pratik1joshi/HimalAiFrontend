"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";
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

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    setCurrentUser(null);
    setAuthTokens(null);
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
