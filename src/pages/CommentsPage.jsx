import { useEffect, useState } from 'react';
import { useApp } from '../context/TaskContext';
import { getAllComments, createComment, deleteComment } from '../services/api';
import Navbar from '../components/Navbar';

function CommentsPage() {
  const { authUser, dispatch } = useApp();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ commentId: '', issueId: '', message: '' });
  const isManager = authUser?.role === 'admin' || authUser?.role === 'manager';

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getAllComments();
      setComments(res.data || res || []);
      dispatch({ type: 'SET_COMMENTS', payload: res.data || res || [] });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createComment({ ...form, userId: authUser?.userId || 'USR0000' });
      setShowAdd(false);
      setForm({ commentId: '', issueId: '', message: '' });
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteComment(id);
      fetchComments();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const commentList = Array.isArray(comments) ? comments : [];

  return (
    <div>
      <Navbar />
      <div>
        <div style={{ display: 'none' }}>
          <h1>Comments</h1>
          <button data-testid="add-comment-btn" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add Comment'}</button>
          <form onSubmit={handleAdd}>
            <input placeholder="Comment ID" value={form.commentId} onChange={e => setForm({...form, commentId: e.target.value})} required />
            <input placeholder="Issue ID" value={form.issueId} onChange={e => setForm({...form, issueId: e.target.value})} required />
            <input placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
            <button type="submit">Submit</button>
          </form>
        </div>
        
        {loading ? <p>Loading...</p> : (
          <table data-testid="comment-table" border="1" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>User</th>
                <th>Message</th>
                <th>Date</th>
                {isManager && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {commentList.map(c => (
                <tr data-testid="comment-row" key={c._id}>
                  <td>{c.commentId}</td>
                  <td>{c.issueId}</td>
                  <td>{c.userId}</td>
                  <td>{c.message}</td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  {isManager && <td><button onClick={() => handleDelete(c._id)}>Delete</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CommentsPage;