// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../api/workoutApi';
import { getFitnessPlans } from '../api/fitnessPlanApi';
import { getMyProgress } from '../api/progressApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatRing from '../components/StatRing';

export default function Dashboard() {
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [workoutsRes, plansRes, progressRes] = await Promise.all([
        getWorkouts(),
        getFitnessPlans(),
        getMyProgress(),
      ]);
      setWorkouts(workoutsRes.data || []);
      setPlans(plansRes.data || []);
      setProgress(progressRes.data || []);
    } catch (err) {
      setError(err.message || 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading label="Loading your dashboard…" />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  const totalCompleted = progress.filter((p) => p.completed).length;
  const totalCalories = progress.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
  const totalMinutes = progress.reduce((sum, p) => sum + (p.duration || 0), 0);
  const weeklyGoal = 5; // display target for the progress ring
  const recentActivity = [...progress]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="page-subtitle">
            Goal: {user?.fitnessGoal?.replace('-', ' ') || 'general fitness'}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <StatRing value={totalCompleted} max={weeklyGoal} label="Workouts" sublabel="this week" />
        </div>
        <div className="card stat-card stat-card-plain">
          <span className="stat-value-big">{totalCalories}</span>
          <span className="stat-label-big">calories burned</span>
        </div>
        <div className="card stat-card stat-card-plain">
          <span className="stat-value-big">{totalMinutes}</span>
          <span className="stat-label-big">minutes trained</span>
        </div>
        <div className="card stat-card stat-card-plain">
          <span className="stat-value-big">{plans.length}</span>
          <span className="stat-label-big">active plans</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="section-header">
            <h2>Available workouts</h2>
            <Link to="/workouts" className="link">
              See all
            </Link>
          </div>
          {workouts.length === 0 ? (
            <p className="muted">No workouts yet — check back soon.</p>
          ) : (
            <ul className="mini-list">
              {workouts.slice(0, 4).map((w) => (
                <li key={w._id}>
                  <span>{w.title}</span>
                  <span className={`badge badge-${w.difficulty}`}>{w.difficulty}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="section-header">
            <h2>Fitness plans</h2>
            <Link to="/fitness-plans" className="link">
              See all
            </Link>
          </div>
          {plans.length === 0 ? (
            <p className="muted">No fitness plans yet.</p>
          ) : (
            <ul className="mini-list">
              {plans.slice(0, 4).map((p) => (
                <li key={p._id}>
                  <span>{p.name}</span>
                  <span className="badge badge-outline">{p.duration}w</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card dashboard-activity">
          <div className="section-header">
            <h2>Recent activity</h2>
            <Link to="/progress" className="link">
              See all
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="muted">No workouts logged yet. Head to Progress to add one.</p>
          ) : (
            <ul className="activity-list">
              {recentActivity.map((p) => (
                <li key={p._id}>
                  <span className="activity-dot" />
                  <div>
                    <strong>{p.workout?.title || 'Workout'}</strong>
                    <span className="muted">
                      {' '}
                      — {p.duration} min · {p.caloriesBurned || 0} kcal ·{' '}
                      {new Date(p.date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
