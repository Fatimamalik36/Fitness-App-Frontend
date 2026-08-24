// src/components/WorkoutCard.jsx

import { Link } from 'react-router-dom';

export default function WorkoutCard({ workout, onEdit, onDelete, isAdmin }) {
  return (
    <div className="card workout-card">
      <div className="card-top-row">
        <span className={`badge badge-${workout.difficulty}`}>{workout.difficulty}</span>
        <span className="badge badge-outline">{workout.category}</span>
      </div>
      <h3>{workout.title}</h3>
      <p className="card-description">{workout.description}</p>
      <div className="card-stats">
        <div>
          <span className="stat-value">{workout.duration}</span>
          <span className="stat-label">min</span>
        </div>
        <div>
          <span className="stat-value">{workout.caloriesBurned ?? 0}</span>
          <span className="stat-label">kcal</span>
        </div>
        <div>
          <span className="stat-value">{workout.exercises?.length ?? 0}</span>
          <span className="stat-label">exercises</span>
        </div>
      </div>
      <div className="card-actions">
        <Link to={`/workouts/${workout._id}`} className="btn btn-primary btn-small">
          View details
        </Link>
        {isAdmin && (
          <>
            <button className="btn btn-ghost btn-small" onClick={() => onEdit(workout)}>
              Edit
            </button>
            <button className="btn btn-danger btn-small" onClick={() => onDelete(workout)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
