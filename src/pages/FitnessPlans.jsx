// src/pages/FitnessPlans.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFitnessPlans,
  createFitnessPlan,
  updateFitnessPlan,
  deleteFitnessPlan,
} from '../api/fitnessPlanApi';
import { getWorkouts } from '../api/workoutApi';
import FitnessPlanCard from '../components/FitnessPlanCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { validateFitnessPlanForm } from '../utils/validation';

const emptyForm = {
  name: '',
  description: '',
  goal: 'general-fitness',
  duration: '',
  difficulty: 'beginner',
  workouts: [],
};

export default function FitnessPlans() {
  const { user, isAdmin } = useAuth();

  const [plans, setPlans] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [detailPlan, setDetailPlan] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, workoutsRes] = await Promise.all([getFitnessPlans(), getWorkouts()]);
      setPlans(plansRes.data || []);
      setAllWorkouts(workoutsRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load fitness plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canManage = (plan) => isAdmin || plan.createdBy?._id === user?.id;

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError('');
    setFormModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      goal: plan.goal,
      duration: plan.duration,
      difficulty: plan.difficulty,
      workouts: plan.workouts?.map((w) => w._id) || [],
    });
    setFormErrors({});
    setFormError('');
    setFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleWorkoutSelection = (id) => {
    setForm((f) => ({
      ...f,
      workouts: f.workouts.includes(id)
        ? f.workouts.filter((w) => w !== id)
        : [...f.workouts, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateFitnessPlanForm(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, duration: Number(form.duration) };
      if (editingPlan) {
        await updateFitnessPlan(editingPlan._id, payload);
      } else {
        await createFitnessPlan(payload);
      }
      setFormModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err.message || 'Could not save this fitness plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete "${plan.name}"? This can't be undone.`)) return;
    try {
      await deleteFitnessPlan(plan._id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete this fitness plan.');
    }
  };

  if (loading) return <Loading label="Loading fitness plans…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Fitness Plans</h1>
          <p className="page-subtitle">{plans.length} plans available</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Create plan
        </button>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          title="No fitness plans yet"
          description="Create the first one to get started."
        />
      ) : (
        <div className="card-grid">
          {plans.map((plan) => (
            <FitnessPlanCard
              key={plan._id}
              plan={plan}
              canManage={canManage(plan)}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onViewDetails={setDetailPlan}
            />
          ))}
        </div>
      )}

      {formModalOpen && (
        <Modal title={editingPlan ? 'Edit fitness plan' : 'Create fitness plan'} onClose={() => setFormModalOpen(false)} wide>
          <form onSubmit={handleSubmit} noValidate>
            {formError && <div className="form-alert">{formError}</div>}

            <div className="field">
              <label htmlFor="name">Plan name</label>
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
                <label htmlFor="goal">Goal</label>
                <select id="goal" name="goal" value={form.goal} onChange={handleFormChange}>
                  <option value="weight-loss">Weight loss</option>
                  <option value="muscle-gain">Muscle gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="general-fitness">General fitness</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="duration">Duration (weeks)</label>
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
              <label>Include workouts</label>
              <div className="checkbox-list">
                {allWorkouts.length === 0 && <p className="muted">No workouts available yet.</p>}
                {allWorkouts.map((w) => (
                  <label key={w._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={form.workouts.includes(w._id)}
                      onChange={() => toggleWorkoutSelection(w._id)}
                    />
                    {w.title}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingPlan ? 'Save changes' : 'Create plan'}
            </button>
          </form>
        </Modal>
      )}

      {detailPlan && (
        <Modal title={detailPlan.name} onClose={() => setDetailPlan(null)}>
          <div className="card-top-row">
            <span className={`badge badge-${detailPlan.difficulty}`}>{detailPlan.difficulty}</span>
            <span className="badge badge-outline">{detailPlan.goal?.replace('-', ' ')}</span>
          </div>
          <p>{detailPlan.description}</p>
          <p className="card-meta">Duration: {detailPlan.duration} weeks</p>
          <h3>Workouts in this plan</h3>
          {detailPlan.workouts?.length > 0 ? (
            <ul className="mini-list">
              {detailPlan.workouts.map((w) => (
                <li key={w._id}>
                  <span>{w.title}</span>
                  {w.difficulty && <span className={`badge badge-${w.difficulty}`}>{w.difficulty}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No workouts included yet.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
