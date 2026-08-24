// src/pages/Profile.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, deleteAccount } from '../api/userApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { updateStoredUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProfile();
      setProfile(res.data);
      setValues(res.data);
    } catch (err) {
      setError(err.message || 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    setError('');
    try {
      const res = await updateProfile({
        name: values.name,
        email: values.email,
        age: values.age === '' ? undefined : Number(values.age),
        gender: values.gender,
        fitnessGoal: values.fitnessGoal,
      });
      setProfile(res.data);
      updateStoredUser({ name: res.data.name, email: res.data.email });
      setSaveMessage('Profile updated.');
    } catch (err) {
      setError(err.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Could not delete your account.');
    }
  };

  if (loading) return <Loading label="Loading your profile…" />;
  if (error && !profile) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="page-subtitle">Manage your account information.</p>
        </div>
      </div>

      <div className="card profile-card">
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}
          {saveMessage && <div className="form-success">{saveMessage}</div>}

          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={values.name || ''} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                value={values.age ?? ''}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={values.gender || ''} onChange={handleChange}>
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
              value={values.fitnessGoal || ''}
              onChange={handleChange}
            >
              <option value="weight-loss">Weight loss</option>
              <option value="muscle-gain">Muscle gain</option>
              <option value="endurance">Endurance</option>
              <option value="general-fitness">General fitness</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <div className="field">
            <label>Role</label>
            <input value={profile.role} disabled />
          </div>

          <div className="field">
            <label>Member since</label>
            <input value={new Date(profile.createdAt).toLocaleDateString()} disabled />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <div className="card danger-zone">
        <h2>Danger zone</h2>
        <p className="muted">Deleting your account permanently removes your data.</p>
        {!confirmingDelete ? (
          <button className="btn btn-danger" onClick={() => setConfirmingDelete(true)}>
            Delete account
          </button>
        ) : (
          <div className="confirm-row">
            <span>Are you sure? This can't be undone.</span>
            <button className="btn btn-danger" onClick={handleDelete}>
              Yes, delete my account
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
