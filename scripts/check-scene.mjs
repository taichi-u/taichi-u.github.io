import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
const output = "artifacts/3d";
await mkdir(output, { recursive: true });
const checks = [];
const manifest = JSON.parse(await readFile("assets/scene-build.json", "utf8"));
for (const [path, expected] of Object.entries(manifest.sources))
  assert.equal(createHash("sha256").update(await readFile(path)).digest("hex"), expected, `${path}: run build:scene to refresh the bundle`);
assert.equal(createHash("sha256").update(await readFile(manifest.output.path)).digest("hex"), manifest.output.sha256);
assert(manifest.output.bytes < 700000, "3D JavaScript bundle exceeds transfer budget");
checks.push("Generated bundle matches its source modules and stays below 700KB");
for (const name of ["satellite", "planet", "robot"]) {
  const buffer = await readFile(`assets/models/${name}.glb`);
  const packed = await readFile(`assets/models/${name}.glb.gz`);
  assert(gunzipSync(packed).equals(buffer), `${name}: packed model must match the editable export exactly`);
  assert(packed.length < buffer.length, `${name}: packing must reduce transfer size`);
  assert.equal(buffer.toString("utf8", 0, 4), "glTF");
  assert.equal(buffer.readUInt32LE(4), 2);
  assert.equal(buffer.readUInt32LE(8), buffer.length);
  const json = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
  assert(json.meshes.length > 0);
  assert((json.images || []).every(image => image.bufferView !== undefined && !image.uri), "Textures must be embedded in the GLB");
  assert(json.buffers.every(buffer => !buffer.uri), "GLB must be self contained");
  assert(buffer.length < 2_000_000, `${name} exceeds the detailed model transfer budget`);
  checks.push(`${name}: valid self-contained GLB, ${buffer.length} bytes`);
}
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ["--enable-unsafe-swiftshader"],
});
const errors = [];
let expectedNetworkAbort = false;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && !(expectedNetworkAbort && message.text().includes("net::ERR_FAILED"))) errors.push(message.text());
  });
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  const waitModel = async name => {
    await page.waitForFunction(name => document.querySelector("[data-scene]")?.dataset.model === name, name);
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".scene-canvas")).opacity === "1");
  };
  for (const lang of ["ja", "en"]) {
    await page.goto(`${base}/${lang === "ja" ? "index-ja.html" : "index.html"}`);
    await waitModel("satellite");
    for (const name of ["satellite", "planet", "robot"]) {
      await page.locator(`button[data-model="${name}"]`).click();
      await waitModel(name);
      assert.equal(await page.locator(`button[data-model="${name}"]`).getAttribute("aria-pressed"), "true");
      // Pause while capturing a stable, reviewable view of each asset.
      if (await page.locator("html").getAttribute("data-motion") !== "off") await page.locator(".scene-motion-button").click();
      await page.screenshot({ path: `${output}/${lang}-${name}.png` });
    }
    checks.push(`${lang}: all three GLBs render and selection buttons synchronize`);
  }
  const canvas = page.locator(".scene-canvas");
  const pausedA = await canvas.screenshot();
  await page.waitForTimeout(450);
  assert(pausedA.equals(await canvas.screenshot()), "Paused background must remain still");
  await page.locator(".scene-motion-button").click();
  await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "true");
  const movingA = await canvas.screenshot();
  await page.waitForTimeout(650);
  assert(!movingA.equals(await canvas.screenshot()), "Rotating background pixels must change");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "false");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector("[data-scene]").dataset.animating === "true");
  await page.locator(".scene-motion-button").click();
  await page.reload();
  await waitModel("satellite");
  assert.equal(await page.locator(".scene-motion-button").getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator(".motion-toggle").getAttribute("aria-pressed"), "true");
  checks.push("Pixel-verified rotation/pause, offscreen suspension, persistent shared motion setting");

  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/index-ja.html`);
    await waitModel("satellite");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
    await page.locator(".scene-controls").scrollIntoViewIfNeeded();
    for (const choice of await page.locator(".scene-controls button").all()) {
      const bounds = await choice.boundingBox();
      assert(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width, `Clipped controls at ${width}px`);
    }
    await page.screenshot({ path: `${output}/mobile-${width}.png` });
  }
  checks.push("320 / 390 / 768 / 1024px: no overflow or clipped model controls");

  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${base}/index-ja.html`);
  await reducedPage.locator("[data-scene].is-ready").waitFor();
  assert.equal(await reducedPage.locator("[data-scene]").getAttribute("data-animating"), "false");
  assert(await reducedPage.locator(".scene-motion-button").isDisabled());
  await reduced.close();
  checks.push("Reduced motion: static 3D model with animation disabled");

  const noGL = await browser.newContext();
  await noGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl") ? null : original.call(this, type, ...args);
    };
  });
  const fallback = await noGL.newPage();
  await fallback.goto(`${base}/index-ja.html`);
  await fallback.waitForLoadState("networkidle");
  assert(await fallback.locator(".planet").isVisible());
  assert(await fallback.locator(".scene-controls").isHidden());
  await noGL.close();
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  await staticPage.goto(`${base}/index-ja.html`);
  assert(await staticPage.locator(".planet").isVisible());
  assert.equal(await staticPage.locator(".project-card").count(), 8);
  await noJS.close();
  checks.push("WebGL unavailable / JavaScript disabled: fallback and page content remain usable");

  // A failed later asset leaves the previous model visible and permits a retry.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/index-ja.html`);
  await waitModel("satellite");
  const planetRequest = /\/planet\.glb(?:\.gz)?$/;
  await page.route(planetRequest, route => route.abort());
  // Network failure is intentional; collect actual application exceptions only below.
  expectedNetworkAbort = true;
  await page.locator('button[data-model="planet"]').click();
  await page.waitForFunction(() => document.querySelector(".scene-controls").getAttribute("aria-busy") === "false");
  assert.equal(await page.locator("[data-scene]").getAttribute("data-model"), "satellite");
  await page.unroute(planetRequest);
  expectedNetworkAbort = false;
  await page.locator('button[data-model="planet"]').click();
  await waitModel("planet");
  checks.push("Failed model request preserves current model; retry succeeds");
  await page.locator('button[data-model="satellite"]').click();
  await waitModel("satellite");
  await page.evaluate(() => {
    window.sceneTestContext = document.querySelector("canvas").getContext("webgl2").getExtension("WEBGL_lose_context");
    window.sceneTestContext.loseContext();
  });
  await page.locator(".scene-controls").waitFor({ state: "hidden" });
  assert(await page.locator(".planet").isVisible());
  await page.evaluate(() => window.sceneTestContext.restoreContext());
  await page.locator("[data-scene].is-ready").waitFor();
  assert(await page.locator(".scene-controls").isVisible());
  checks.push("Lost WebGL context: fallback appears; model and environment restore");
  const legacyContext = await browser.newContext();
  await legacyContext.addInitScript(() => { window.DecompressionStream = undefined; });
  const legacy = await legacyContext.newPage();
  const legacyModels = [];
  legacy.on("request", request => { if (/\.glb(?:\.gz)?$/.test(request.url())) legacyModels.push(request.url()); });
  await legacy.goto(`${base}/index-ja.html`);
  await legacy.locator("[data-scene].is-ready").waitFor();
  assert(legacyModels.some(url => url.endsWith("satellite.glb")));
  assert(!legacyModels.some(url => url.endsWith(".gz")));
  await legacyContext.close();
  checks.push("Without DecompressionStream: conventional GLB fallback renders");

  const deferredContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const deferred = await deferredContext.newPage();
  const deferredCDP = await deferredContext.newCDPSession(deferred);
  await deferredCDP.send("Network.enable");
  const sceneRequests = [];
  deferredCDP.on("Network.requestWillBeSent", ({ request }) => {
    if (/scene(?:\.min)?\.js|vendor\/three|models\/.*\.glb/.test(request.url)) sceneRequests.push(request.url);
  });
  await deferred.goto(`${base}/index-ja.html#contact`);
  await deferred.waitForLoadState("networkidle");
  assert.deepEqual(sceneRequests, [], "Deep link must not initialize or download an offscreen 3D scene");
  await deferred.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await deferred.locator("[data-scene].is-ready").waitFor();
  assert(sceneRequests.some(url => url.endsWith("scene.min.js")));
  assert(sceneRequests.some(url => url.endsWith("satellite.glb.gz")));
  assert(!sceneRequests.some(url => /planet|robot/.test(url)), "Unselected models must not be fetched");
  await deferredContext.close();
  checks.push("CDP: lower-section deep link defers all 3D requests; scrolling near hero loads only selected model");
  assert.deepEqual(errors, []);
  checks.push("No unexpected browser errors or HTTP failures");
  await writeFile(`${output}/checks.json`, JSON.stringify(checks, null, 2));
  console.log(checks.join("\n"));
} finally {
  await browser.close();
}
