// Data cleaning helpers: trim strings, normalize enums, reject nulls/dupes
// Frontend copy of the backend sanitizer for unit testing

const VALID_ISSUE_STATUSES = ['open', 'in-progress', 'testing', 'resolved', 'closed'];
const VALID_ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'];
const VALID_ISSUE_SEVERITIES = ['minor', 'major', 'critical'];

export function sanitizeRecord(record) {
  if (!record) return null;
  const { issueId, title, projectId, priority, severity, status } = record;

  // Mandatory fields check
  if (!issueId || !title || !projectId || !priority || !severity || !status) return null;
  if (typeof issueId !== 'string' || issueId.trim() === '') return null;
  if (typeof title !== 'string' || title.trim() === '') return null;
  if (typeof projectId !== 'string' || projectId.trim() === '') return null;
  if (typeof priority !== 'string' || priority.trim() === '') return null;
  if (typeof severity !== 'string' || severity.trim() === '') return null;
  if (typeof status !== 'string' || status.trim() === '') return null;

  const cleanPriority = priority.trim().toLowerCase();
  const cleanSeverity = severity.trim().toLowerCase();
  const cleanStatus = status.trim().toLowerCase();

  // Enum validation
  if (!VALID_ISSUE_PRIORITIES.includes(cleanPriority)) return null;
  if (!VALID_ISSUE_SEVERITIES.includes(cleanSeverity)) return null;
  if (!VALID_ISSUE_STATUSES.includes(cleanStatus)) return null;

  return {
    issueId: issueId.trim(),
    title: title.trim(),
    projectId: projectId.trim(),
    assignedTo: record.assignedTo ? String(record.assignedTo).trim() : null,
    reportedBy: record.reportedBy ? String(record.reportedBy).trim() : null,
    priority: cleanPriority,
    severity: cleanSeverity,
    status: cleanStatus
  };
}

export { VALID_ISSUE_STATUSES, VALID_ISSUE_PRIORITIES, VALID_ISSUE_SEVERITIES };
export default sanitizeRecord;
