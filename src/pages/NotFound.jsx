// src/pages/NotFound.jsx

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="brand-mark">PULSE</span>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
