import { resolveImageUrls } from '../../utils/imagePath';

export default function PictureImage({
  imageBasePath,
  alt = '',
  className = '',
  imgClassName = '',
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
        className={imgClassName || 'block h-full w-full object-cover'}
        loading="lazy"
      />
    </picture>
  );
}
