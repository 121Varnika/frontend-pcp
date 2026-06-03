// Test SET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM actions
import { describe, it, expect } from 'vitest';
import { issueReducer, initialState } from './taskReducer';

describe('issueReducer', () => {
  it('should return initial state', () => {
    const result = issueReducer(initialState, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  it('should handle SET_ITEMS', () => {
    const items = [
      { _id: '1', issueId: 'ISS1001', title: 'Bug 1', status: 'open', priority: 'high', severity: 'major', projectId: 'PROJ1001' },
      { _id: '2', issueId: 'ISS1002', title: 'Bug 2', status: 'closed', priority: 'low', severity: 'minor', projectId: 'PROJ1002' }
    ];
    const result = issueReducer(initialState, { type: 'SET_ITEMS', payload: items });
    expect(result.items).toEqual(items);
    expect(result.loading).toBe(false);
    expect(result.error).toBe(null);
  });

  it('should handle ADD_ITEM', () => {
    const state = { ...initialState, items: [{ _id: '1', issueId: 'ISS1001', title: 'Bug 1' }] };
    const newItem = { _id: '2', issueId: 'ISS1002', title: 'Bug 2' };
    const result = issueReducer(state, { type: 'ADD_ITEM', payload: newItem });
    expect(result.items).toHaveLength(2);
    expect(result.items[1]).toEqual(newItem);
  });

  it('should handle UPDATE_ITEM', () => {
    const state = {
      ...initialState,
      items: [
        { _id: '1', issueId: 'ISS1001', title: 'Bug 1', status: 'open' }, 
        { _id: '2', issueId: 'ISS1002', title: 'Bug 2', status: 'open' }
      ]
    };
    const updated = { _id: '1', issueId: 'ISS1001', title: 'Bug 1 Updated', status: 'closed' };
    const result = issueReducer(state, { type: 'UPDATE_ITEM', payload: updated });
    expect(result.items[0].title).toBe('Bug 1 Updated');
    expect(result.items[0].status).toBe('closed');
    expect(result.items[1].title).toBe('Bug 2');
  });

  it('should handle DELETE_ITEM', () => {
    const state = {
      ...initialState,
      items: [
        { _id: '1', issueId: 'ISS1001', title: 'Bug 1' },
        { _id: '2', issueId: 'ISS1002', title: 'Bug 2' }
      ]
    };
    const result = issueReducer(state, { type: 'DELETE_ITEM', payload: '1' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]._id).toBe('2');
  });

  it('should handle SET_LOADING', () => {
    const result = issueReducer(initialState, { type: 'SET_LOADING', payload: true });
    expect(result.loading).toBe(true);
  });

  it('should handle SET_ERROR', () => {
    const loadingState = { ...initialState, loading: true };
    const result = issueReducer(loadingState, { type: 'SET_ERROR', payload: 'Something went wrong' });
    expect(result.error).toBe('Something went wrong');
    expect(result.loading).toBe(false);
  });

  it('should handle SET_STATS', () => {
    const stats = { totalIssues: 100, byStatus: { open: 50, closed: 50 } };
    const result = issueReducer(initialState, { type: 'SET_STATS', payload: stats });
    expect(result.stats).toEqual(stats);
  });

  it('should return state unchanged for unknown action', () => {
    const state = { ...initialState, items: [{ _id: '1' }] };
    const result = issueReducer(state, { type: 'NONEXISTENT_ACTION' });
    expect(result).toEqual(state);
  });
});
