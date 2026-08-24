// src/pages/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';

const initialValues = {
  name: '',
  email: '',
  password: '',
  age: '',
  gender: 'prefer-not-to-say',
  fitnessGoal: 'general-fitness',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validateRegisterForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = { ...values, age: values.age === '' ? undefined : Number(values.age) };
      await register(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-brand">
          <span className="brand-mark">PULSE</span>
          <p>Train with intention.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Create your account</h1>
          <p className="auth-subtitle">Set your goal, and let's get moving.</p>

          {apiError && (
            <div className="form-alert" role="alert">
              {apiError}
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={values.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                value={values.age}
                onChange={handleChange}
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={values.gender} onChange={handleChange}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="fitnessGoal">Fitness goal</label>
            <select
              id="fitnessGoal"
              name="fitnessGoal"
              value={values.fitnessGoal}
              onChange={handleChange}
            >
              <option value="weight-loss">Weight loss</option>
              <option value="muscle-gain">Muscle gain</option>
              <option value="endurance">Endurance</option>
              <option value="general-fitness">General fitness</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
