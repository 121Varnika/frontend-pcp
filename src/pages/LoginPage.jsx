import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useApp } from '../context/TaskContext';

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
  const { dispatch } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(name, email, password, role, department);
        setIsRegister(false);
        alert('Registration successful! Please login.');
      } else {
        const data = await loginUser(email, password);
        const token = data.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data.data));
          dispatch({ type: 'SET_TOKEN', payload: token });
          dispatch({ type: 'SET_AUTH_USER', payload: data.data });
          navigate('/dashboard');
        } else {
          setError('No token received');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form data-testid="login-form" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p>{error}</p>}
        
        {isRegister && (
          <div>
            <label>Name</label><br />
            <input
              data-testid="name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div>
          <label>Email</label><br />
          <input
            data-testid="email-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Password</label><br />
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        {isRegister && (
          <>
            <div>
              <label>Role</label><br />
              <select
                data-testid="role-input"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label>Department</label><br />
              <input
                data-testid="department-input"
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          </>
        )}
        
        <br />
        <button data-testid="login-btn" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
        
        <p>
          <button
            data-testid="toggle-auth-btn"
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;