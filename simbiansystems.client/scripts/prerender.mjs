import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  publicRoutes,
  SEO_CONTENT_STYLE,
  SEO_HIDE_CSS,
} from "../src/seo/publicRoutes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const shellSource = path.join(dist, "index.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function upsertTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertMeta(html, attr, key, content) {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attr}\\s*=\\s*["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`,
    "i"
  );
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  if (/<link\s+[^>]*rel\s*=\s*["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\s+[^>]*rel\s*=\s*["']canonical["'][^>]*>/i, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function ensureHideStyle(html) {
  const tag = `<style id="seo-content-hide">${SEO_HIDE_CSS}</style>`;
  if (/id\s*=\s*["']seo-content-hide["']/i.test(html)) {
    return html.replace(/<style\s+id\s*=\s*["']seo-content-hide["'][^>]*>[\s\S]*?<\/style>/i, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function crawlerBlock(heading, summary) {
  return `<main id="seo-content" aria-hidden="true" style="${SEO_CONTENT_STYLE}"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(summary)}</p></main>`;
}

function applyRoute(html, route) {
  let next = ensureHideStyle(html);
  next = upsertTitle(next, route.title);
  next = upsertMeta(next, "name", "description", route.description);
  next = upsertMeta(next, "name", "keywords", route.keywords);
  next = upsertCanonical(next, route.canonical);
  next = upsertMeta(next, "property", "og:title", route.title);
  next = upsertMeta(next, "property", "og:description", route.description);
  next = upsertMeta(next, "property", "og:url", route.canonical);
  next = upsertMeta(next, "property", "og:type", "website");
  next = upsertMeta(next, "name", "twitter:card", "summary_large_image");
  next = upsertMeta(next, "name", "twitter:title", route.title);
  next = upsertMeta(next, "name", "twitter:description", route.description);
  const block = crawlerBlock(route.heading, route.summary);
  if (!/<div\s+id=["']root["']\s*>\s*<\/div>/i.test(next)) {
    throw new Error("Built index.html is missing an empty #root");
  }
  next = next.replace(/<div\s+id=["']root["']\s*>\s*<\/div>/i, `<div id="root">${block}</div>`);
  return next;
}

if (!fs.existsSync(shellSource)) {
  console.error("dist/index.html is missing. Run vite build first.");
  process.exit(1);
}

const built = fs.readFileSync(shellSource, "utf8");
const shell = ensureHideStyle(built).replace(/<main\s+id=["']seo-content["'][\s\S]*?<\/main>/gi, "");
fs.writeFileSync(path.join(dist, "spa-shell.html"), shell, "utf8");

for (const route of publicRoutes.filter((item) => item.prerender)) {
  const html = applyRoute(shell, route);
  if (route.path === "/") {
    fs.writeFileSync(path.join(dist, "index.html"), html, "utf8");
    continue;
  }
  const directory = path.join(dist, route.path.replace(/^\//, ""));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html, "utf8");
}

console.log(`Prerendered ${publicRoutes.filter((item) => item.prerender).length} routes and spa-shell.html`);
