export function resolveImageUrls(imageBasePath) {
  if (!imageBasePath) {
    return { webp: '', png: '', fallback: '' };
  }

  const base = imageBasePath.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  const absoluteBase = base.startsWith('/') || base.startsWith('http') ? base : `/${base}`;

  return {
    webp: `${absoluteBase}.webp`,
    png: `${absoluteBase}.png`,
    fallback: absoluteBase.includes('.') ? absoluteBase : `${absoluteBase}.png`,
  };
}

/** @deprecated Prefer resolveImageUrls — kept for callers that need a single src. */
export const imagePath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const urls = resolveImageUrls(path);
  return urls.webp || urls.fallback || path;
};
