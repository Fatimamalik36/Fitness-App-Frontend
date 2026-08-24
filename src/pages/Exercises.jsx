// src/pages/Exercises.jsx

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../api/exerciseApi';
import ExerciseCard from '../components/ExerciseCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { validateExerciseForm } from '../utils/validation';

const emptyForm = {
  name: '',
  description: '',
  muscleGroup: 'full-body',
  equipment: '',
  difficulty: 'beginner',
  instructions: '',
};

export default function Exercises() {
  const { isAdmin } = useAuth();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('all');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [detailExercise, setDetailExercise] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getExercises();
      setExercises(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        !search || ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesMuscle = muscleFilter === 'all' || ex.muscleGroup === muscleFilter;
      return matchesSearch && matchesMuscle;
    });
  }, [exercises, search, muscleFilter]);

  const openCreateModal = () => {
    setEditingExercise(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError('');
    setFormModalOpen(true);
  };

  const openEditModal = (exercise) => {
    setEditingExercise(exercise);
    setForm({
      name: exercise.name,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment || '',
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
    });
    setFormErrors({});
    setFormError('');
    setFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateExerciseForm(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setFormError('');
    try {
      if (editingExercise) {
        await updateExercise(editingExercise._id, form);
      } else {
        await createExercise(form);
      }
      setFormModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message || 'Could not save this exercise.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exercise) => {
    if (!window.confirm(`Delete "${exercise.name}"? This can't be undone.`)) return;
    try {
      await deleteExercise(exercise._id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete this exercise.');
    }
  };

  if (loading) return <Loading label="Loading exercises…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Exercises</h1>
          <p className="page-subtitle">{exercises.length} exercises in the library</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Add exercise
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search exercises…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={muscleFilter} onChange={(e) => setMuscleFilter(e.target.value)}>
          <option value="all">All muscle groups</option>
          <option value="chest">Chest</option>
          <option value="back">Back</option>
          <option value="legs">Legs</option>
          <option value="shoulders">Shoulders</option>
          <option value="arms">Arms</option>
          <option value="core">Core</option>
          <option value="full-body">Full body</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No exercises match your filters"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="card-grid">
          {filtered.map((ex) => (
            <ExerciseCard
              key={ex._id}
              exercise={ex}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onViewDetails={setDetailExercise}
            />
          ))}
        </div>
      )}

      {formModalOpen && (
        <Modal
          title={editingExercise ? 'Edit exercise' : 'Add exercise'}
          onClose={() => setFormModalOpen(false)}
        >
          <form onSubmit={handleSubmit} noValidate>
            {formError && <div className="form-alert">{formError}</div>}

            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleFormChange} />
              {formErrors.name && <span className="field-error">{formErrors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={2}
                value={form.description}
                onChange={handleFormChange}
              />
              {formErrors.description && (
                <span className="field-error">{formErrors.description}</span>
              )}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="muscleGroup">Muscle group</label>
                <select
                  id="muscleGroup"
                  name="muscleGroup"
                  value={form.muscleGroup}
                  onChange={handleFormChange}
                >
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="core">Core</option>
                  <option value="full-body">Full body</option>
                </select>
                {formErrors.muscleGroup && (
                  <span className="field-error">{formErrors.muscleGroup}</span>
                )}
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

            <div className="field">
              <label htmlFor="equipment">Equipment</label>
              <input
                id="equipment"
                name="equipment"
                placeholder="e.g. Dumbbells, none"
                value={form.equipment}
                onChange={handleFormChange}
              />
            </div>

            <div className="field">
              <label htmlFor="instructions">Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                rows={3}
                value={form.instructions}
                onChange={handleFormChange}
              />
              {formErrors.instructions && (
                <span className="field-error">{formErrors.instructions}</span>
              )}
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingExercise ? 'Save changes' : 'Create exercise'}
            </button>
          </form>
        </Modal>
      )}

      {detailExercise && (
        <Modal title={detailExercise.name} onClose={() => setDetailExercise(null)}>
          <div className="card-top-row">
            <span className={`badge badge-${detailExercise.difficulty}`}>
              {detailExercise.difficulty}
            </span>
            <span className="badge badge-outline">{detailExercise.muscleGroup}</span>
          </div>
          <p>{detailExercise.description}</p>
          <p className="card-meta">Equipment: {detailExercise.equipment || 'None'}</p>
          <h3>Instructions</h3>
          <p>{detailExercise.instructions}</p>
        </Modal>
      )}
    </div>
  );
}
