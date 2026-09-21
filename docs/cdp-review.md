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

## Gallery follow-up — 21 September 2026

Audited the published gallery revision `c750a34` across all 24 English/Japanese routes before changing it. No console/runtime errors, failed requests, or DevTools Issues were found. The gallery already used native lazy loading for 14 of its 15 photographs, but reused some full-size photographs in the list and served one thumbnail size regardless of the display's pixel density.

A cold-cache desktop run with 4× CPU slowdown exposed an initial layout shift of **0.3573**. CDP's LayoutShift sources showed the photo count moving from the left edge to the right edge while the filters initialized, and the gallery moving down 23px. Deliberately delaying `script.js` also reproduced a 104px vertical movement at 390px. Reserving the gallery filters' actual flex layout now keeps both the count and photographs in place. With JavaScript disabled, the filters remain absent.

All 15 gallery photographs now offer 400px, 800px, and 1200px WebP candidates, capped at the source image's width. `srcset` and `sizes` account for the viewport, the one/two/three-column layout, and pixel density. Matching existing thumbnails are reused. The first photograph remains eager and now has high fetch priority. Other photographs remain lazy; opening the viewer fetches the full-size WebP. The generator and manifest are committed so future photos follow the same process.

### Repeatable measurements

`npm run measure:gallery` samples the Japanese gallery three times per viewport, using a fresh Chrome context with the cache disabled, 150ms latency, 200,000 bytes/s download throughput, and 4× CPU slowdown. Desktop is 1440×1000 at DPR 1; mobile is 390×844 at DPR 2. Both revisions were served from the same local HTTP server. LCP and initial layout shifts were recorded before interaction; full-gallery image bytes were recorded after scrolling through and decoding every photograph. These are controlled lab samples, not real-user Core Web Vitals. Timing differences from three samples do not establish statistical significance.

| Metric | Before | After |
| --- | ---: | ---: |
| Desktop initial image bytes | 754,328 | 195,724 (−74.1%) |
| Desktop full-gallery image bytes | 956,908 | 251,508 (−73.7%) |
| Desktop median LCP | 2.792s | 1.716s |
| Desktop initial layout shift | 0.3573 | 0 |
| Mobile initial image bytes | 196,844 | 206,780 |
| Mobile full-gallery image bytes | 956,908 | 832,218 (−13.0%) |
| Mobile median LCP | 1.160s | 1.216s |
| Mobile initial layout shift | 0 | 0 |

Mobile initially requests only four photographs in this browser profile. Its initial bytes increase by 9,936 because the portrait DFKI image now uses an 800px candidate that better fits a 350px-wide DPR 2 display, instead of the previous 600px thumbnail. Mobile timing is similar in these samples; the clear gains are desktop transfer/rendering and layout stability. Native lazy-loading distances depend on the browser and connection, so request counts are observations rather than a promised fixed number.

### Regression coverage

- `npm run check` validates 24 pages and 656 local links/assets, including every responsive candidate.
- The browser suite covers both languages, widths 320–1440px, all gallery photographs, filters, full-size navigation, keyboard focus, and JavaScript-disabled access.
- CDP checks all 24 routes and tests initial gallery image budgets separately at 390px/DPR 2 and 1440px/DPR 1. It verifies that offscreen requests stay deferred and the full-size lead photograph is fetched only after opening the viewer.
- Delayed-script checks verify that the gallery and photo count remain at their original positions at 390px and 1440px, and that filtering still works afterward.
- Desktop and mobile screenshots were reviewed for image quality and unchanged composition. Detailed samples and screenshots are in ignored `artifacts/gallery-performance/`; CDP reports are in ignored `artifacts/cdp-local-after/` and `artifacts/cdp-public-after/`.

Native lazy loading is appropriate for offscreen images; above-the-fold images need prompt discovery. See [browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading) and [responsive images](https://web.dev/learn/design/responsive-images) for the browser behavior behind these choices.
