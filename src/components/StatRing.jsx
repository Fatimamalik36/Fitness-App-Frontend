// src/components/StatRing.jsx
// Signature visual: a circular progress ring used to show goal completion
// (e.g. weekly workouts done vs. target) on the Dashboard and Progress pages.

export default function StatRing({ value, max, label, sublabel, color = 'var(--accent)' }) {
  const safeMax = max > 0 ? max : 1;
  const pct = Math.min(value / safeMax, 1);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="stat-ring">
      <svg viewBox="0 0 100 100" className="stat-ring-svg">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="47" textAnchor="middle" className="stat-ring-value">
          {value}
        </text>
        <text x="50" y="63" textAnchor="middle" className="stat-ring-max">
          / {max}
        </text>
      </svg>
      <div className="stat-ring-labels">
        <span className="stat-ring-label">{label}</span>
        {sublabel && <span className="stat-ring-sublabel">{sublabel}</span>}
      </div>
    </div>
  );
}
