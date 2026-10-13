export const SITE_ORIGIN = "https://www.simbiansystems.com";

export const SEO_CONTENT_STYLE =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";

export const SEO_HIDE_CSS = `#seo-content{${SEO_CONTENT_STYLE}}img{color:transparent;font-size:0}`;

function route(path, title, description, keywords, heading, summary) {
  return {
    path,
    title,
    description,
    keywords,
    canonical: `${SITE_ORIGIN}${path}`,
    prerender: true,
    sitemap: true,
    heading,
    summary,
  };
}

export const publicRoutes = [
  route(
    "/",
    "Enterprise IT Solutions Built for Performance | Simbian Systems",
    "Simbian Systems delivers enterprise computing, servers, networking, storage, and managed IT services for businesses, education, healthcare, and government across Gujarat and India.",
    "Simbian Systems, enterprise IT, computers, servers, networking, storage, Gujarat, Baroda",
    "Enterprise IT solutions built for performance",
    "Simbian Systems is a Baroda-based supplier of enterprise desktops, laptops, servers, networking, and managed IT services. The company supports businesses, educational institutions, healthcare, and government organizations with hardware, installation, and ongoing facility management."
  ),
  route(
    "/products",
    "Enterprise IT Products | Simbian Systems",
    "Browse enterprise IT hardware from Simbian Systems, including desktops, laptops, servers, networking gear, printers, UPS systems, and security products.",
    "enterprise desktops, business laptops, servers, networking, printers, UPS, Simbian Systems products",
    "Enterprise IT products",
    "Browse the Simbian Systems product catalog. Published hardware is grouped by category, covering desktops, laptops, servers, networking, printers, power protection, and security equipment available for quote."
  ),
  route(
    "/solutions",
    "Turnkey IT Solutions | Simbian Systems",
    "Turnkey information management, banking and education infrastructure, global trading, and OEM technical support from Simbian Systems.",
    "turnkey IT solutions, banking infrastructure, education IT, global trading, OEM support, Simbian Systems",
    "Turnkey IT solutions",
    "Simbian Systems designs turnkey information management systems, banking and educational infrastructure, and global supply support. Solutions cover architecture, deployment, and OEM technical backing for corporate computer centers."
  ),
  route(
    "/services-portfolio",
    "Managed IT Services and Facility Management | Simbian Systems",
    "Facility management, on-site engineers, network security, database administration, and hardware maintenance contracts from Simbian Systems.",
    "facility management, FMS, AMC, on-site engineers, hardware maintenance, Simbian Systems services",
    "Managed IT services and facility management",
    "Simbian Systems provides facility management and annual maintenance for business IT. Services include resident engineers, network security, database administration, and hardware support that keep offices and computer centers running."
  ),
  route(
    "/about-us",
    "About Simbian Systems | Baroda IT Infrastructure",
    "Simbian Systems is a Baroda-based computer and peripheral marketing organization supplying enterprise IT infrastructure across Gujarat and India.",
    "about Simbian Systems, Baroda IT company, Gujarat computer supplier, enterprise infrastructure",
    "About Simbian Systems",
    "Simbian Systems is a Baroda-based computer system and peripheral marketing organization with a presence across Gujarat, a national associate network, and international supply connections for enterprise IT infrastructure."
  ),
  route(
    "/contact-us",
    "Contact Simbian Systems | Sales and Support",
    "Contact Simbian Systems in Baroda for enterprise hardware quotes, procurement, facility management, and technical consulting.",
    "contact Simbian Systems, IT quote, hardware procurement, Baroda sales, technical consulting",
    "Contact Simbian Systems",
    "Contact the Simbian Systems team for enterprise hardware quotes, procurement help, facility management, and technical consulting. Share your requirement and the team will follow up from Baroda."
  ),
  route(
    "/sitemap",
    "Sitemap | Simbian Systems",
    "Directory of Simbian Systems pages: home, products, solutions, services, about, contact, and product categories.",
    "Simbian Systems sitemap, site directory, product categories",
    "Sitemap",
    "Directory of the Simbian Systems website. Find the homepage, product catalog, turnkey solutions, managed services, company profile, and contact page, plus links into each product category."
  ),
];

export const notFoundSeo = {
  title: "Page Not Found | Simbian Systems",
  description:
    "The page you requested is not on the Simbian Systems website. Visit the homepage, product catalog, or contact page to continue.",
  keywords: "Simbian Systems, page not found",
  heading: "Page not found",
  summary:
    "This address does not match a page on Simbian Systems. Open the homepage, the product catalog, or the contact page to find enterprise IT hardware and services.",
};

export function absoluteUrl(path) {
  const normalized = !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `${window.location.origin}${normalized}`;
    }
  }
  return `${SITE_ORIGIN}${normalized}`;
}
