import { useEffect, useState } from 'react';
import { useApp } from '../context/TaskContext';
import { getAllUsers } from '../services/api';
import Navbar from '../components/Navbar';

function UsersPage() {
  const { dispatch } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (roleFilter) params.role = roleFilter;
      const res = await getAllUsers(params);
      setUsers(res.data || res || []);
      setTotalPages(res.totalPages || 1);
      dispatch({ type: 'SET_USERS', payload: res.data || res || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const userList = Array.isArray(users) ? users : [];
  const filtered = search
    ? userList.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.userId?.toLowerCase().includes(search.toLowerCase())
      )
    : userList;

  return (
    <div>
      <Navbar />
      <div>
        <h1>Users</h1>
        <div>
          <input
            data-testid="user-search"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />{' '}
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <br />
        
        {loading ? <p>Loading...</p> : (
          <div data-testid="user-list">
            <table border="1" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id || u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.department || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <br />
            
            <div>
              <button data-testid="pagination-prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>{' '}
              <span>Page {page} of {totalPages}</span>{' '}
              <button data-testid="pagination-next" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;