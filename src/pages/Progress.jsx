// src/pages/Progress.jsx

import { useEffect, useState } from 'react';
import {
  getMyProgress,
  addProgress,
  updateProgress,
  deleteProgress,
} from '../api/progressApi';
import { getWorkouts } from '../api/workoutApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import StatRing from '../components/StatRing';
import { validateProgressForm } from '../utils/validation';

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  workout: '',
  date: todayISO(),
  duration: '',
  caloriesBurned: '',
  completed: true,
};

export default function Progress() {
  const [history, setHistory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [historyRes, workoutsRes] = await Promise.all([getMyProgress(), getWorkouts()]);
      setHistory(historyRes.data || []);
      setWorkouts(workoutsRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your workout history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingRecord(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setForm({
      workout: record.workout?._id || '',
      date: record.date ? record.date.slice(0, 10) : todayISO(),
      duration: record.duration,
      caloriesBurned: record.caloriesBurned ?? '',
      completed: record.completed,
    });
    setFormErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProgressForm(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setFormError('');
    try {
      const payload = {
        workout: form.workout,
        date: new Date(form.date).toISOString(),
        duration: Number(form.duration),
        caloriesBurned: form.caloriesBurned === '' ? 0 : Number(form.caloriesBurned),
        completed: form.completed,
      };
      if (editingRecord) {
        await updateProgress(editingRecord._id, payload);
      } else {
        await addProgress(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message || 'Could not save this progress record.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Delete this progress record?')) return;
    try {
      await deleteProgress(record._id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete this record.');
    }
  };

  if (loading) return <Loading label="Loading your progress…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const totalCompleted = history.filter((h) => h.completed).length;
  const totalCalories = history.reduce((sum, h) => sum + (h.caloriesBurned || 0), 0);
  const totalMinutes = history.reduce((sum, h) => sum + (h.duration || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Workout Progress</h1>
          <p className="page-subtitle">Log and review your training history.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Log workout
        </button>
      </div>

      <div className="stat-grid stat-grid-compact">
        <div className="card stat-card">
          <StatRing value={totalCompleted} max={Math.max(history.length, 1)} label="Completed" />
        </div>
        <div className="card stat-card stat-card-plain">
          <span className="stat-value-big">{totalCalories}</span>
          <span className="stat-label-big">total calories</span>
        </div>
        <div className="card stat-card stat-card-plain">
          <span className="stat-value-big">{totalMinutes}</span>
          <span className="stat-label-big">total minutes</span>
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState
          title="No workouts logged yet"
          description="Log your first workout to start tracking progress."
        />
      ) : (
        <div className="card table-card">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Workout</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...history]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record) => (
                  <tr key={record._id}>
                    <td>{record.workout?.title || 'Workout'}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.duration} min</td>
                    <td>{record.caloriesBurned || 0} kcal</td>
                    <td>
                      <span className={`badge ${record.completed ? 'badge-success' : 'badge-outline'}`}>
                        {record.completed ? 'Completed' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="btn btn-ghost btn-small" onClick={() => openEditModal(record)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(record)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editingRecord ? 'Edit progress' : 'Log workout'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} noValidate>
            {formError && <div className="form-alert">{formError}</div>}

            <div className="field">
              <label htmlFor="workout">Workout</label>
              <select id="workout" name="workout" value={form.workout} onChange={handleFormChange}>
                <option value="">Select a workout…</option>
                {workouts.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.title}
                  </option>
                ))}
              </select>
              {formErrors.workout && <span className="field-error">{formErrors.workout}</span>}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                />
                {formErrors.date && <span className="field-error">{formErrors.date}</span>}
              </div>
              <div className="field">
                <label htmlFor="duration">Duration (min)</label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={handleFormChange}
                />
                {formErrors.duration && <span className="field-error">{formErrors.duration}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="caloriesBurned">Calories burned</label>
              <input
                id="caloriesBurned"
                name="caloriesBurned"
                type="number"
                min="0"
                value={form.caloriesBurned}
                onChange={handleFormChange}
              />
            </div>

            <label className="checkbox-item">
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleFormChange}
              />
              Mark as completed
            </label>

            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingRecord ? 'Save changes' : 'Log workout'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
