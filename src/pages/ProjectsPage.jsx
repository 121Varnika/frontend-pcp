import { useEffect, useState } from 'react';
import { useApp } from '../context/TaskContext';
import { getAllProjects, createProject, deleteProject } from '../services/api';
import Navbar from '../components/Navbar';

function ProjectsPage() {
  const { authUser, dispatch } = useApp();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ projectId: '', title: '', status: 'active', description: '' });
  const isManager = authUser?.role === 'admin' || authUser?.role === 'manager';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await getAllProjects(params);
      setProjects(res.data || []);
      setTotalPages(res.totalPages || 1);
      dispatch({ type: 'SET_PROJECTS', payload: res.data || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [page, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createProject(form); setShowCreate(false); setForm({ projectId: '', title: '', status: 'active', description: '' }); fetchProjects(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await deleteProject(id); fetchProjects(); } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const filtered = search ? projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.projectId?.toLowerCase().includes(search.toLowerCase())) : projects;

  return (
    <div>
      <Navbar />
      <div>
        <div style={{ display: 'none' }}>
          <h1>Projects</h1>
          <button data-testid="create-project-btn" onClick={() => setShowCreate(!showCreate)}>{showCreate ? 'Cancel' : '+ Create Project'}</button>
          <form onSubmit={handleCreate}>
            <input placeholder="Project ID" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required />
            <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <button type="submit">Create</button>
          </form>
          <input data-testid="project-search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <button data-testid="pagination-prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <button data-testid="pagination-next" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div data-testid="project-list">
            <table border="1" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Category</th>
                  {isManager && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>{p.projectId}</td>
                    <td>{p.title}</td>
                    <td>{p.status}</td>
                    <td>{p.category || '—'}</td>
                    {isManager && <td><button onClick={() => handleDelete(p._id)}>Delete</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;