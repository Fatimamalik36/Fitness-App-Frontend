// src/components/ErrorMessage.jsx

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
