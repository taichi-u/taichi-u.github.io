// Chrome DevTools Protocol regression checks. See README for runtime options.
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { galleryImages } from "../content/gallery-images.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
const output = process.env.CDP_OUTPUT || "artifacts/cdp-checks";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const results = [];
try {
  const sitemap = await readFile("sitemap.xml", "utf8");
  const paths = [...sitemap.matchAll(/<loc>https:\/\/taichi-u.github.io\/(.*?)<\/loc>/g)]
    .map((match) => match[1] || "index.html");
  for (const path of paths) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const errors = [], issues = [], failures = [];
    await Promise.all(["Runtime.enable", "Log.enable", "Network.enable", "Audits.enable", "Performance.enable"].map((method) => cdp.send(method)));
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    cdp.on("Runtime.exceptionThrown", (event) => errors.push(event.exceptionDetails));
    cdp.on("Log.entryAdded", ({ entry }) => { if (["error", "warning"].includes(entry.level)) errors.push(entry); });
    cdp.on("Audits.issueAdded", ({ issue }) => issues.push(issue));
    cdp.on("Network.loadingFailed", (event) => { if (!event.canceled) failures.push(event); });
    cdp.on("Network.responseReceived", ({ response }) => { if (response.status >= 400) failures.push({ url: response.url, status: response.status }); });
    await page.goto(`${base}/${path}`, { waitUntil: "networkidle" });
    assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${path}: horizontal overflow`);
    if (path.startsWith("archive")) {
      await page.locator(".archive-entry").filter({ hasText: "Codex" }).locator("summary").click();
    }
    for (const photo of await page.locator("img:visible").all()) {
      await photo.scrollIntoViewIfNeeded();
      await photo.evaluate((image) => image.decode());
      assert(await photo.evaluate((image) => image.naturalWidth > 0), `${path}: broken image`);
    }
    const eventPhotos = await page.locator(".event-photos img").evaluateAll((photos) => photos.map((image) => ({
      url: image.currentSrc,
      bytes: performance.getEntriesByName(image.currentSrc).at(-1)?.encodedBodySize || 0,
      width: image.getBoundingClientRect().width,
    })));
    for (const photo of eventPhotos) {
      assert(/-(640|960)\.webp$/.test(photo.url), `${path}: unnecessarily large mobile event photo: ${photo.url}`);
      assert(photo.bytes > 0 && photo.bytes < 70000, `${path}: mobile event photo exceeds transfer budget`);
    }
    assert.deepEqual(errors, [], `${path}: console or runtime errors`);
    assert.deepEqual(failures, [], `${path}: network failures`);
    assert.deepEqual(issues, [], `${path}: DevTools Issues`);
    results.push({ path, errors, failures, issues, eventPhotos, metrics: (await cdp.send("Performance.getMetrics")).metrics });
    await page.screenshot({ path: `${output}/${path.replaceAll("/", "-")}.png` });
    await context.close();
    console.log(`PASS CDP: ${path}`);
  }
  // Inspect only the initial gallery viewport before scrolling or opening a photo.
  for (const profile of [
    { width: 390, height: 844, dpr: 2, imageBudget: 250000 },
    { width: 1440, height: 1000, dpr: 1, imageBudget: 300000 },
  ]) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: profile.dpr });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    try {
      await page.goto(`${base}/gallery-ja.html`, { waitUntil: "networkidle" });
      const initial = await page.locator(".gallery-card img").evaluateAll(images => images.map(image => ({
        id: image.closest("figure").id,
        url: image.currentSrc,
        loading: image.loading,
        bytes: performance.getEntriesByName(image.currentSrc).at(-1)?.encodedBodySize || 0,
      })));
      const loaded = initial.filter(image => image.bytes > 0);
      assert(loaded.length > 0 && loaded.length < initial.length, "offscreen gallery photos must stay deferred");
      assert.equal(initial[0].loading, "eager", "the leading photo must not be lazy-loaded");
      assert.equal(await page.locator(".gallery-card img").first().getAttribute("fetchpriority"), "high");
      assert(initial.slice(1).every(image => image.loading === "lazy"));
      for (const image of loaded) {
        const candidate = galleryImages[image.id].find(candidate => new URL(candidate.src, base + "/").href === image.url);
        assert(candidate, `unknown gallery image candidate: ${image.url}`);
        assert(candidate.width <= (profile.dpr === 1 ? 400 : 800), `oversized gallery image at ${profile.width}px: ${image.url}`);
      }
      const bytes = loaded.reduce((sum, image) => sum + image.bytes, 0);
      assert(bytes < profile.imageBudget, `initial gallery image transfer budget exceeded at ${profile.width}px: ${bytes}`);
      const firstPhoto = page.locator(".gallery-card a").first();
      const originalURL = new URL(await firstPhoto.getAttribute("href"), base + "/").href;
      assert.equal(await page.evaluate(url => performance.getEntriesByName(url).length, originalURL), 0, "full-size lead photo fetched before opening");
      await firstPhoto.click();
      await page.locator(".gallery-dialog-image img").evaluate(image => image.decode());
      assert.equal(await page.locator(".gallery-dialog-image img").evaluate(image => image.currentSrc), originalURL);
      assert(await page.evaluate(url => performance.getEntriesByName(url).some(entry => entry.encodedBodySize > 0), originalURL));
      results.push({ check: "responsive gallery images, deferred requests and full-size viewer", profile, bytes, loaded: loaded.length, images: initial });
      console.log(`PASS CDP: gallery at ${profile.width}px / DPR ${profile.dpr}: ${bytes} initial image bytes; full-size image loads on demand`);
    } finally { await context.close(); }
  }
  // Delay the real script until after first paint. Enabling search must not move content.
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    let releaseScript;
    const gate = new Promise((resolve) => { releaseScript = resolve; });
    await page.route("**/script.js", async (route) => { await gate; await route.continue(); });
    try {
      await page.goto(`${base}/archive-ja.html`, { waitUntil: "commit" });
      await page.locator("#archive-count").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      const before = await page.locator("#archive-count").boundingBox();
      assert(await page.locator(".archive-controls").isHidden());
      releaseScript();
      await page.waitForLoadState("networkidle");
      const after = await page.locator("#archive-count").boundingBox();
      assert(Math.abs(before.y - after.y) < 1, `archive controls shift content at ${width}px: ${before.y} -> ${after.y}`);
      await page.locator("#archive-search").fill("WalkIsFun");
      assert.equal(await page.locator(".archive-entry:visible").count(), 1);
      results.push({ check: "archive controls reserve space before script loads", width, beforeY: before.y, afterY: after.y });
      console.log(`PASS CDP: delayed script keeps archive layout stable at ${width}px`);
    } finally { releaseScript(); await context.close(); }
  }
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    let releaseScript;
    const gate = new Promise(resolve => { releaseScript = resolve; });
    await page.route("**/script.js", async route => { await gate; await route.continue(); });
    try {
      await page.goto(`${base}/gallery-ja.html`, { waitUntil: "commit" });
      await page.locator("#gallery-count").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      const before = await page.locator(".photo-gallery").boundingBox();
      const countBefore = await page.locator("#gallery-count").boundingBox();
      assert(await page.locator(".gallery-filters").isHidden());
      releaseScript();
      await page.waitForLoadState("networkidle");
      const after = await page.locator(".photo-gallery").boundingBox();
      const countAfter = await page.locator("#gallery-count").boundingBox();
      assert(Math.abs(before.y - after.y) < 1, `gallery moves when filters initialize at ${width}px`);
      assert(Math.abs(countBefore.x - countAfter.x) < 1 && Math.abs(countBefore.y - countAfter.y) < 1, `gallery count moves when filters initialize at ${width}px`);
      await page.locator('[data-gallery-filter="research"]').click();
      assert.equal(await page.locator(".gallery-card:visible").count(), 4);
      results.push({ check: "gallery filters reserve space before script loads", width, beforeY: before.y, afterY: after.y, countBefore, countAfter });
      console.log(`PASS CDP: delayed script keeps gallery layout stable at ${width}px`);
    } finally { releaseScript(); await context.close(); }
  }
  console.log(`PASS: ${paths.length} pages via CDP; no errors, failed requests or DevTools Issues; mobile image budgets and delayed-script layout checks.`);
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
