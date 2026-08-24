// src/components/FitnessPlanCard.jsx

export default function FitnessPlanCard({ plan, onEdit, onDelete, canManage, onViewDetails }) {
  return (
    <div className="card plan-card">
      <div className="card-top-row">
        <span className={`badge badge-${plan.difficulty}`}>{plan.difficulty}</span>
        <span className="badge badge-outline">{plan.goal?.replace('-', ' ')}</span>
      </div>
      <h3>{plan.name}</h3>
      <p className="card-description">{plan.description}</p>
      <div className="card-stats">
        <div>
          <span className="stat-value">{plan.duration}</span>
          <span className="stat-label">weeks</span>
        </div>
        <div>
          <span className="stat-value">{plan.workouts?.length ?? 0}</span>
          <span className="stat-label">workouts</span>
        </div>
      </div>
      <div className="card-actions">
        <button className="btn btn-primary btn-small" onClick={() => onViewDetails(plan)}>
          View details
        </button>
        {canManage && (
          <>
            <button className="btn btn-ghost btn-small" onClick={() => onEdit(plan)}>
              Edit
            </button>
            <button className="btn btn-danger btn-small" onClick={() => onDelete(plan)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
