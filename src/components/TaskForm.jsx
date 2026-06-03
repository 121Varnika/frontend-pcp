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

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h3>{issue ? 'Edit Issue' : 'Add Issue'}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Issue ID *</label><br />
            <input name="issueId" value={form.issueId} onChange={handleChange} required disabled={!!issue} />
          </div>
          <div>
            <label>Title *</label><br />
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Project ID *</label><br />
            <input name="projectId" value={form.projectId} onChange={handleChange} required />
          </div>
          <div>
            <label>Assigned To</label><br />
            <input name="assignedTo" value={form.assignedTo} onChange={handleChange} />
          </div>
          <div>
            <label>Reported By</label><br />
            <input name="reportedBy" value={form.reportedBy} onChange={handleChange} />
          </div>
          <div>
            <label>Priority *</label><br />
            <select name="priority" value={form.priority} onChange={handleChange} required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label>Severity *</label><br />
            <select name="severity" value={form.severity} onChange={handleChange} required>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label>Status *</label><br />
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <br />
          <div>
            <button type="button" onClick={onClose}>
              Cancel
            </button>{' '}
            <button data-testid="save-task-btn" type="submit">
              {issue ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueModal;
