import api, { unwrap } from '../api/axios';
const page = (params) => api.get('/products', { params }).then(unwrap);
export const productService = {
  getPaged: page, get: (id) => api.get(`/products/${id}`).then(unwrap), categories: () => api.get('/products/categories').then(unwrap),
  create: (data) => api.post('/products', data).then(unwrap), update: (id, data) => api.put(`/products/${id}`, data).then(unwrap),
  reorderGallery: (id, galleryImages) => api.put(`/products/${id}/gallery-order`, { galleryImages }).then(unwrap),
  delete: (id) => api.delete(`/products/${id}`).then(unwrap), duplicate: (id) => api.post(`/products/${id}/duplicate`).then(unwrap),
  bulkDelete: (ids) => api.post('/products/bulk-delete', { ids }).then(unwrap),
  bulkPublish: (ids, isPublished) => api.post('/products/bulk-publish', { ids, isPublished }).then(unwrap),
  setPublished: (id, isPublished) =>
    api.post('/products/bulk-publish', { ids: [id], isPublished }).then(unwrap),
  export: (excel = false) => api.get('/products/export', { params: { excel }, responseType: 'blob' }),
};
