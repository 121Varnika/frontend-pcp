// Add / Edit modal form with validation; includes data-testid attrs
import { useState, useEffect } from 'react';

function IssueModal({ issue, onSave, onClose }) {
  const [form, setForm] = useState({
    issueId: '',
    title: '',
    projectId: '',
    assignedTo: '',
    reportedBy: '',
    priority: 'medium',
    severity: 'minor',
    status: 'open'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (issue) {
      setForm({
        issueId: issue.issueId || '',
        title: issue.title || '',
        projectId: issue.projectId || '',
        assignedTo: issue.assignedTo || '',
        reportedBy: issue.reportedBy || '',
        priority: issue.priority || 'medium',
        severity: issue.severity || 'minor',
        status: issue.status || 'open'
      });
    }
  }, [issue]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.issueId || !form.title || !form.projectId || !form.priority || !form.severity || !form.status) {
      setError('Please fill all required fields');
      return;
    }
    onSave(form);
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    background: '#fff',
    padding: '20px',
    border: '2px solid #000',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{issue ? 'Edit Issue' : 'Add Issue'}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Issue ID *</label>
            <input name="issueId" value={form.issueId} onChange={handleChange} required disabled={!!issue} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Project ID *</label>
            <input name="projectId" value={form.projectId} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Assigned To</label>
            <input name="assignedTo" value={form.assignedTo} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Reported By</label>
            <input name="reportedBy" value={form.reportedBy} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Priority *</label>
            <select name="priority" value={form.priority} onChange={handleChange} required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Severity *</label>
            <select name="severity" value={form.severity} onChange={handleChange} required>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block' }}>Status *</label>
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div style={{ marginTop: '15px' }}>
            <button type="button" onClick={onClose} style={{ marginRight: '5px' }}>
              Cancel
            </button>
            <button
              data-testid="save-task-btn"
              type="submit"
            >
              {issue ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueModal;
