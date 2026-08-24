// src/pages/WorkoutDetails.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWorkoutById } from '../api/workoutApi';
import { addProgress } from '../api/progressApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logging, setLogging] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWorkoutById(id);
      setWorkout(res.data);
    } catch (err) {
      setError(err.message || 'Could not load this workout.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const markCompleted = async () => {
    setLogging(true);
    setLogMessage('');
    try {
      await addProgress({
        workout: workout._id,
        date: new Date().toISOString(),
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurned || 0,
        completed: true,
      });
      setLogMessage('Nice work — logged to your progress history.');
    } catch (err) {
      setLogMessage(err.message || 'Could not log this workout.');
    } finally {
      setLogging(false);
    }
  };

  if (loading) return <Loading label="Loading workout…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!workout) return null;

  return (
    <div className="page">
      <button className="btn btn-ghost btn-small" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card detail-card">
        <div className="card-top-row">
          <span className={`badge badge-${workout.difficulty}`}>{workout.difficulty}</span>
          <span className="badge badge-outline">{workout.category}</span>
        </div>
        <h1>{workout.title}</h1>
        <p>{workout.description}</p>

        <div className="card-stats detail-stats">
          <div>
            <span className="stat-value">{workout.duration}</span>
            <span className="stat-label">minutes</span>
          </div>
          <div>
            <span className="stat-value">{workout.caloriesBurned ?? 0}</span>
            <span className="stat-label">calories</span>
          </div>
          <div>
            <span className="stat-value">{workout.exercises?.length ?? 0}</span>
            <span className="stat-label">exercises</span>
          </div>
        </div>

        {workout.exercises?.length > 0 && (
          <div className="detail-section">
            <h2>Exercises</h2>
            <ul className="mini-list">
              {workout.exercises.map((ex) => (
                <li key={ex._id}>
                  <span>{ex.name}</span>
                  {ex.difficulty && <span className={`badge badge-${ex.difficulty}`}>{ex.difficulty}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={markCompleted} disabled={logging}>
            {logging ? 'Logging…' : 'Mark as completed'}
          </button>
          <Link to="/progress" className="btn btn-ghost">
            View progress history
          </Link>
        </div>
        {logMessage && <p className="form-success">{logMessage}</p>}
      </div>
    </div>
  );
}
