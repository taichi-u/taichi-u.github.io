# CDP inspection — 21 September 2026

## Scope and method

Inspected the published revision `2cd70ee` with Chrome DevTools Protocol through Playwright's `newCDPSession`. The Runtime, Log, Network, Audits, and Performance domains captured exceptions, browser warnings, unsuccessful requests, DevTools Issues, and rendering work. All 22 English/Japanese pages were crawled. Lazy images were scrolled into view and decoded.

Initial performance samples disabled the HTTP cache and used a 150 ms simulated network latency, 200,000 bytes/s download throughput, and 4× CPU slowdown. The Japanese homepage was sampled three times at both desktop and mobile viewport sizes. Its median LCP was 1.452 s desktop and 1.272 s mobile, with no initial layout shift in those samples. These are local lab observations, not real-user Core Web Vitals or a guaranteed connection speed.

No JavaScript exceptions or failed requests were found in the initial crawl. DevTools reported 14 `LazyLoadImageIssue` occurrences across the two homepages, two archives, and six research pages. One archive load also recorded a layout shift of approximately 0.050 while the search controls became visible.

## Changes

- Set explicit CSS aspect ratios for the event photos. Replaced generic research/lifestyle image dimensions with the actual file dimensions, including portrait research photos. This reserves image space before decoding and removes the lazy-image sizing Issues.
- Serve 640px and 960px event-photo derivatives with `srcset`, retaining the 1500px files for larger displays. At a 390 CSS-pixel viewport and device-pixel ratio 2, the two photos total **109,470 bytes**, compared with **287,980 bytes** previously: a **62.0% reduction**. The lower-density 640px pair totals 64,490 bytes. The photographs remain lazy-loaded.
- Load the leading photograph on the standalone robot-arm and metagenomics pages eagerly at high priority. These photographs can be the largest visible content; their below-the-fold homepage cards continue to load lazily.
- Reserve the real flex layout of the archive search controls and project filters before deferred JavaScript runs, using the `scripting` CSS media query. Controls remain invisible and unfocusable until initialized. With JavaScript disabled, the controls remain absent and all content remains available.
- Extend static asset validation to every `srcset` candidate and add `npm run check:cdp` for repeatable browser diagnostics.

## Verification

- Static validation: 22 generated pages and 458 local links/assets, including responsive image candidates.
- Existing browser suite: 50 checks passed across both languages and widths 320–1440px, including menus, dialogs, focus, search, downloads, reduced motion, and JavaScript-disabled access.
- CDP regression suite: all 22 routes at 390px/DPR 2; no runtime errors, unsuccessful requests, or DevTools Issues; event-image transfer budgets checked from Resource Timing.
- Deferred-script checks at 390px and 1440px: the archive count stays at the same vertical position before and after enabling search. Search still finds WalkIsFun afterward.
- Screenshots reviewed for the event photographs and research pages. Reports/screenshots are kept in ignored `artifacts/cdp*` directories.

## Relevant browser documentation

- [Chrome DevTools Protocol: Audits](https://chromedevtools.github.io/devtools-protocol/tot/Audits/) — issue details captured directly from the browser.
- [Chrome: building an effective image component](https://developer.chrome.com/docs/aurora/image-component) — reserving dimensions and serving appropriately sized images.
- [Chrome: LCP request discovery](https://developer.chrome.com/docs/performance/insights/lcp-discovery) — discover and prioritize visible lead images.
- [MDN: scripting media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/scripting) — progressive CSS behavior when JavaScript is available.
