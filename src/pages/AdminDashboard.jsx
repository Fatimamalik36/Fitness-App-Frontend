// src/pages/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUser } from '../api/userApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This can't be undone.`)) return;
    try {
      await deleteUser(u._id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not delete this user.');
    }
  };

  if (loading) return <Loading label="Loading admin dashboard…" />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin dashboard</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="card table-card">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fitness goal</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-outline'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.fitnessGoal?.replace('-', ' ')}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="table-actions">
                    {u._id !== currentUser?.id && (
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(u)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
