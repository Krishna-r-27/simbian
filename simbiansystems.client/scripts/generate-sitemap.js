import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { notFoundSeo, publicRoutes, SITE_ORIGIN } from "../src/seo/publicRoutes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const listed = publicRoutes.filter((route) => route.sitemap);
const urls = listed
  .map(
    (route) => `  <url>
    <loc>${xmlEscape(route.canonical)}</loc>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const catalog = {
  origin: SITE_ORIGIN,
  notFound: notFoundSeo,
  routes: publicRoutes,
};

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(publicDir, "seo-routes.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Wrote ${listed.length} sitemap URLs and seo-routes.json`);
