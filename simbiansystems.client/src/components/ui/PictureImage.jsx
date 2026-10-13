import { resolveImageUrls } from '../../utils/imagePath';

const hiddenAlt = { color: "transparent", fontSize: 0 };

export default function PictureImage({
  imageBasePath,
  alt = '',
  className = '',
  imgClassName = '',
  priority = false,
}) {
  const urls = resolveImageUrls(imageBasePath);
  if (!imageBasePath) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-xs text-slate-400 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <picture className={`block shrink-0 overflow-hidden ${className}`}>
      {urls.webp ? <source srcSet={urls.webp} type="image/webp" /> : null}
      <img
        src={urls.png || urls.fallback}
        alt={alt}
        draggable={false}
        className={imgClassName || 'block h-full w-full object-cover'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={hiddenAlt}
      />
    </picture>
  );
}
