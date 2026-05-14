import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mg_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mg_token');
      localStorage.removeItem('mg_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

// Predictions
export const predictText = (text) => api.post('/predict', { text });
export const getHistory = () => api.get('/history');

// Admin
export const getAllPredictions = (params) => api.get('/admin/all-predictions', { params });
export const addAnnotation = (id, annotation, feedback) =>
  api.put(`/admin/add-annotation/${id}`, { annotation, feedback });
export const deletePrediction = (id) => api.delete(`/admin/delete-prediction/${id}`);

export default api;
