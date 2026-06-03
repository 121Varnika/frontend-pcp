// Comments page — simple black and white
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
    try { const res = await getAllComments(); setComments(res.data || []); dispatch({ type: 'SET_COMMENTS', payload: res.data || [] }); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await createComment({ ...form, userId: authUser?.userId || 'USR0000' }); setShowAdd(false); setForm({ commentId: '', issueId: '', message: '' }); fetchComments(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deleteComment(id); fetchComments(); } catch (e) { alert(e.response?.data?.message || 'Error'); } };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>Comments</h1>
          <button data-testid="add-comment-btn" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add Comment'}</button>
        </div>
        {showAdd && (
          <form onSubmit={handleAdd} style={{ border: '1px solid #000', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input placeholder="Comment ID" value={form.commentId} onChange={e => setForm({...form, commentId: e.target.value})} required style={inp} />
            <input placeholder="Issue ID" value={form.issueId} onChange={e => setForm({...form, issueId: e.target.value})} required style={inp} />
            <input placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required style={{ ...inp, flex: 1 }} />
            <button type="submit">Submit</button>
          </form>
        )}
        {loading ? <p>Loading...</p> : (
          <table data-testid="comment-table" style={tbl}><thead><tr><th style={th}>ID</th><th style={th}>Issue</th><th style={th}>User</th><th style={th}>Message</th><th style={th}>Date</th>{isManager && <th style={th}>Actions</th>}</tr></thead>
            <tbody>{comments.map(c => (
              <tr data-testid="comment-row" key={c._id}>
                <td style={td}>{c.commentId}</td><td style={td}>{c.issueId}</td><td style={td}>{c.userId}</td><td style={td}>{c.message}</td>
                <td style={td}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                {isManager && <td style={td}><button onClick={() => handleDelete(c._id)}>Delete</button></td>}
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const inp = { padding: '6px', border: '1px solid #000', boxSizing: 'border-box' };
const tbl = { width: '100%', borderCollapse: 'collapse' };
const th = { border: '1px solid #000', padding: '6px', textAlign: 'left' };
const td = { border: '1px solid #000', padding: '6px' };

export default CommentsPage;