// src/api/authApi.js

import api from './axios';

export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data);

export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data);

export const logoutUser = () => api.post('/auth/logout').then((r) => r.data);
