import api, { unwrap } from '../api/axios';
export const dashboardService = { stats: () => api.get('/dashboard/stats').then(unwrap) };
