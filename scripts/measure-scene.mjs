// Repeatable Chrome/CDP lab benchmark; the reported timing is not field CWV.
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { once } from "node:events";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
const label = process.env.MEASURE_LABEL || "sample";
const output = process.env.MEASURE_OUTPUT || "artifacts/scene-performance";
const samples = Number(process.env.MEASURE_SAMPLES || 3);
const network = { latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 };
const cpuSlowdown = 4;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ["--enable-unsafe-swiftshader"],
});
const results = [];
const hashes = {};
for (const path of ["scene.js", "script.js", "assets/models/satellite.glb", "assets/models/planet.glb", "assets/models/robot.glb"])
  hashes[path] = createHash("sha256").update(await readFile(path)).digest("hex");
try { hashes["scene.min.js"] = createHash("sha256").update(await readFile("scene.min.js")).digest("hex"); } catch (error) { if (error.code !== "ENOENT") throw error; }

async function metrics(cdp) {
  return Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value]));
}
async function interval(page, cdp, ms) {
  const before = await metrics(cdp);
  const glBefore = await page.evaluate(() => ({ ...window.sceneLab.gl }));
  await page.waitForTimeout(ms);
  const glAfter = await page.evaluate(() => ({ ...window.sceneLab.gl }));
  const after = await metrics(cdp);
  const seconds = after.Timestamp - before.Timestamp;
  return { seconds, mainThreadMs: (after.TaskDuration - before.TaskDuration) * 1000,
    scriptMs: (after.ScriptDuration - before.ScriptDuration) * 1000,
    layoutMs: (after.LayoutDuration - before.LayoutDuration) * 1000,
    frames: glAfter.frames - glBefore.frames,
    drawCalls: glAfter.draws - glBefore.draws,
    submittedTriangles: glAfter.triangles - glBefore.triangles,
    frameRate: (glAfter.frames - glBefore.frames) / seconds,
    jsHeapBytes: after.JSHeapUsedSize };
}

try {
  for (const profile of [
    { name: "mobile", width: 390, height: 844, dpr: 2 },
    { name: "desktop", width: 1440, height: 1000, dpr: 1 },
  ]) for (let sample = 0; sample < samples; sample++) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: profile.dpr, isMobile: profile.name === "mobile", hasTouch: profile.name === "mobile" });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const errors = [], issues = [], failures = [], requests = new Map();
    await Promise.all(["Network.enable", "Runtime.enable", "Log.enable", "Audits.enable", "Performance.enable"].map(method => cdp.send(method)));
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, ...network, connectionType: "cellular4g" });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuSlowdown });
    cdp.on("Runtime.exceptionThrown", event => errors.push(event.exceptionDetails));
    cdp.on("Log.entryAdded", ({ entry }) => { if (entry.level === "error") errors.push(entry); });
    cdp.on("Audits.issueAdded", ({ issue }) => issues.push(issue));
    cdp.on("Network.loadingFailed", event => { if (!event.canceled) failures.push(event); });
    cdp.on("Network.responseReceived", ({ requestId, response }) => {
      requests.set(requestId, { url: response.url, status: response.status, mimeType: response.mimeType });
      if (response.status >= 400) failures.push({ url: response.url, status: response.status });
    });
    cdp.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
      if (requests.has(requestId)) requests.get(requestId).wireBytes = encodedDataLength;
    });
    await page.addInitScript(() => {
      const lab = window.sceneLab = { lcp: 0, cls: 0, longTaskMs: 0, blockingMs: 0, longTasks: [], sceneReadyMs: 0,
        gl: { frames: 0, draws: 0, triangles: 0 } };
      for (const type of ["largest-contentful-paint", "layout-shift", "longtask"]) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (type === "largest-contentful-paint") { lab.lcp = entry.startTime; lab.lcpElement = entry.element?.tagName; }
            if (type === "layout-shift" && !entry.hadRecentInput) lab.cls += entry.value;
            if (type === "longtask") { lab.longTaskMs += entry.duration; lab.blockingMs += Math.max(0, entry.duration - 50); lab.longTasks.push({ start: entry.startTime, duration: entry.duration }); }
          }
        }).observe({ type, buffered: true });
      }
      new MutationObserver((_, observer) => {
        if (document.querySelector("[data-scene].is-ready")) { lab.sceneReadyMs = performance.now(); observer.disconnect(); }
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const gl = original.call(this, type, ...args);
        if (gl && type.startsWith("webgl") && this.classList.contains("scene-canvas") && !gl.sceneLabWrapped) {
          gl.sceneLabWrapped = true;
          const info = gl.getExtension("WEBGL_debug_renderer_info");
          lab.renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
          let target = null;
          const bind = gl.bindFramebuffer.bind(gl);
          gl.bindFramebuffer = (kind, value) => { if (kind === gl.FRAMEBUFFER || kind === gl.DRAW_FRAMEBUFFER) target = value; return bind(kind, value); };
          const clear = gl.clear.bind(gl);
          gl.clear = mask => { if (target === null && (mask & gl.COLOR_BUFFER_BIT)) lab.gl.frames++; return clear(mask); };
          for (const method of ["drawElements", "drawArrays"]) {
            const draw = gl[method].bind(gl);
            gl[method] = (...args) => { lab.gl.draws++; if (args[0] === gl.TRIANGLES) lab.gl.triangles += args[method === "drawElements" ? 1 : 2] / 3; return draw(...args); };
          }
        }
        return gl;
      };
    });
    await page.goto(`${base}/index-ja.html`, { waitUntil: "load", timeout: 60000 });
    await page.locator("[data-scene].is-ready").waitFor({ timeout: 60000 });
    await page.waitForLoadState("networkidle");
    const initial = await page.evaluate(() => ({ ...window.sceneLab,
      fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
      resources: performance.getEntriesByType("resource").map(e => ({ url: e.name, bytes: e.encodedBodySize, duration: e.duration, start: e.startTime })),
      canvas: { width: document.querySelector("canvas").width, height: document.querySelector("canvas").height },
    }));
    initial.totalBodyBytes = initial.resources.reduce((sum, e) => sum + e.bytes, 0);
    initial.sceneBodyBytes = initial.resources.filter(e => /scene(?:\.min)?\.js|vendor\/three|models\//.test(e.url)).reduce((sum, e) => sum + e.bytes, 0);
    await page.locator("[data-scene]").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "true");
    // Do not throttle network in the steady-state drawing sample; CPU stays 4x.
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    const trace = sample === 0 && profile.name === "desktop";
    if (trace) await cdp.send("Tracing.start", { categories: "devtools.timeline,blink.user_timing", transferMode: "ReturnAsStream" });
    const moving = await interval(page, cdp, 3000);
    if (trace) {
      const completed = once(cdp, "Tracing.tracingComplete");
      await cdp.send("Tracing.end");
      const [{ stream }] = await completed;
      let text = "", eof = false;
      while (!eof) { const result = await cdp.send("IO.read", { handle: stream }); text += result.data; eof = result.eof; }
      await cdp.send("IO.close", { handle: stream });
      await writeFile(`${output}/${label}-trace.json`, text);
    }
    await page.locator(".scene-motion-button").click();
    await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "false");
    const paused = await interval(page, cdp, 1000);
    if (sample === 0) await page.screenshot({ path: `${output}/${label}-${profile.name}.png` });
    await page.locator(".scene-motion-button").click();
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "false");
    const offscreen = await interval(page, cdp, 1000);
    results.push({ profile, sample, initial, moving, paused, offscreen, requests: [...requests.values()], errors, issues, failures });
    console.log(JSON.stringify({ label, profile: profile.name, sample, lcpMs: initial.lcp, readyMs: initial.sceneReadyMs,
      sceneBytes: initial.sceneBodyBytes, cls: initial.cls, movingMainThreadMs: moving.mainThreadMs, renderFps: moving.frameRate,
      drawCalls: moving.drawCalls, pausedDraws: paused.drawCalls, offscreenDraws: offscreen.drawCalls,
      errors: errors.length, failures: failures.length, issues: issues.length }));
    await context.close();
  }
} finally {
  await writeFile(`${output}/${label}.json`, JSON.stringify({ base, chrome: await browser.version(), samples, network, cpuSlowdown, hashes, results }, null, 2));
  await browser.close();
}
