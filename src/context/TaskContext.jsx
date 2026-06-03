// Creates Context + Provider, wires up dispatch + state
import { createContext, useReducer, useEffect, useContext } from 'react';
import { issueReducer, initialState } from '../reducer/taskReducer';
import { getAllIssues, getStats } from '../services/api';

export const IssueContext = createContext();

export function IssueProvider({ children }) {
  const [state, dispatch] = useReducer(issueReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const issuesRes = await getAllIssues();
        dispatch({ type: 'SET_ITEMS', payload: issuesRes.data || [] });

        const statsRes = await getStats();
        dispatch({ type: 'SET_STATS', payload: statsRes.data || null });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    fetchData();
  }, []);

  return (
    <IssueContext.Provider value={{ ...state, dispatch }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}

export default IssueContext;