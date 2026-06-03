// Global app reducer — manages all state for the issue tracker
// Keeps existing test-compatible actions (SET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, SET_STATS, SET_LOADING, SET_ERROR)
// and adds new ones for full app state

export const initialState = {
  // Auth
  authUser: null,
  token: null,
  // Data
  items: [],       // kept for test compatibility (issues alias)
  users: [],
  projects: [],
  issues: [],
  comments: [],
  // UI
  filters: {},
  analytics: null,
  stats: null,
  loading: false,
  error: null
};

export function issueReducer(state, action) {
  switch (action.type) {
    // Auth
    case 'SET_AUTH_USER':
      return { ...state, authUser: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...initialState };

    // Data collections
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_ISSUES':
      return { ...state, issues: action.payload, items: action.payload, loading: false, error: null };
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };

    // Legacy/test-compatible actions (issues)
    case 'SET_ITEMS':
      return { ...state, items: action.payload, issues: action.payload, loading: false, error: null };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], issues: [...state.issues, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => item._id === action.payload._id ? action.payload : item),
        issues: state.issues.map(item => item._id === action.payload._id ? action.payload : item)
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        issues: state.issues.filter(item => item._id !== action.payload)
      };

    // Analytics & Stats
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };

    // UI
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

export default issueReducer;