// src/components/Sidebar.jsx

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◆' },
  { to: '/workouts', label: 'Workouts', icon: '▲' },
  { to: '/exercises', label: 'Exercises', icon: '●' },
  { to: '/fitness-plans', label: 'Fitness Plans', icon: '▶' },
  { to: '/progress', label: 'Progress', icon: '◐' },
  { to: '/profile', label: 'Profile', icon: '◎' },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">PULSE</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `sidebar-link admin-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">◈</span>
              Admin
            </NavLink>
          )}
        </nav>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}
