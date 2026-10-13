import toast from 'react-hot-toast';
import { uploadService } from '../services/uploadService';
import { getApiErrorMessage } from './format';

const UPLOAD_PATH_PREFIX = '/uploads/';

export function extractImageSrcs(html = '') {
  const srcs = new Set();
  const pattern = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html))) {
    if (match[1]) srcs.add(match[1]);
  }
  return srcs;
}

/** Returns a deletable `/uploads/...` base path, or null for external/data URLs. */
export function toOwnedImageBasePath(src) {
  if (!src || typeof src !== 'string') return null;

  let path = src.trim();
  if (!path || path.startsWith('data:') || path.startsWith('blob:')) return null;

  try {
    if (/^https?:\/\//i.test(path)) {
      const url = new URL(path);
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
        return null;
      }
      path = url.pathname;
    }
  } catch {
    return null;
  }

  const qIndex = path.indexOf('?');
  if (qIndex >= 0) path = path.slice(0, qIndex);

  if (!path.startsWith(UPLOAD_PATH_PREFIX)) return null;

  return path.replace(/\.(webp|png|jpg|jpeg|gif|bmp)$/i, '');
}

export async function deleteOwnedEditorImage(src) {
  const basePath = toOwnedImageBasePath(src);
  if (!basePath) return;

  try {
    await uploadService.deleteImage(basePath);
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Could not delete image from server.'));
  }
}

function resolveUploadedUrl(uploaded) {
  return (
    uploaded?.webpPath ||
    uploaded?.WebpPath ||
    uploaded?.pngPath ||
    uploaded?.PngPath ||
    (uploaded?.basePath || uploaded?.BasePath
      ? `${uploaded.basePath || uploaded.BasePath}.webp`
      : '')
  );
}

class EditorImageUploadAdapter {
  constructor(loader, getFolder) {
    this.loader = loader;
    this.getFolder = getFolder;
  }

  async upload() {
    const file = await this.loader.file;
    try {
      const uploaded = await uploadService.uploadImage(file, this.getFolder() || 'products');
      const url = resolveUploadedUrl(uploaded);
      if (!url) {
        throw new Error('Upload succeeded but no image URL was returned.');
      }
      return { default: url };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Image upload failed.');
      toast.error(message);
      throw error;
    }
  }

  abort() {
    // uploadService does not support cancellation yet
  }
}

/** CKEditor extraPlugins factory — reads folder from a live getter so prop updates apply. */
export function createEditorUploadAdapterPlugin(getFolder) {
  return function EditorUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
      new EditorImageUploadAdapter(loader, getFolder);
  };
}
