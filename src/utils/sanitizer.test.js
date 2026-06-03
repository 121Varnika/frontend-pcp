// Sanitizer unit tests
import { describe, it, expect } from 'vitest';
import { sanitizeRecord } from './sanitizer';

const validRecord = {
  issueId: 'ISS1001',
  title: 'Lead assignment failure',
  projectId: 'PROJ1001',
  assignedTo: 'USR1011',
  reportedBy: 'USR1046',
  priority: 'high',
  severity: 'major',
  status: 'open'
};

describe('sanitizeRecord', () => {
  it('should return a valid cleaned record for valid input', () => {
    const result = sanitizeRecord(validRecord);
    expect(result).not.toBeNull();
    expect(result.issueId).toBe('ISS1001');
    expect(result.title).toBe('Lead assignment failure');
    expect(result.projectId).toBe('PROJ1001');
    expect(result.priority).toBe('high');
    expect(result.severity).toBe('major');
    expect(result.status).toBe('open');
  });

  it('should return null for null input', () => {
    expect(sanitizeRecord(null)).toBeNull();
  });

  it('should return null when issueId is missing', () => {
    const record = { ...validRecord, issueId: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null when title is missing', () => {
    const record = { ...validRecord, title: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null when projectId is missing', () => {
    const record = { ...validRecord, projectId: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null when priority is missing', () => {
    const record = { ...validRecord, priority: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null when severity is missing', () => {
    const record = { ...validRecord, severity: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null when status is missing', () => {
    const record = { ...validRecord, status: undefined };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null for empty string fields', () => {
    const record = { ...validRecord, title: '' };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null for whitespace-only fields', () => {
    const record = { ...validRecord, title: '   ' };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null for invalid priority enum', () => {
    const record = { ...validRecord, priority: 'urgent' };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null for invalid severity enum', () => {
    const record = { ...validRecord, severity: 'blocker' };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should return null for invalid status enum', () => {
    const record = { ...validRecord, status: 'done' };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should trim whitespace from string fields', () => {
    const record = { ...validRecord, title: '  Login Failure  ', issueId: ' ISS9001 ' };
    const result = sanitizeRecord(record);
    expect(result).not.toBeNull();
    expect(result.title).toBe('Login Failure');
    expect(result.issueId).toBe('ISS9001');
  });

  it('should normalize priority to lowercase', () => {
    const record = { ...validRecord, priority: ' HIGH ' };
    const result = sanitizeRecord(record);
    expect(result).not.toBeNull();
    expect(result.priority).toBe('high');
  });

  it('should normalize severity to lowercase', () => {
    const record = { ...validRecord, severity: ' CRITICAL ' };
    const result = sanitizeRecord(record);
    expect(result).not.toBeNull();
    expect(result.severity).toBe('critical');
  });

  it('should normalize status to lowercase', () => {
    const record = { ...validRecord, status: ' OPEN ' };
    const result = sanitizeRecord(record);
    expect(result).not.toBeNull();
    expect(result.status).toBe('open');
  });

  it('should return null for numeric priority (non-string)', () => {
    const record = { ...validRecord, priority: 123 };
    expect(sanitizeRecord(record)).toBeNull();
  });

  it('should handle optional fields being null', () => {
    const record = { ...validRecord, assignedTo: null, reportedBy: null };
    const result = sanitizeRecord(record);
    expect(result).not.toBeNull();
    expect(result.assignedTo).toBeNull();
    expect(result.reportedBy).toBeNull();
  });
});
