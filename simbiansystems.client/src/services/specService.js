import api, { unwrap } from '../api/axios';
const resource = (name) => ({ list: (params) => api.get(`/specs/${name}`, { params }).then(unwrap), create: (data) => api.post(`/specs/${name}`, data).then(unwrap), update: (id, data) => api.put(`/specs/${name}/${id}`, data).then(unwrap), delete: (id) => api.delete(`/specs/${name}/${id}`).then(unwrap) });
export const specService = { groups: resource('groups'), definitions: resource('definitions'), template: (categoryId) => api.get(`/specs/template/${categoryId}`).then(unwrap) };
