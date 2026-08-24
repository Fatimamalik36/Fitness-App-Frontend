// src/api/workoutApi.js

import api from './axios';

export const getWorkouts = () => api.get('/workouts').then((r) => r.data);

export const getWorkoutById = (id) => api.get(`/workouts/${id}`).then((r) => r.data);

export const createWorkout = (payload) => api.post('/workouts', payload).then((r) => r.data);

export const updateWorkout = (id, payload) =>
  api.put(`/workouts/${id}`, payload).then((r) => r.data);

export const deleteWorkout = (id) => api.delete(`/workouts/${id}`).then((r) => r.data);
