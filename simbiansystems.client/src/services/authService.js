import api, { unwrap } from '../api/axios';
const call = (method, url, data) => api[method](url, data).then(unwrap);
export const authService = {
  login: (data) => call('post', '/auth/login', data),
  logout: (refreshToken) => call('post', '/auth/logout', { refreshToken }),
  forgotPassword: (data) => call('post', '/auth/forgot-password', data),
  resetPassword: (data) => call('post', '/auth/reset-password', data),
  changePassword: (data) => call('post', '/auth/change-password', data),
  getProfile: () => api.get('/auth/profile').then(unwrap),
  updateProfile: (data) => api.put('/auth/profile', data).then(unwrap),
};
