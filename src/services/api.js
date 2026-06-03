// Axios instance with baseURL; all backend API calls
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_BASE_URL });

// Add auth header to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============ AUTH ============
export async function registerUser(name, email, password, role, department) {
  const res = await api.post('/auth/register', { name, email, password, role, department });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res.data;
}

// ============ SYNC ============
export async function syncData() {
  const res = await api.post('/sync');
  return res.data;
}

// ============ USERS ============
export async function getAllUsers(params = {}) {
  const res = await api.get('/users', { params: { limit: 200, ...params } });
  return res.data;
}

export async function getUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

// ============ PROJECTS ============
export async function getAllProjects(params = {}) {
  const res = await api.get('/projects', { params: { limit: 200, ...params } });
  return res.data;
}

export async function getProjectById(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function createProject(data) {
  const res = await api.post('/projects', data);
  return res.data;
}

export async function updateProject(id, data) {
  const res = await api.patch(`/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}

// ============ ISSUES ============
export async function getAllIssues(filters = {}) {
  const params = { limit: 200 };
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.severity) params.severity = filters.severity;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.projectId) params.projectId = filters.projectId;
  if (filters.assignedTo) params.assignedTo = filters.assignedTo;
  const res = await api.get('/issues', { params });
  return res.data;
}

export async function getIssueById(id) {
  const res = await api.get(`/issues/${id}`);
  return res.data;
}

export async function createIssue(data) {
  const res = await api.post('/issues', data);
  return res.data;
}

export async function updateIssue(id, data) {
  const res = await api.patch(`/issues/${id}`, data);
  return res.data;
}

export async function deleteIssue(id) {
  const res = await api.delete(`/issues/${id}`);
  return res.data;
}

export async function assignIssue(id, assignedTo) {
  const res = await api.patch(`/issues/${id}/assign`, { assignedTo });
  return res.data;
}

export async function updateIssueStatus(id, status) {
  const res = await api.patch(`/issues/${id}/status`, { status });
  return res.data;
}

export async function searchIssues(query) {
  const res = await api.get('/issues/search', { params: { q: query } });
  return res.data;
}

// ============ COMMENTS ============
export async function getAllComments(params = {}) {
  const res = await api.get('/comments', { params: { limit: 200, ...params } });
  return res.data;
}

export async function getCommentById(id) {
  const res = await api.get(`/comments/${id}`);
  return res.data;
}

export async function createComment(data) {
  const res = await api.post('/comments', data);
  return res.data;
}

export async function deleteComment(id) {
  const res = await api.delete(`/comments/${id}`);
  return res.data;
}

// ============ ANALYTICS ============
export async function getIssueAnalytics() {
  const res = await api.get('/analytics/issues');
  return res.data;
}

export async function getProjectAnalytics() {
  const res = await api.get('/analytics/projects');
  return res.data;
}

export async function getDeveloperAnalytics() {
  const res = await api.get('/analytics/developers');
  return res.data;
}

// ============ STATS & HEALTH ============
export async function getStats() {
  const res = await api.get('/stats');
  return res.data;
}

export async function getHealth() {
  const res = await api.get('/health');
  return res.data;
}

export default api;