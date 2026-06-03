// Dashboard — simple black and white
import { useEffect, useState } from 'react';
import { useApp } from '../context/TaskContext';
import { getIssueAnalytics, getAllIssues, getAllProjects } from '../services/api';
import Navbar from '../components/Navbar';

function DashboardPage() {
  const { authUser, dispatch } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = authUser?.role === 'admin' || authUser?.role === 'manager';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const issuesRes = await getAllIssues({ limit: 5 });
        setRecentIssues(issuesRes.data || []);
        dispatch({ type: 'SET_ISSUES', payload: issuesRes.data || [] });
        const projRes = await getAllProjects({ status: 'active' });
        setActiveProjects(projRes.data || []);
        dispatch({ type: 'SET_PROJECTS', payload: projRes.data || [] });
        if (isAdmin) {
          try {
            const a = await getIssueAnalytics();
            setAnalytics(a.data);
            dispatch({ type: 'SET_ANALYTICS', payload: a.data });
          } catch (e) {}
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <div data-testid="analytics-container" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '20px 0' }}>
              <div data-testid="total-issues-card" style={card}><b>Total Issues</b><div style={{ fontSize: '24px' }}>{analytics?.totalIssues ?? '—'}</div></div>
              <div data-testid="active-projects-card" style={card}><b>Active Projects</b><div style={{ fontSize: '24px' }}>{activeProjects.length}</div></div>
              <div data-testid="open-issues-card" style={card}><b>Open Issues</b><div style={{ fontSize: '24px' }}>{analytics?.openIssues ?? '—'}</div></div>
              <div data-testid="closed-issues-card" style={card}><b>Closed Issues</b><div style={{ fontSize: '24px' }}>{analytics?.closedIssues ?? '—'}</div></div>
            </div>
            <div data-testid="issue-chart" style={{ border: '1px solid #000', padding: '16px', marginBottom: '20px' }}>
              <h3>Issue Status</h3>
              {analytics && <p>Open: {analytics.openIssues} | Resolved: {analytics.resolvedIssues} | Closed: {analytics.closedIssues}</p>}
            </div>
            <div data-testid="recent-activity" style={{ border: '1px solid #000', padding: '16px' }}>
              <h3>Recent Issues</h3>
              <table style={tbl}><thead><tr><th style={th}>ID</th><th style={th}>Title</th><th style={th}>Status</th><th style={th}>Priority</th></tr></thead>
                <tbody>{recentIssues.map(i => <tr key={i._id}><td style={td}>{i.issueId}</td><td style={td}>{i.title}</td><td style={td}>{i.status}</td><td style={td}>{i.priority}</td></tr>)}</tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const card = { border: '1px solid #000', padding: '16px', minWidth: '150px', textAlign: 'center' };
const tbl = { width: '100%', borderCollapse: 'collapse' };
const th = { border: '1px solid #000', padding: '6px', textAlign: 'left' };
const td = { border: '1px solid #000', padding: '6px' };

export default DashboardPage;