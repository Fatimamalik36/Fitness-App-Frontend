// src/api/progressApi.js

import api from './axios';

export const getMyProgress = () => api.get('/progress').then((r) => r.data);

export const getProgressById = (id) => api.get(`/progress/${id}`).then((r) => r.data);

export const addProgress = (payload) => api.post('/progress', payload).then((r) => r.data);

export const updateProgress = (id, payload) =>
  api.put(`/progress/${id}`, payload).then((r) => r.data);

export const deleteProgress = (id) => api.delete(`/progress/${id}`).then((r) => r.data);
