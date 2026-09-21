// Repeatable CDP lab samples, not field Core Web Vitals.
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
const label = process.env.MEASURE_LABEL || "sample";
const output = process.env.MEASURE_OUTPUT || "artifacts/gallery-performance";
const samples = Number(process.env.MEASURE_SAMPLES || 3);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const results = [];
try {
  for (const profile of [
    { name: "mobile", width: 390, height: 844, dpr: 2 },
    { name: "desktop", width: 1440, height: 1000, dpr: 1 },
  ]) {
    for (let sample = 0; sample < samples; sample++) {
      const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: profile.dpr, isMobile: profile.name === "mobile", hasTouch: profile.name === "mobile" });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      const errors = [], issues = [], failures = [];
      await Promise.all(["Network.enable", "Runtime.enable", "Log.enable", "Audits.enable"].map(method => cdp.send(method)));
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000, connectionType: "cellular4g" });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      cdp.on("Runtime.exceptionThrown", event => errors.push(event.exceptionDetails));
      cdp.on("Log.entryAdded", ({ entry }) => { if (["error", "warning"].includes(entry.level)) errors.push(entry); });
      cdp.on("Audits.issueAdded", ({ issue }) => issues.push(issue));
      cdp.on("Network.loadingFailed", event => { if (!event.canceled) failures.push(event); });
      cdp.on("Network.responseReceived", ({ response }) => { if (response.status >= 400) failures.push({ url: response.url, status: response.status }); });
      await page.addInitScript(() => {
        window.lab = { lcp: 0, lcpElement: "", cls: 0, shifts: [], longTasks: 0 };
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            window.lab.lcp = entry.startTime;
            window.lab.lcpElement = entry.element?.outerHTML.slice(0, 300) || "";
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
            window.lab.cls += entry.value;
            window.lab.shifts.push({ time: entry.startTime, value: entry.value, sources: entry.sources.map(source => ({ element: source.node?.outerHTML.slice(0, 150), previous: source.previousRect.toJSON(), current: source.currentRect.toJSON() })) });
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.lab.longTasks += entry.duration;
        }).observe({ type: "longtask", buffered: true });
      });
      await page.goto(base + "/gallery-ja.html", { waitUntil: "networkidle" });
      const initial = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        return {
          ...window.lab,
          fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
          images: [...document.querySelectorAll(".gallery-card img")].map(image => ({
            id: image.closest("figure").id,
            url: image.currentSrc || image.src,
            loading: image.loading,
            naturalWidth: image.naturalWidth,
            width: image.getBoundingClientRect().width,
            top: image.getBoundingClientRect().top,
            bytes: resources.find(resource => resource.name === (image.currentSrc || image.src))?.encodedBodySize || 0,
          })),
          totalBytes: resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        };
      });
      initial.imageBytes = initial.images.reduce((sum, image) => sum + image.bytes, 0);
      let fullImageBytes;
      if (sample === 0) {
        await page.screenshot({ path: `${output}/${label}-${profile.name}.png` });
        for (const image of await page.locator(".gallery-card img").all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(element => element.decode());
        }
        fullImageBytes = await page.evaluate(() => performance.getEntriesByType("resource").filter(entry => entry.initiatorType === "img").reduce((sum, entry) => sum + entry.encodedBodySize, 0));
      }
      results.push({ profile, sample, initial, fullImageBytes, errors, issues, failures });
      console.log(JSON.stringify({ profile: profile.name, sample, lcpMs: initial.lcp, cls: initial.cls, initialImageBytes: initial.imageBytes, loadedImages: initial.images.filter(image => image.bytes).length, fullImageBytes, errors: errors.length, issues: issues.length, failures: failures.length }));
      await context.close();
    }
  }
} finally {
  await writeFile(`${output}/${label}.json`, JSON.stringify({ base, samples, network: { latencyMs: 150, downloadBytesPerSecond: 200000, cpuSlowdown: 4 }, results }, null, 2));
  await browser.close();
}
