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
      <div>
        <h1>Dashboard</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <div data-testid="analytics-container">
              <div data-testid="total-issues-card">
                <b>Total Issues: </b>
                <span>{analytics?.totalIssues ?? '—'}</span>
              </div>
              <div data-testid="active-projects-card">
                <b>Active Projects: </b>
                <span>{activeProjects.length}</span>
              </div>
              <div data-testid="open-issues-card">
                <b>Open Issues: </b>
                <span>{analytics?.openIssues ?? '—'}</span>
              </div>
              <div data-testid="closed-issues-card">
                <b>Closed Issues: </b>
                <span>{analytics?.closedIssues ?? '—'}</span>
              </div>
            </div>
            
            <br />
            
            <div data-testid="issue-chart">
              <h3>Issue Status</h3>
              {analytics && (
                <p>
                  Open: {analytics.openIssues} | Resolved: {analytics.resolvedIssues} | Closed: {analytics.closedIssues}
                </p>
              )}
            </div>
            
            <br />
            
            <div data-testid="recent-activity">
              <h3>Recent Issues</h3>
              <table border="1" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map(i => (
                    <tr key={i._id}>
                      <td>{i.issueId}</td>
                      <td>{i.title}</td>
                      <td>{i.status}</td>
                      <td>{i.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;