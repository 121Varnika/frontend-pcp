// Top nav with links and logout button
// Navbar — simple black and white
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/TaskContext';

function Navbar() {
  const { authUser, dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  if (!authUser) return null;

  return (
    <nav data-testid="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #000', flexWrap: 'wrap' }}>
      <b>Issue Tracker</b>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link data-testid="dashboard-link" to="/dashboard" style={lk}>Dashboard</Link>
        <Link data-testid="users-link" to="/users" style={lk}>Users</Link>
        <Link data-testid="projects-link" to="/projects" style={lk}>Projects</Link>
        <Link data-testid="issues-link" to="/issues" style={lk}>Issues</Link>
        <Link data-testid="comments-link" to="/comments" style={lk}>Comments</Link>
        <Link to="/profile" style={lk}>Profile</Link>
        <span style={{ fontSize: '13px' }}>{authUser.name} ({authUser.role})</span>
        <button data-testid="logout-btn" onClick={handleLogout} style={{ padding: '4px 12px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
}

const lk = { color: '#000', textDecoration: 'none', fontSize: '14px' };

export default Navbar;