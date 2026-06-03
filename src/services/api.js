// Axios instance with baseURL from .env; all backend API calls live here
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add auth header to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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

// ============ ISSUES CRUD ============
export async function getAllIssues(filters = {}) {
  const params = { limit: 200 };
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
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

export async function searchIssues(query) {
  const res = await api.get('/issues/search', { params: { q: query } });
  return res.data;
}

// ============ STATS ============
export async function getStats() {
  const res = await api.get('/stats');
  return res.data;
}

// ============ HEALTH ============
export async function getHealth() {
  const res = await api.get('/health');
  return res.data;
}

export default api;