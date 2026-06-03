// Projects page — simple black and white
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
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>Projects</h1>
          {isManager && <button data-testid="create-project-btn" onClick={() => setShowCreate(!showCreate)}>{showCreate ? 'Cancel' : '+ Create Project'}</button>}
        </div>
        {showCreate && (
          <form onSubmit={handleCreate} style={{ border: '1px solid #000', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input placeholder="Project ID" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required style={inp} />
            <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inp} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inp} />
            <button type="submit">Create</button>
          </form>
        )}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input data-testid="project-search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1 }} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={inp}>
            <option value="">All Status</option><option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option>
          </select>
        </div>
        {loading ? <p>Loading...</p> : (
          <div data-testid="project-list">
            <table style={tbl}><thead><tr><th style={th}>ID</th><th style={th}>Title</th><th style={th}>Status</th><th style={th}>Category</th>{isManager && <th style={th}>Actions</th>}</tr></thead>
              <tbody>{filtered.map(p => <tr key={p._id}><td style={td}>{p.projectId}</td><td style={td}>{p.title}</td><td style={td}>{p.status}</td><td style={td}>{p.category || '—'}</td>
                {isManager && <td style={td}><button onClick={() => handleDelete(p._id)}>Delete</button></td>}</tr>)}</tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
              <button data-testid="pagination-prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button data-testid="pagination-next" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inp = { padding: '6px', border: '1px solid #000', boxSizing: 'border-box' };
const tbl = { width: '100%', borderCollapse: 'collapse' };
const th = { border: '1px solid #000', padding: '6px', textAlign: 'left' };
const td = { border: '1px solid #000', padding: '6px' };

export default ProjectsPage;