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
    <nav data-testid="navbar">
      <span style={{ fontSize: '32px', fontWeight: 'bold', marginRight: '20px' }}>Issue Tracker</span>
      <div>
        <Link data-testid="dashboard-link" to="/dashboard">Dashboard</Link>{' | '}
        <Link data-testid="users-link" to="/users">Users</Link>{' | '}
        <Link data-testid="projects-link" to="/projects">Projects</Link>{' | '}
        <Link data-testid="issues-link" to="/issues">Issues</Link>{' | '}
        <Link data-testid="comments-link" to="/comments">Comments</Link>{' | '}
        <Link to="/profile">Profile</Link>{' | '}
        <span>{authUser.name} ({authUser.role})</span>{' '}
        <button data-testid="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;