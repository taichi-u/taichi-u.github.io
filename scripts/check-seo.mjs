import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

// Check generated files by default, or the deployed responses with SEO_BASE_URL.
const origin = "https://taichi-u.github.io/";
const base = process.env.SEO_BASE_URL;
async function read(path) {
  if (!base) return readFile(path || "index.html", "utf8");
  const response = await fetch(new URL(path, base.endsWith("/") ? base : `${base}/`));
  assert.equal(response.status, 200, `${path}: HTTP status`);
  assert(!/noindex/i.test(response.headers.get("x-robots-tag") || ""), `${path}: indexing blocked`);
  return response.text();
}
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(m => attributes(m[0]));
const decode = (text) => text.replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[entity]);
const sitemap = await read("sitemap.xml");
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => ({
  url: m[1].match(/<loc>([^<]+)<\/loc>/)[1],
  images: [...m[1].matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(m => m[1]),
}));
assert.equal(entries.length, 24, "24 canonical pages in sitemap");
assert.equal(new Set(entries.map(e => e.url)).size, 24, "no duplicate sitemap URLs");
const pages = new Map(await Promise.all(entries.map(async ({ url }) => {
  assert(url.startsWith(origin) && !url.endsWith("/index.html"), `${url}: canonical sitemap URL`);
  const path = new URL(url).pathname.slice(1);
  const html = await read(path);
  const links = tags(html, "link");
  const meta = tags(html, "meta");
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || "");
  const lang = html.match(/<html lang="([^"]+)"/)?.[1];
  const description = decode(meta.find(m => m.name === "description")?.content || "");
  assert(title.length > 8 && description.length > 20, `${path}: descriptive title and description`);
  assert(title.includes(lang === "ja" ? "内田 大智" : "Taichi Uchida"), `${path}: localized name in title`);
  assert.deepEqual(links.filter(l => l.rel === "canonical").map(l => l.href), [url], `${path}: canonical`);
  assert.equal(meta.find(m => m.property === "og:url")?.content, url, `${path}: social URL agrees with canonical`);
  assert(!meta.some(m => m.name === "robots" && /noindex/i.test(m.content)), `${path}: indexable`);
  const alternates = Object.fromEntries(links.filter(l => l.hreflang).map(l => [l.hreflang, l.href]));
  assert.deepEqual(Object.keys(alternates).sort(), ["en", "ja", "x-default"], `${path}: languages`);
  assert.equal(alternates[lang], url, `${path}: self-referencing hreflang`);
  assert.equal(alternates["x-default"], alternates.en, `${path}: default language`);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, `${path}: single structured graph`);
  const schema = JSON.parse(scripts[0][1]);
  assert.equal(schema["@context"], "https://schema.org");
  const graph = schema["@graph"];
  const page = graph.find(node => node["@id"] === `${url}#webpage`);
  const person = graph.find(node => node["@type"] === "Person");
  const site = graph.find(node => node["@type"] === "WebSite");
  assert.equal(page?.url, url);
  assert.equal(page.name, title);
  assert.equal(page.description, description);
  assert.equal(page.inLanguage, lang);
  assert.equal(person?.["@id"], `${origin}#person`);
  assert.equal(site?.url, origin);
  const isProfile = !path || /^(index-ja|cv|cv-ja)\.html$/.test(path);
  if (isProfile) {
    assert.equal(page["@type"], "ProfilePage");
    assert.equal(page.mainEntity?.["@id"], person["@id"]);
  }
  if (!path || path === "index-ja.html") {
    assert(meta.some(m => m.name === "google-site-verification" && m.content.length > 20), `${path}: ownership token`);
    assert(/Kyoto University|京都大学/.test(title), `${path}: homepage affiliation`);
  }
  for (const link of tags(html, "a")) {
    if (!link.href || /^(mailto:|https?:)/.test(link.href)) continue;
    assert.notEqual(new URL(link.href, url).pathname, "/index.html", `${path}: avoid linking homepage alias`);
  }
  return [url, { html, lang, title, description, alternates }];
})));
assert.equal(new Set([...pages.values()].map(p => p.title)).size, pages.size, "unique page titles");
assert.equal(new Set([...pages.values()].map(p => p.description)).size, pages.size, "unique page descriptions");
let imageCount = 0;
for (const { url, images } of entries) {
  const page = pages.get(url);
  for (const language of ["en", "ja"]) {
    const alternate = pages.get(page.alternates[language]);
    assert.equal(alternate?.lang, language, `${url}: alternate exists in correct language`);
    assert.deepEqual(alternate.alternates, page.alternates, `${url}: reciprocal hreflang`);
  }
  if (/\/gallery(?:-ja)?\.html$/.test(url)) {
    const photoUrls = tags(page.html, "a").filter(a => a.class === "gallery-photo").map(a => new URL(a.href, url).href);
    assert(photoUrls.length > 0);
    assert.deepEqual(images, photoUrls, `${url}: all gallery images discoverable in sitemap`);
    for (const image of images) {
      assert(image.startsWith(origin));
      if (base) {
        const response = await fetch(new URL(new URL(image).pathname, base), { method: "HEAD" });
        assert.equal(response.status, 200, `${image}: accessible image`);
        assert(response.headers.get("content-type")?.startsWith("image/"));
      } else assert((await stat(new URL(image).pathname.slice(1))).isFile());
      imageCount++;
    }
  } else assert.equal(images.length, 0);
}
const robots = await read("robots.txt");
assert(robots.includes(`Sitemap: ${origin}sitemap.xml`));
assert(!/^Disallow:\s*\/\s*$/m.test(robots));
// The old bookmarked URL remains accessible but points crawlers to the root.
assert(tags(await read("index.html"), "link").some(l => l.rel === "canonical" && l.href === origin));
console.log(`PASS SEO (${base || "generated files"}): ${pages.size} pages, reciprocal language links, unique metadata, structured data, verification tag, ${imageCount} gallery image entries, robots and homepage alias.`);
