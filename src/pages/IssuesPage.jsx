// Issues page — simple black and white
import { useEffect, useState } from 'react';
import { useApp } from '../context/TaskContext';
import { getAllIssues, deleteIssue, assignIssue, updateIssueStatus } from '../services/api';
import Navbar from '../components/Navbar';

function IssuesPage() {
  const { authUser, dispatch } = useApp();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const isManager = authUser?.role === 'admin' || authUser?.role === 'manager';

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const filters = { page, limit: 10 };
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (search) filters.search = search;
      const res = await getAllIssues(filters);
      setIssues(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
      dispatch({ type: 'SET_ISSUES', payload: res.data || [] });
      dispatch({ type: 'SET_FILTERS', payload: filters });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchIssues(); }, [page, statusFilter, priorityFilter]);

  const handleSearch = (e) => { if (e.key === 'Enter') { setPage(1); fetchIssues(); } };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deleteIssue(id); fetchIssues(); } catch (e) { alert(e.response?.data?.message || 'Error'); } };
  const handleAssign = async (mongoId) => { const u = prompt('Enter User ID (e.g. USR1011):'); if (!u) return; try { await assignIssue(mongoId, u); alert('Assigned!'); fetchIssues(); } catch (e) { alert(e.response?.data?.message || 'Error'); } };
  const handleStatusChange = async (mongoId, s) => { try { await updateIssueStatus(mongoId, s); fetchIssues(); } catch (e) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Issues ({total})</h1>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <input data-testid="issue-search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} style={{ ...inp, flex: 1 }} />
          <select data-testid="issue-filter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={inp}>
            <option value="">All Status</option><option value="open">Open</option><option value="in-progress">In Progress</option><option value="testing">Testing</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }} style={inp}>
            <option value="">All Priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
        </div>
        {loading ? <p>Loading...</p> : (
          <>
            <table data-testid="issue-table" style={tbl}><thead><tr><th style={th}>ID</th><th style={th}>Title</th><th style={th}>Project</th><th style={th}>Status</th><th style={th}>Priority</th><th style={th}>Assigned</th><th style={th}>Actions</th></tr></thead>
              <tbody>{issues.map(i => (
                <tr data-testid="issue-row" key={i._id}>
                  <td style={td}>{i.issueId}</td><td style={td}>{i.title}</td><td style={td}>{i.projectId}</td>
                  <td style={td}><select value={i.status} onChange={e => handleStatusChange(i._id, e.target.value)} style={{ border: '1px solid #000', padding: '2px' }}>
                    <option value="open">open</option><option value="in-progress">in-progress</option><option value="testing">testing</option><option value="resolved">resolved</option><option value="closed">closed</option>
                  </select></td>
                  <td style={td}>{i.priority}</td><td style={td}>{i.assignedTo || '—'}</td>
                  <td style={td}>
                    {isManager && <button data-testid="assign-issue-btn" onClick={() => handleAssign(i._id)} style={{ marginRight: '4px' }}>Assign</button>}
                    {isManager && <button onClick={() => handleDelete(i._id)}>Delete</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '12px' }}>
              <button data-testid="pagination-prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button data-testid="pagination-next" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inp = { padding: '6px', border: '1px solid #000', boxSizing: 'border-box' };
const tbl = { width: '100%', borderCollapse: 'collapse' };
const th = { border: '1px solid #000', padding: '6px', textAlign: 'left' };
const td = { border: '1px solid #000', padding: '6px' };

export default IssuesPage;