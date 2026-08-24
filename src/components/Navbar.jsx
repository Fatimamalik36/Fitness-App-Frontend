// src/components/Navbar.jsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle navigation">
        ☰
      </button>
      <div className="topbar-spacer" />
      <div className="topbar-user">
        <span className="user-name">{user?.name}</span>
        <div className="avatar">{initials}</div>
        <button className="btn btn-ghost btn-small" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
