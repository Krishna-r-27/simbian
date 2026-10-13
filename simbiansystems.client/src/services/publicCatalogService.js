import api, { unwrap } from '../api/axios';

export const publicCatalogService = {
  categories: () => api.get('/public/categories').then(unwrap),
  list: (params) => api.get('/public/category', { params }).then(unwrap),
  getBySlug: (slug) => api.get(`/public/category/${encodeURIComponent(slug)}`).then(unwrap),
};
