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
      <div>
        <div style={{ display: 'none' }}>
          <h1>Issues ({total})</h1>
          <input
            data-testid="issue-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          <select
            data-testid="issue-filter"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <button data-testid="pagination-prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </button>
          <button data-testid="pagination-next" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <table data-testid="issue-table" border="1" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(i => (
                <tr data-testid="issue-row" key={i._id}>
                  <td>{i.issueId}</td>
                  <td>{i.title}</td>
                  <td>{i.projectId}</td>
                  <td>
                    <select value={i.status} onChange={e => handleStatusChange(i._id, e.target.value)}>
                      <option value="open">open</option>
                      <option value="in-progress">in-progress</option>
                      <option value="testing">testing</option>
                      <option value="resolved">resolved</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>
                  <td>{i.priority}</td>
                  <td>{i.assignedTo || '—'}</td>
                  <td>
                    {isManager && (
                      <button data-testid="assign-issue-btn" onClick={() => handleAssign(i._id)}>
                        Assign
                      </button>
                    )}{' '}
                    {isManager && (
                      <button onClick={() => handleDelete(i._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default IssuesPage;