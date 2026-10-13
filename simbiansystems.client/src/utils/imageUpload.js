export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';
export const IMAGE_UPLOAD_HINT = 'PNG, JPG or WEBP up to 10MB';
export function validateImageFile(file, maxBytes = MAX_IMAGE_BYTES) {
  if (!file) return 'Image is required.';
  if (!/^image\/(png|jpeg|jpg|webp)$/.test(file.type) && !/\.(png|jpe?g|webp)$/i.test(file.name)) return 'Only PNG, JPG, and WEBP images are allowed.';
  return file.size > maxBytes ? 'Image must be 10MB or smaller.' : null;
}
const blob = (canvas, type, quality) => new Promise((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Image compression failed.')), type, quality));
export async function compressImageFile(file, { onProgress } = {}) {
  const error = validateImageFile(file); if (error) throw new Error(error);
  onProgress?.(10);
  const url = URL.createObjectURL(file); const image = new Image();
  await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url; }); URL.revokeObjectURL(url);
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); onProgress?.(55);
  let quality = .84; let output = await blob(canvas, 'image/webp', quality);
  while (output.size > MAX_IMAGE_BYTES && quality > .45) { quality -= .1; output = await blob(canvas, 'image/webp', quality); }
  if (output.size > MAX_IMAGE_BYTES) throw new Error('Image must be 10MB or smaller.');
  onProgress?.(100); return new File([output], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
}
