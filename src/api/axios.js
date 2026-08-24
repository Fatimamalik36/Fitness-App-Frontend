// src/api/axios.js
// Single axios instance for the whole app. Attaches the JWT automatically
// and normalizes 401 handling in one place.

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize error responses and handle expired/invalid sessions globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token missing/expired/invalid — clear local session.
      // Individual pages/components decide whether to redirect,
      // since AuthContext owns navigation-relevant state.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    const message =
      error.response?.data?.message ||
      (error.request && !error.response
        ? 'Network error — is the backend running?'
        : 'Something went wrong. Please try again.');

    return Promise.reject({ ...error, message });
  }
);

export default api;
