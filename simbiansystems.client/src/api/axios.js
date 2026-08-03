import axios from 'axios';
import { storage } from '../utils/storage';
const api = axios.create({ baseURL: '/api', headers: { Accept: 'application/json' } });
let refreshing;
api.interceptors.request.use((config) => { const token = storage.getAccessToken(); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  if (error.response?.status !== 401 || request?._retry || request?.url?.includes('/auth/')) return Promise.reject(error);
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return unauthorised(error);
  request._retry = true;
  try {
    refreshing ||= axios.post('/api/auth/refresh', { refreshToken }).then((r) => r.data?.data ?? r.data);
    const auth = await refreshing; refreshing = null; storage.setAuth({ ...auth, user: auth.profile ?? storage.getUser() });
    request.headers.Authorization = `Bearer ${auth.accessToken}`; return api(request);
  } catch (e) { refreshing = null; return unauthorised(e); }
});
function unauthorised(error) { storage.clearAuth(); if (!location.pathname.includes('/poweradmin/login')) location.href = '/poweradmin/login'; return Promise.reject(error); }
export const unwrap = (response) => response?.data?.data ?? response?.data;
export default api;
