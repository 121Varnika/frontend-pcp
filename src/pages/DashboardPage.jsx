// Summary cards (total/completed/pending), analytics, task list
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../context/TaskContext';
import { getAllIssues, searchIssues, createIssue, updateIssue, deleteIssue, syncData, getStats, getCurrentUser } from '../services/api';
import IssueModal from '../components/TaskForm';

function DashboardPage() {
  const { items, stats, dispatch } = useIssues();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch (e) { /* ignore */ }
    }
    // Also fetch from /auth/me for fresh data
    getCurrentUser().then(res => {
      if (res.data) {
        setCurrentUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    }).catch(() => {});
  }, []);

  const userRole = currentUser?.role || '';
  const isAdminOrManager = ['admin', 'manager'].includes(userRole);
  const isTester = userRole === 'tester';

  const fetchIssues = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      const res = await getAllIssues(filters);
      dispatch({ type: 'SET_ITEMS', payload: res.data || [] });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats();
      dispatch({ type: 'SET_STATS', payload: res.data || null });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    fetchIssues();
    if (isAdminOrManager) fetchStats();
  }, [filterStatus, filterPriority, isAdminOrManager]);

  const handleSearch = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      if (searchQuery.trim()) {
        const res = await searchIssues(searchQuery);
        dispatch({ type: 'SET_ITEMS', payload: res.data || [] });
      } else {
        fetchIssues();
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncData();
      setSyncResult(res);
      fetchIssues();
      if (isAdminOrManager) fetchStats();
    } catch (err) {
      setSyncResult({ success: false, message: err.response?.data?.message || err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingIssue) {
        const res = await updateIssue(editingIssue._id, formData);
        dispatch({ type: 'UPDATE_ITEM', payload: res.data });
      } else {
        const res = await createIssue(formData);
        dispatch({ type: 'ADD_ITEM', payload: res.data });
      }
      setShowModal(false);
      setEditingIssue(null);
      if (isAdminOrManager) fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await deleteIssue(id);
      dispatch({ type: 'DELETE_ITEM', payload: id });
      if (isAdminOrManager) fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (issue) => {
    setEditingIssue(issue);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Issue Tracker Dashboard</h2>
          {currentUser && (
            <p style={{ margin: 0 }}>
              Logged in as: {currentUser.name} ({currentUser.role})
            </p>
          )}
        </div>
        <div>
          <button data-testid="sync-btn" onClick={handleSync} disabled={syncing} style={{ marginRight: '5px' }}>
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {syncResult && (
        <div style={{ padding: '10px', margin: '10px 0', border: '1px solid', backgroundColor: syncResult.success ? '#e2f0d9' : '#fce4d6' }}>
          {syncResult.success
            ? `Sync complete - Fetched: ${syncResult.data?.totalFetched}, Inserted: ${syncResult.data?.inserted}, Duplicates: ${syncResult.data?.duplicates}, Rejected: ${syncResult.data?.rejected}`
            : `Sync failed: ${syncResult.message}`
          }
        </div>
      )}

      {stats && isAdminOrManager && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Statistics</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Total</th>
                <th>Open</th>
                <th>In Progress</th>
                <th>Testing</th>
                <th>Resolved</th>
                <th>Closed</th>
                <th>Projects</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.totalIssues || 0}</td>
                <td>{stats.byStatus?.open || 0}</td>
                <td>{stats.byStatus?.['in-progress'] || 0}</td>
                <td>{stats.byStatus?.testing || 0}</td>
                <td>{stats.byStatus?.resolved || 0}</td>
                <td>{stats.byStatus?.closed || 0}</td>
                <td>{stats.totalProjects || 0}</td>
                <td>{stats.totalUsers || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div style={{ margin: '20px 0' }}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button onClick={handleSearch} style={{ marginLeft: '5px', marginRight: '15px' }}>Search</button>

        <select
          data-testid="filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="testing">Testing</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          data-testid="filter-priority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ marginRight: '15px' }}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {(isAdminOrManager || isTester) && (
          <button
            data-testid="add-task-btn"
            onClick={() => { setEditingIssue(null); setShowModal(true); }}
          >
            + Add Issue
          </button>
        )}
      </div>

      <div>
        <h3>Issues</h3>
        {items.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Title</th>
                <th>Project ID</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.issueId}</td>
                  <td>{issue.title}</td>
                  <td>{issue.projectId}</td>
                  <td>{issue.assignedTo || 'Unassigned'}</td>
                  <td>{issue.status}</td>
                  <td>{issue.priority}</td>
                  <td>{issue.severity}</td>
                  <td>
                    <button
                      data-testid="edit-task-btn"
                      onClick={() => handleEdit(issue)}
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    {isAdminOrManager && (
                      <button
                        data-testid="delete-task-btn"
                        onClick={() => handleDelete(issue._id)}
                      >
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

      {showModal && (
        <IssueModal
          issue={editingIssue}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingIssue(null); }}
        />
      )}
    </div>
  );
}

export default DashboardPage;
