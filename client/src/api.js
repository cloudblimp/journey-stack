import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
});

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const authApi = {
  async register({ username, email, password }) {
    const { data } = await apiClient.post('/auth/register', { username, email, password });
    return data;
  },
  async login({ email, password }) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
  async me() {
    const { data } = await apiClient.get('/auth/me');
    return data.user;
  },
  async google(idToken) {
    const { data } = await apiClient.post('/auth/google', { idToken });
    return data;
  },
};

export const tripsApi = {
  async list() {
    const { data } = await apiClient.get('/trips');
    return data;
  },
  async create({ title, startDate, endDate }) {
    const { data } = await apiClient.post('/trips', { title, startDate, endDate });
    return data;
  },
};

export const journalApi = {
  async list(tripId) {
    const { data } = await apiClient.get(`/trips/${tripId}/journal`);
    return data;
  },
  async create(tripId, payload) {
    const { data } = await apiClient.post(`/trips/${tripId}/journal`, payload);
    return data;
  },
  async update(entryId, payload) {
    const { data } = await apiClient.put(`/journal/${entryId}`, payload);
    return data;
  },
  async delete(entryId) {
    const { data } = await apiClient.delete(`/journal/${entryId}`);
    return data;
  },
};

export const packingApi = {
  async get(tripId) {
    const { data } = await apiClient.get(`/trips/${tripId}/packinglist`);
    return data;
  },
  async update(tripId, items) {
    const { data } = await apiClient.put(`/trips/${tripId}/packinglist`, { items });
    return data;
  },
};

export const statsApi = {
  async get() {
    const { data } = await apiClient.get('/stats');
    return data;
  },
};

export const mediaApi = {
  async getSignedUpload() {
    const { data } = await apiClient.post('/media/upload');
    return data;
  },
  async confirm(payload) {
    const { data } = await apiClient.post('/media/confirm', payload);
    return data;
  },
};

export default apiClient;


