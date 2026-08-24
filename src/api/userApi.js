// src/api/userApi.js

import api from './axios';

export const getProfile = () => api.get('/users/profile').then((r) => r.data);

export const updateProfile = (payload) => api.put('/users/profile', payload).then((r) => r.data);

export const deleteAccount = () => api.delete('/users/profile').then((r) => r.data);

export const getAllUsers = () => api.get('/users').then((r) => r.data);

export const deleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);
