// src/api/fitnessPlanApi.js

import api from './axios';

export const getFitnessPlans = () => api.get('/fitness-plans').then((r) => r.data);

export const getFitnessPlanById = (id) => api.get(`/fitness-plans/${id}`).then((r) => r.data);

export const createFitnessPlan = (payload) =>
  api.post('/fitness-plans', payload).then((r) => r.data);

export const updateFitnessPlan = (id, payload) =>
  api.put(`/fitness-plans/${id}`, payload).then((r) => r.data);

export const deleteFitnessPlan = (id) => api.delete(`/fitness-plans/${id}`).then((r) => r.data);
