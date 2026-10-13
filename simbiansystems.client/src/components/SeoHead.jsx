import { Helmet } from 'react-helmet-async';
import { absoluteUrl } from '../seo/publicRoutes';

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/**
 * Sets document title, description, keywords, canonical, and Open Graph tags.
 */
export default function SeoHead({
  title,
  description,
  keywords,
  path,
  image,
  type = 'website',
}) {
  const canonical = path ? absoluteUrl(path) : undefined;
  const ogImage = toAbsoluteUrl(image);

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}

/** Build "Brand · Model #" omitting missing parts. */
export function formatBrandModel(brand, modelNumber) {
  const parts = [brand, modelNumber].map((x) => (x || '').trim()).filter(Boolean);
  return parts.length ? parts.join(' · ') : '';
}

/** Build contact prefill string: "Name (Brand · Model #)". */
export function formatProductInquiryLabel(product) {
  if (!product?.name) return 'Product Inquiry';
  const brandModel = formatBrandModel(product.brand, product.modelNumber);
  return brandModel ? `${product.name} (${brandModel})` : product.name;
}

/** Strip HTML tags for meta description fallback. */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildProductMetaDescription(product) {
  return (
    product?.seoDescription?.trim() ||
    product?.shortDescription?.trim() ||
    stripHtml(product?.description) ||
    `Learn more about ${product?.name || 'this product'} from Simbian Systems.`
  );
}
