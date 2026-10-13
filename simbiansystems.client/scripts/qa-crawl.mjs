import { notFoundSeo, publicRoutes } from "../src/seo/publicRoutes.js";

const base = (process.env.CRAWL_BASE || "http://127.0.0.1:5198").replace(/\/$/, "");

function field(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'") : "";
}

function pathnameOf(url) {
  try {
    return new URL(url).pathname || "/";
  } catch {
    return "";
  }
}

async function fetchText(path) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  const body = await response.text();
  return { status: response.status, body, location: response.headers.get("location") || "" };
}

function inspect(path, html, status, expected) {
  const title = field(html, /<title>([\s\S]*?)<\/title>/i);
  const description = field(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const keywords = field(html, /<meta\s+name="keywords"\s+content="([^"]*)"/i);
  const canonical = field(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const hasHide = html.includes('id="seo-content-hide"') && html.includes("clip:rect(0,0,0,0)");
  const hasBody = html.includes('id="seo-content"') && /<h1>[\s\S]+<\/h1>/i.test(html);
  const rootMatch = html.match(/<div\s+id=["']root["']\s*>([\s\S]*?)<\/div>/i);
  const rootText = rootMatch ? rootMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  const home = publicRoutes.find((route) => route.path === "/");
  const canonicalPath = pathnameOf(canonical);
  const issues = [];
  if (status !== expected.status) issues.push(`status ${status} expected ${expected.status}`);
  if (expected.title && title !== expected.title) issues.push("title");
  if (expected.description && description !== expected.description) issues.push("description");
  if (canonicalPath !== path) issues.push(`canonical ${canonicalPath}`);
  if (!hasHide) issues.push("hide rule");
  if (!hasBody || rootText.length < 40) issues.push("body");
  if (path !== "/" && home && (title === home.title || html.includes(home.summary))) issues.push("homepage lookalike");
  return {
    path,
    status,
    title,
    description,
    keywords,
    canonical,
    body: hasBody ? "present" : "missing",
    hide: hasHide ? "present" : "missing",
    result: issues.length ? `FAIL ${issues.join(", ")}` : "PASS",
  };
}

const rows = [];
for (const route of publicRoutes) {
  const response = await fetchText(route.path);
  rows.push(inspect(route.path, response.body, response.status, {
    status: 200,
    title: route.title,
    description: route.description,
  }));
}

const missing = await fetchText("/this-page-does-not-exist");
rows.push(inspect("/this-page-does-not-exist", missing.body, missing.status, {
  status: 404,
  title: notFoundSeo.title,
  description: notFoundSeo.description,
}));

const categories = await fetch(`${base}/api/public/categories`).then(async (response) => {
  if (!response.ok) throw new Error(`categories ${response.status}`);
  return response.json();
});
const categoryList = categories.data || categories;
if (Array.isArray(categoryList) && categoryList.length) {
  const category = categoryList[0];
  const categoryPath = `/products/${category.slug}`;
  const categoryHtml = await fetchText(categoryPath);
  const categoryRow = inspect(categoryPath, categoryHtml.body, categoryHtml.status, { status: 200 });
  if (!categoryHtml.body.includes(category.name)) categoryRow.result = "FAIL category name missing";
  rows.push(categoryRow);

  const listing = await fetch(`${base}/api/public/category?categorySlug=${encodeURIComponent(category.slug)}&page=1&pageSize=1`).then((response) => response.json());
  const product = listing.data?.items?.[0] || listing.items?.[0];
  if (product) {
    const productPath = `/products/${product.categorySlug}/${product.slug}`;
    const productHtml = await fetchText(productPath);
    const productRow = inspect(productPath, productHtml.body, productHtml.status, { status: 200 });
    if (!productHtml.body.includes(product.name)) productRow.result = `FAIL product name missing (${productRow.result})`;
    rows.push(productRow);

    const wrong = await fetchText(`/products/not-the-category/${product.slug}`);
    rows.push({
      path: `/products/not-the-category/${product.slug}`,
      status: wrong.status,
      title: "",
      description: "",
      keywords: "",
      canonical: wrong.location,
      body: wrong.status === 301 || wrong.status === 308 ? "redirect" : "n/a",
      hide: "",
      result: wrong.status === 301 || wrong.status === 308 ? "PASS" : `FAIL expected redirect, got ${wrong.status}`,
    });
  }
}

const unknownCategory = await fetchText("/products/not-a-real-category");
rows.push(inspect("/products/not-a-real-category", unknownCategory.body, unknownCategory.status, {
  status: 404,
  title: notFoundSeo.title,
}));

const sitemap = await fetchText("/sitemap.xml");
const sitemapPass = sitemap.status === 200 && sitemap.body.includes("<loc>") && sitemap.body.includes("/about-us");
rows.push({
  path: "/sitemap.xml",
  status: sitemap.status,
  title: "",
  description: "",
  keywords: "",
  canonical: "",
  body: sitemapPass ? "xml" : "missing",
  hide: "n/a",
  result: sitemapPass ? "PASS" : "FAIL sitemap",
});

console.log(JSON.stringify(rows, null, 2));
const failed = rows.filter((row) => !row.result.startsWith("PASS"));
if (failed.length) {
  console.error(`\n${failed.length} URL(s) failed`);
  process.exit(1);
}
console.log(`\n${rows.length} URL checks passed`);
