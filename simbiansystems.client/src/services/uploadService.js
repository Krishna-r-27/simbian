import api, { unwrap } from '../api/axios';
import { compressImageFile } from '../utils/imageUpload';

function mapUploadProgress(event, onProgress) {
  if (!onProgress || !event?.total) return;
  onProgress(Math.max(60, Math.round((event.loaded / event.total) * 100)));
}

export const uploadService = {
  uploadImage: async (file, folder = 'products', { onProgress } = {}) => {
    onProgress?.(5);
    const prepared = await compressImageFile(file, {
      onProgress: (pct) => onProgress?.(Math.round(pct * 0.3)),
    });

    const form = new FormData();
    form.append('file', prepared);

    const response = await api.post(`/uploads/image?folder=${encodeURIComponent(folder)}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => mapUploadProgress(event, onProgress),
    });

    onProgress?.(100);
    return unwrap(response);
  },

  uploadPdf: async (file, folder = 'products', { onProgress } = {}) => {
    onProgress?.(10);
    const form = new FormData();
    form.append('file', file);

    const response = await api.post(`/uploads/pdf?folder=${encodeURIComponent(folder)}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => mapUploadProgress(event, onProgress),
    });

    onProgress?.(100);
    return unwrap(response);
  },

  deleteImage: async (basePath) =>
    unwrap(await api.delete(`/uploads/image?basePath=${encodeURIComponent(basePath)}`)),
};
