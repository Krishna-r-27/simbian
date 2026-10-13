import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { absoluteUrl, publicRoutes } from "../seo/publicRoutes";

export default function CatalogSeo() {
  const { pathname } = useLocation();
  const route = publicRoutes.find((item) => item.path === pathname);
  if (!route) return null;
  const canonical = absoluteUrl(route.path);

  return (
    <Helmet>
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta name="keywords" content={route.keywords} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
    </Helmet>
  );
}
