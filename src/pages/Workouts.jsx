// src/pages/Workouts.jsx

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../api/workoutApi';
import WorkoutCard from '../components/WorkoutCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { validateWorkoutForm } from '../utils/validation';

const emptyForm = {
  title: '',
  description: '',
  category: 'other',
  difficulty: 'beginner',
  duration: '',
  caloriesBurned: '',
};

export default function Workouts() {
  const { isAdmin } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWorkouts();
      setWorkouts(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return workouts.filter((w) => {
      const matchesSearch =
        !search ||
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || w.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [workouts, search, difficultyFilter, categoryFilter]);

  const openCreateModal = () => {
    setEditingWorkout(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setForm({
      title: workout.title,
      description: workout.description,
      category: workout.category,
      difficulty: workout.difficulty,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned ?? '',
    });
    setFormErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateWorkoutForm(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        caloriesBurned: form.caloriesBurned === '' ? 0 : Number(form.caloriesBurned),
      };
      if (editingWorkout) {
        await updateWorkout(editingWorkout._id, payload);
      } else {
        await createWorkout(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message || 'Could not save this workout.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (workout) => {
    if (!window.confirm(`Delete "${workout.title}"? This can't be undone.`)) return;
    try {
      await deleteWorkout(workout._id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete this workout.');
    }
  };

  if (loading) return <Loading label="Loading workouts…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Workouts</h1>
          <p className="page-subtitle">{workouts.length} workouts available</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Add workout
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search workouts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="all">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
          <option value="hiit">HIIT</option>
          <option value="yoga">Yoga</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No workouts match your filters"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="card-grid">
          {filtered.map((w) => (
            <WorkoutCard
              key={w._id}
              workout={w}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingWorkout ? 'Edit workout' : 'Add workout'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} noValidate>
            {formError && <div className="form-alert">{formError}</div>}

            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleFormChange} />
              {formErrors.title && <span className="field-error">{formErrors.title}</span>}
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleFormChange}
              />
              {formErrors.description && (
                <span className="field-error">{formErrors.description}</span>
              )}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleFormChange}>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="hiit">HIIT</option>
                  <option value="yoga">Yoga</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleFormChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="field-row">
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
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingWorkout ? 'Save changes' : 'Create workout'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
