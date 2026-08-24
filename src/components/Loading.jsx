// src/components/Loading.jsx

export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading-state">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
