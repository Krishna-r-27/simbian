import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicRoutes } from "../src/seo/publicRoutes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  const full = path.join(dist, relativePath);
  if (!fs.existsSync(full)) {
    fail(`Missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

function rootInner(html) {
  const match = html.match(/<div\s+id=["']root["']\s*>([\s\S]*?)<\/div>/i);
  return match ? match[1].trim() : "";
}

const shell = read("spa-shell.html");
if (shell) {
  if (!shell.includes('id="seo-content-hide"')) fail("spa-shell.html is missing id=\"seo-content-hide\"");
  if (!shell.includes("clip:rect(0,0,0,0)")) fail("spa-shell.html is missing clip:rect(0,0,0,0)");
  if (shell.includes('id="seo-content"')) fail("spa-shell.html must not contain #seo-content");
  if (rootInner(shell)) fail("spa-shell.html #root must stay empty");
  const home = publicRoutes.find((route) => route.path === "/");
  if (home && shell.includes(home.title)) fail("spa-shell.html uses the homepage title");
  if (home && shell.includes(home.summary)) fail("spa-shell.html contains the homepage summary");
}

const titles = new Set();
const descriptions = new Set();
const home = publicRoutes.find((route) => route.path === "/");

for (const route of publicRoutes.filter((item) => item.prerender)) {
  const relative = route.path === "/" ? "index.html" : `${route.path.replace(/^\//, "")}/index.html`;
  const html = read(relative);
  if (!html) continue;
  const label = route.path;
  if (!html.includes(`<title>${route.title}</title>`)) fail(`${label} title mismatch`);
  if (!html.includes(`content="${route.description}"`)) fail(`${label} description mismatch`);
  if (!html.includes(`href="${route.canonical}"`)) fail(`${label} canonical mismatch`);
  if (!html.includes('id="seo-content"')) fail(`${label} is missing #seo-content`);
  if (!html.includes('id="seo-content-hide"')) fail(`${label} is missing id="seo-content-hide"`);
  if (!html.includes("clip:rect(0,0,0,0)")) fail(`${label} is missing clip:rect(0,0,0,0)`);
  if (!html.includes(route.heading) || !html.includes(route.summary)) fail(`${label} is missing crawler text`);
  if (!rootInner(html)) fail(`${label} has an empty #root`);
  if (titles.has(route.title)) fail(`${label} title is duplicated`);
  if (descriptions.has(route.description)) fail(`${label} description is duplicated`);
  titles.add(route.title);
  descriptions.add(route.description);
  if (route.path !== "/" && home) {
    if (html.includes(`<title>${home.title}</title>`)) fail(`${label} reuses the homepage title`);
    if (html.includes(home.summary)) fail(`${label} reuses the homepage summary`);
  }
}

if (!fs.existsSync(path.join(dist, "sitemap.xml"))) fail("dist/sitemap.xml is missing");
if (!fs.existsSync(path.join(dist, "seo-routes.json"))) fail("dist/seo-routes.json is missing");

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Prerender QA passed for ${titles.size} public pages`);
