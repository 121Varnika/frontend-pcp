// Login/Register form → calls /auth/login or /auth/register → stores JWT in localStorage
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data;
      if (isRegister) {
        data = await registerUser(name, email, password, role, department);
      } else {
        data = await loginUser(email, password);
      }
      // Login: token at top level; Register: no token in response
      const token = data.token || data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        if (data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
        }
        navigate('/dashboard');
      } else if (isRegister) {
        // Register succeeded but no token in response — switch to login
        setIsRegister(false);
        setError('');
        alert('Registration successful! Please login.');
      } else {
        setError('No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Issue Tracker - {isRegister ? 'Register' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Name</label>
            <input
              data-testid="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Email</label>
          <input
            data-testid="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Password</label>
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegister && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block' }}>Role</label>
              <select
                data-testid="role-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block' }}>Department</label>
              <input
                data-testid="department-input"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering"
              />
            </div>
          </>
        )}
        <button
          data-testid="login-btn"
          type="submit"
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        <button
          data-testid="toggle-auth-btn"
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
