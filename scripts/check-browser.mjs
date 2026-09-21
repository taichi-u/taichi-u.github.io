import { resolve } from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
try {
  const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
  const output = resolve("artifacts");
  await mkdir(output, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [],
    badResponses = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) badResponses.push(r.url() + " " + r.status());
  });
  const checks = [];
  async function overflow(label) {
    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    assert(!overflowing, label + " overflows horizontally");
    checks.push(label + " / no horizontal overflow");
  }
  for (const lang of ["en", "ja"]) {
    const home = lang === "en" ? "index.html" : "index-ja.html";
    await page.goto(base + "/" + home);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: output + "/desktop-" + lang + ".png",
      fullPage: false,
    });
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".project-card").count(), 8);
    for (const [category, count] of [
      ["space", 4],
      ["robotics", 3],
      ["software", 2],
      ["life", 2],
      ["all", 8],
    ]) {
      await page.locator('[data-filter="' + category + '"]').click();
      assert.equal(await page.locator(".project-card:visible").count(), count);
      assert.equal(
        await page
          .locator('[data-filter="' + category + '"]')
          .getAttribute("aria-pressed"),
        "true",
      );
    }
    checks.push(lang + " / all project filters");
    await page
      .locator('.project-card a[data-project="mission-design"]')
      .click();
    assert(
      await page.locator("#project-mission-design").evaluate((d) => d.open),
    );
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "dialog-close",
    );
    await page.keyboard.press("Shift+Tab");
    assert(
      await page.evaluate(() =>
        document.querySelector("dialog[open]").contains(document.activeElement),
      ),
    );
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.body.classList.contains("modal-open"),
    );
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.equal(
      await page.evaluate(() => document.activeElement.dataset.project),
      "mission-design",
    );
    assert(
      !(await page
        .locator("body")
        .evaluate((b) => b.classList.contains("modal-open"))),
    );
    checks.push(lang + " / dialog focus trap, Escape, focus restoration");
    await page.locator(".copy-email").click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      "uchida.taichi.84f@st.kyoto-u.ac.jp",
    );
    await page.locator(".motion-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-motion"), "off");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-motion"), "off");
    await page.locator(".motion-toggle").click();
    checks.push(lang + " / clipboard and saved motion preference");
    await page.goto(base + "/" + home + "#research");
    await page.locator("[data-language]").click();
    await page.waitForURL("**#research");
    assert(page.url().includes(lang === "ja" ? "index.html" : "index-ja.html"));
    checks.push(lang + " / language switch keeps section");
    await page.goto(base + "/" + (lang === "ja" ? "cv-ja.html" : "cv.html"));
    const pdfName = "cv_taichiuchida" + (lang === "ja" ? "-ja" : "") + ".pdf";
    assert.equal(
      await page.locator(".print-button").getAttribute("href"),
      pdfName,
    );
    assert.equal(
      await page.locator(".print-button").getAttribute("target"),
      "_blank",
    );
    const downloadEvent = page.waitForEvent("download");
    await page.locator(".cv-actions a[download]").click();
    const download = await downloadEvent;
    assert.equal(download.suggestedFilename(), pdfName);
    assert.equal(await download.failure(), null);
    const pdfResponse = await context.request.get(base + "/" + pdfName);
    assert.equal(pdfResponse.status(), 200);
    assert(pdfResponse.headers()["content-type"].includes("application/pdf"));
    assert((await pdfResponse.body()).subarray(0, 5).toString() === "%PDF-");
    checks.push(lang + " / CV download and print use the typeset PDF");
    await page.goto(base + "/" + home + "#beyond");
    await page.locator(".event-feature").scrollIntoViewIfNeeded();
    for (const photo of await page.locator(".event-feature img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await photo.evaluate((image) => image.decode());
      assert(await photo.evaluate((image) => image.naturalWidth === 1500));
    }
    checks.push(lang + " / hackathon participation and two photographs");
    await page.goto(
      base + "/" + (lang === "ja" ? "archive-ja.html" : "archive.html"),
    );
    assert.equal(await page.locator(".archive-entry").count(), 81);
    await page.locator('[data-archive-filter="sport"]').click();
    assert.equal(await page.locator(".archive-entry:visible").count(), 14);
    await page.locator("#archive-search").fill("ISSO");
    assert.equal(await page.locator(".archive-entry:visible").count(), 2);
    await page.locator("#archive-search").fill("zzzzzz");
    assert(await page.locator("#archive-empty").isVisible());
    await page.locator("[data-reset-search]").click();
    assert.equal(await page.locator(".archive-entry:visible").count(), 81);
    await page.locator(".archive-entry summary").first().click();
    assert(
      await page
        .locator(".archive-entry")
        .first()
        .evaluate((d) => d.open),
    );
    checks.push(
      lang + " / archive search, categories, empty state, reset and disclosure",
    );
    await page.screenshot({ path: output + "/archive-" + lang + ".png" });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/" + home);
      await page.waitForLoadState("networkidle");
      await overflow(lang + " homepage " + width);
      if (width === 390) {
        await page.screenshot({
          path: output + "/mobile-" + lang + ".png",
          fullPage: true,
        });
        await page.locator(".menu-toggle").click();
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "true",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "false",
        );
        await page.locator(".menu-toggle").click();
        await page.locator('nav [data-section="research"]').click();
        assert.equal(
          await page.locator(".menu-toggle").getAttribute("aria-expanded"),
          "false",
        );
        await page.locator(".project-card a[data-project]").first().click();
        assert.equal(await page.locator("dialog[open]").count(), 1);
        await page.screenshot({
          path: output + "/mobile-dialog-" + lang + ".png",
        });
        await page.locator("dialog[open] .dialog-close").click();
        checks.push(lang + " / mobile menu and modal");
      }
      for (const route of [
        lang === "ja" ? "archive-ja.html" : "archive.html",
        lang === "ja" ? "cv-ja.html" : "cv.html",
        lang === "ja"
          ? "research/mission-design-ja.html"
          : "research/mission-design.html",
      ]) {
        await page.goto(base + "/" + route);
        await overflow(lang + " " + route + " " + width);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await nojs.newPage();
  await fallback.goto(base + "/index-ja.html");
  assert.equal(await fallback.locator(".project-card").count(), 8);
  await fallback.locator(".project-card a[data-project]").first().click();
  assert(fallback.url().endsWith("mission-design-ja.html"));
  assert((await fallback.locator("h1").innerText()).includes("外惑星"));
  await fallback.goto(base + "/archive-ja.html");
  await fallback.locator(".archive-entry summary").first().click();
  assert(
    await fallback
      .locator(".archive-entry")
      .first()
      .evaluate((d) => d.open),
  );
  checks.push(
    "No JavaScript / complete content, project URLs, native disclosures",
  );
  const reduced = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base + "/index-ja.html");
  assert.equal(
    await reducedPage
      .locator(".orbit-satellite")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(
    await reducedPage
      .locator("html")
      .evaluate((e) => getComputedStyle(e).scrollBehavior),
    "auto",
  );
  checks.push("Reduced motion / no animations or smooth scroll");
  assert.deepEqual(errors, []);
  assert.deepEqual(badResponses, []);
  await writeFile(
    output + "/browser-checks.json",
    JSON.stringify({ checks, errors, badResponses }, null, 2),
  );
  console.log(
    JSON.stringify(
      { passed: checks.length, errors, badResponses, checks },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
