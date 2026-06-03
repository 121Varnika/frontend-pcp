// Global AppContext — Context API + useReducer, exposes window.appState
import { createContext, useReducer, useEffect, useContext } from 'react';
import { issueReducer, initialState } from '../reducer/taskReducer';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(issueReducer, initialState);

  // Restore auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      dispatch({ type: 'SET_TOKEN', payload: token });
    }
    if (user) {
      try {
        dispatch({ type: 'SET_AUTH_USER', payload: JSON.parse(user) });
      } catch (e) { /* ignore parse errors */ }
    }
  }, []);

  // Expose window.appState for Playwright evaluation
  useEffect(() => {
    window.appState = {
      authUser: state.authUser,
      token: state.token,
      users: state.users,
      projects: state.projects,
      issues: state.issues,
      comments: state.comments,
      filters: state.filters,
      analytics: state.analytics
    };
  }, [state]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Keep backward-compatible exports
export const IssueContext = AppContext;
export const IssueProvider = AppProvider;
export const useIssues = useApp;

export default AppContext;