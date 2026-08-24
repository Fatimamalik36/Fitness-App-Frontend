// src/utils/validation.js

export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validateRegisterForm = (values) => {
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Name is required';

  if (!values.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (values.age !== '' && values.age !== undefined && Number(values.age) < 0) {
    errors.age = 'Age cannot be negative';
  }

  return errors;
};

export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) errors.password = 'Password is required';

  return errors;
};

export const validateWorkoutForm = (values) => {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  if (!values.description?.trim()) errors.description = 'Description is required';
  if (!values.duration || Number(values.duration) <= 0) {
    errors.duration = 'Duration must be a positive number';
  }
  return errors;
};

export const validateExerciseForm = (values) => {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Name is required';
  if (!values.description?.trim()) errors.description = 'Description is required';
  if (!values.muscleGroup) errors.muscleGroup = 'Muscle group is required';
  if (!values.instructions?.trim()) errors.instructions = 'Instructions are required';
  return errors;
};

export const validateFitnessPlanForm = (values) => {
  const errors = {};
  if (!values.name?.trim()) errors.name = 'Plan name is required';
  if (!values.description?.trim()) errors.description = 'Description is required';
  if (!values.goal) errors.goal = 'Goal is required';
  if (!values.duration || Number(values.duration) <= 0) {
    errors.duration = 'Duration must be a positive number';
  }
  return errors;
};

export const validateProgressForm = (values) => {
  const errors = {};
  if (!values.workout) errors.workout = 'Select a workout';
  if (!values.duration || Number(values.duration) <= 0) {
    errors.duration = 'Duration must be a positive number';
  }
  if (!values.date) errors.date = 'Date is required';
  return errors;
};
