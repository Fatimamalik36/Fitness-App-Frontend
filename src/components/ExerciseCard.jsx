// src/components/ExerciseCard.jsx

export default function ExerciseCard({ exercise, onEdit, onDelete, isAdmin, onViewDetails }) {
  return (
    <div className="card exercise-card">
      <div className="card-top-row">
        <span className={`badge badge-${exercise.difficulty}`}>{exercise.difficulty}</span>
        <span className="badge badge-outline">{exercise.muscleGroup}</span>
      </div>
      <h3>{exercise.name}</h3>
      <p className="card-description">{exercise.description}</p>
      <p className="card-meta">Equipment: {exercise.equipment || 'None'}</p>
      <div className="card-actions">
        <button className="btn btn-primary btn-small" onClick={() => onViewDetails(exercise)}>
          View details
        </button>
        {isAdmin && (
          <>
            <button className="btn btn-ghost btn-small" onClick={() => onEdit(exercise)}>
              Edit
            </button>
            <button className="btn btn-danger btn-small" onClick={() => onDelete(exercise)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
