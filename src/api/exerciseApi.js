// src/api/exerciseApi.js

import api from './axios';

export const getExercises = () => api.get('/exercises').then((r) => r.data);

export const getExerciseById = (id) => api.get(`/exercises/${id}`).then((r) => r.data);

export const createExercise = (payload) => api.post('/exercises', payload).then((r) => r.data);

export const updateExercise = (id, payload) =>
  api.put(`/exercises/${id}`, payload).then((r) => r.data);

export const deleteExercise = (id) => api.delete(`/exercises/${id}`).then((r) => r.data);
