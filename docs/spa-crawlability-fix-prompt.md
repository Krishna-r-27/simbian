# Universal prompt: SPA crawlability without a visible text flash

Paste this whole document to any coding agent, in any tool. Apply it to the current website. Do not assume a framework, host, or file name. Detect those from the project. Keep the existing architecture unless the user explicitly asks to replace it.

## Goal

People never see plain text before the designed page. That includes crawler copy, banner titles, file names, and image labels.

Tools that do not run JavaScript still receive a unique title, description, canonical URL, and real body text for every public URL. Those tools include curl, View Source, Bing, many AI crawlers, and link-preview fetches.

## Do not

- Do not migrate the site to Next.js, Nuxt, or another server-rendered framework unless the user explicitly asks.
- Do not rebuild a crawlability system that already exists. Keep its catalog, prerender, sitemap, shell, and server injection.
- Do not delete the crawler text to stop a flash.
- Do not put the crawler text only inside `<noscript>`.
- Do not hide it only with `display:none`.
- Do not hide it only in the app stylesheet, Tailwind, or a file that arrives with JavaScript.
- Do not treat the flash as a React `useEffect`, animation, slider, or mobile-width bug when the words match the crawler HTML or an image label.
- Do not serve the homepage document as the fallback for other URLs.
- Do not insert a local or placeholder banner unless the user explicitly asks for one.
- Do not use an internal title, file name, or CMS label as visible text while an image downloads.

## 1. Discover

Find the frontend, the host, the public routes, and what the server returns for an unknown URL. Read the first HTML response with JavaScript disabled. A normal browser session is not enough.

If crawlability is already present, preserve it and add only the missing rules below.

## 2. Crawlability, when it is missing

Ship these in the same change as the hide rule. Visible crawler HTML is a failed result.

1. One catalog of public routes. Each route has path, title, description, keywords, canonical, whether it is prerendered, whether it belongs in the sitemap, a heading, and a short summary of that page only. Include `/`. Generate the sitemap from this catalog.
2. For each static marketing route, write an HTML file that contains that route's meta tags and a crawler summary. The homepage file is the site's `index.html`. Other routes are `/{path}/index.html`, or the host's equivalent.
3. Keep a separate empty app shell for admin, unknown app routes, and server injection. Its app mount node is empty.
4. A known marketing URL serves its own HTML file. A known URL with no file starts from the empty shell and injects that URL's meta tags and crawler summary. An unknown URL returns 404 with not-found meta, not the homepage at HTTP 200.
5. Dynamic pages, such as a blog or CMS, load their data on the server, start from the empty shell, inject unique meta and crawler HTML, and return 404 for a missing record.

Use whatever mount id the app already uses. `#root` and `#seo-content` are fine names when the app does not already have others.

## 3. Hide crawler text before the first paint

Put this in `<head>` of the source shell, every prerendered page, the empty shell, and every server-injected document:

```html
<style id="seo-content-hide">#seo-content{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}img{color:transparent;font-size:0}</style>
```

Put the same clip on the crawler element:

```html
<main id="seo-content" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
```

If the project uses different ids, keep those ids and point the style at them. The words stay in the HTML. The browser does not paint them. `aria-hidden="true"` stops assistive technology from reading the summary and then the real page.

The empty shell includes the style and does not include the crawler block.

## 4. Images and the first banner

After the app starts, the browser will print an image's `alt` text while the file is still downloading. That is the second flash. The text is often a banner title or a file name.

- Do not lazy-load the logo or the first visible hero image. Use `loading="eager"` and `fetchpriority="high"` on those.
- A decorative hero uses `alt=""`. Do not put a CMS title or file name in `alt`.
- The `img` rule in the `<style>` block above must be in the HTML document, not only in the bundled CSS. Also set `style="color:transparent;font-size:0"` on images that can appear before their file arrives. Screen readers still receive the `alt` attribute.
- Do not insert the hero `<img>` until the file that will be shown has finished loading.
- Request only the image the current viewport needs, and prefer the smaller modern format. Do not wait for every breakpoint and every fallback format before showing the first banner.
- Do not download or display a bundled local banner unless the user explicitly asks for that placeholder.
- An empty hero area of the correct height is acceptable while that one real file downloads. Plain text in that area is not.

## 5. Prove it

Fail the build when a public HTML file is missing its crawler text or missing the hide rule. The empty shell must keep an empty mount node, must not contain the crawler block, and must still contain the hide rule.

Fetch each public URL without JavaScript. Pass only when:

- Title, description, and canonical are unique
- The canonical matches the request path
- Body text is present
- The hide rule is present in that same response
- An inner page does not reuse the homepage title or homepage body

Then load a public page with JavaScript blocked or the cache disabled. The crawler sentences are in View Source and are not visible. With images blocked or delayed, banner titles and file names are not visible. A fast cached refresh is not proof.

A check against the live site passes only after this build is what the live site serves.

## Done when

Crawlers still receive the text. Visitors see the existing designed page, with no plain-text frame before it, and the first real banner is the one that loads. Report what changed, and a pass or fail per URL for title, description, canonical, body text, and the hide rule.
