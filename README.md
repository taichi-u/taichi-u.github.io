# Taichi Uchida — Portfolio

A bilingual, static portfolio for 内田 大智 / Taichi Uchida. Published files live at the repository root for GitHub Pages. There are no frontend framework, CDN, font, or build-service dependencies at runtime. The optional homepage 3D background uses a locally vendored copy of Three.js.

## Preview and build

Requires Node.js 20 or newer. No package installation is needed for the regular HTML build or preview; the optimized 3D assets are checked in.

```sh
npm run build
npm run dev
# http://127.0.0.1:4173/index-ja.html
npm run check
```

Commit regenerated HTML whenever changing content. GitHub Pages can serve the root of the selected branch directly; `.nojekyll` is included.

## Editing content

- `content/portfolio.mjs`: profile, selected research and software projects, education, publications, awards, community work, skills, and media. Localized text uses `[English, Japanese]`.
- `content/archive.mjs`: the full activity archive, grouped into research, leadership, exchange, sport, and learning. Entries contain date, English title, Japanese title, English detail, Japanese detail.
- `content/events.mjs`: event participation and photographs shared across the homepage, archive, and CV.
- `content/gallery.mjs`: bilingual photo captions and categories, including photographs shared with `content/events.mjs`.
- `scripts/build.mjs`: shared templates that generate all 24 HTML pages, sitemap, and favicon.
- `style.css`: shared responsive design and CV print layout.
- `script.js`: optional navigation, filters, native dialogs, clipboard, archive search, and motion preference.
- `scene.js`: editable source for the rotating 3D homepage background. The browser loads its generated `scene.min.js` bundle after the initial content, when the hero approaches the viewport.
- `models/`: original editable Blender models and editing/provenance notes. Web exports live in `assets/models/`; regenerate with `scripts/build-models.py` using Blender.
- `assets/images/`: compressed WebP derivatives. Original photos remain in `photo/`.

### Building 3D assets

After editing `scene.js` or its vendored Three.js modules, install the pinned build tool with `pnpm install --frozen-lockfile`, then run `pnpm run build:scene`. This bundles/minifies the code, preserves the Three.js license notice, records source hashes in `assets/scene-build.json`, and packs the models. Only this optional asset build needs esbuild; the browser has no package-manager or CDN dependency. Commit the regenerated bundle and manifest together with the source.

After editing or exporting a model in Blender, run `node scripts/pack-models.mjs`. The original `.glb` and `.blend` files remain available. The site fetches byte-identical gzip-packed models and decompresses them with the browser's native `DecompressionStream`; browsers without that API load the conventional GLB. Packing verifies exact round-trip equality and preserves unchanged outputs.

`npm run check:scene` checks bundle freshness, packed-model integrity, both languages, rendering/pause, mobile layout, context restoration, legacy decompression fallback, and deferred requests via CDP. Like the other browser checks, it accepts `PLAYWRIGHT_MODULE`, `CHROME_PATH`, and `PORTFOLIO_BASE_URL`.

`MEASURE_LABEL=before npm run measure:scene` and `MEASURE_LABEL=after npm run measure:scene` collect three cold-cache samples at each of two viewports, with 150ms latency, 200KB/s download, and 4× CPU slowdown. They record resource bytes, LCP, scene-ready time, long tasks, steady-state main-thread time, WebGL submissions, paused/offscreen work, and a Chrome trace. Reports go to ignored `artifacts/scene-performance/`; set `MEASURE_OUTPUT` or `MEASURE_SAMPLES` to override. Run comparisons sequentially on the same machine/server without other browser workloads. These are lab observations, not field Core Web Vitals or physical-phone GPU measurements. See `docs/3d-performance.md` for the recorded comparison.

The homepage offers eight selected projects. Each has a real standalone URL and an optional native dialog. The 81-entry archive provides text search, category filters, and native disclosure controls. All substantive content remains available without JavaScript.

The bilingual gallery (`gallery.html` / `gallery-ja.html`) contains 15 distinct photographs from research stays, travels, interests, and events. Category filters and a keyboard-accessible photo viewer are optional enhancements; every photo also has a direct image link. Photographs retain their aspect ratios. New gallery images and lightweight thumbnails live in `assets/images/gallery/`; existing photographs are reused without duplicating gallery entries.

Gallery images use responsive WebP candidates and native lazy loading. The first photo loads eagerly at high priority; the viewer requests the original image when opened. After adding or replacing a gallery photo, run `npm run build:gallery-images` (Python 3 with Pillow and Node.js), then `npm run build`. Commit the generated `content/gallery-images.mjs` manifest and `assets/images/gallery/responsive/` files. Regular HTML builds only require Node.js. Candidate widths stop at the source image's width; existing matching thumbnails are reused.

Follow `docs/writing-guidelines.md` when editing either language. Use descriptive headings and factual content; do not add slogans, poetic metaphors, or promotional copy. Apply wording changes to page metadata, CV PDFs, and the social preview image as well.

## CV PDFs

`cv.html` and `cv-ja.html` retain the website layout. Their download and print links use `cv_taichiuchida.pdf` and `cv_taichiuchida-ja.pdf`, typeset separately with LuaLaTeX. The print link opens the compiled PDF in a new tab for the browser's PDF print controls. Both links work without JavaScript.

After content changes, run:

```sh
npm run build
npm run build:cv
```

PDF generation requires TeX Live / MacTeX with LuaLaTeX, LuaTeX-ja, Harano Aji, Libertinus, and the packages in `cv/preamble.tex`. Set `LUALATEX` to override the compiler path. No application CV files are read: the PDFs use the same public data in `content/portfolio.mjs` as the website. The generator writes reviewable `.tex` sources to `cv/` and intermediate files to ignored `artifacts/`. Commit both the generated sources and PDFs. The PDF is not a browser screenshot.

Application-specific CV source files, postal addresses, phone numbers, and application statements are not included.

## Design and verification

See `docs/design-review.md` for reference analysis, content decisions, and verification notes, and `docs/cdp-review.md` for the CDP findings and optimization measurements. Browser screenshots and temporary QA output are stored in ignored `artifacts/`. The repository check verifies local links, anchors, images, page metadata, localization, and key content requirements.

The optional browser suite requires Playwright and Chromium. With the preview server running:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run check:browser
npm run check:cdp
```

The browser suite covers both languages at widths from 320 to 1440 pixels, gallery filters and image navigation, keyboard controls, reduced motion, and no-JavaScript access. `CHROME_PATH` can select an existing Chrome executable; `PLAYWRIGHT_MODULE` can select an existing Playwright module, and `PORTFOLIO_BASE_URL` can override the local preview URL.

`check:cdp` uses Chrome DevTools Protocol Runtime, Log, Network, Audits, and Performance domains to inspect every published page at a mobile viewport. It checks lazy images, responsive image transfer budgets, and layout stability when the main script is delayed. Reports and screenshots go to `artifacts/cdp-checks/` (override with `CDP_OUTPUT`). Performance values are local lab observations, not real-user measurements.

`npm run check:seo` checks all generated pages for canonical URLs, reciprocal language annotations, unique metadata, structured data, and gallery image sitemap entries. Set `SEO_BASE_URL=https://taichi-u.github.io/` to check deployed responses. See `docs/seo-review.md` for the official guidance and implementation notes. Preserve the Search Console verification tag in `scripts/seo.mjs` when rebuilding.

`MEASURE_LABEL=after npm run measure:gallery` collects three cold-cache gallery samples per viewport using CDP network and CPU throttling. It reports initial LCP, layout shifts, image bytes, and full-gallery image bytes after scrolling. Set `MEASURE_SAMPLES` or `MEASURE_OUTPUT` to override the sample count or the `artifacts/gallery-performance/` output directory. Keep the same browser, server, and workload when comparing runs.

Hackathon photographs have 640px and 960px WebP variants alongside the 1500px originals. `srcset` with automatic sizing selects the appropriate file; retain all three variants when replacing a photo. They were encoded at quality 82. Image dimensions in `scripts/build.mjs` must match the actual files so layout space is correct before loading. The static check also validates every `srcset` URL.

## Publication

GitHub Pages serves the static files from the root of `main` at https://taichi-u.github.io/. Run the build and checks, regenerate the CV PDFs when their content changes, then commit the generated files and push to `main`. No hosting migration is required.

## デザイン比較プレビュー

`npm run build:scene` と `npm run build:design-study` で、`artifacts/design-study/index.html` に日英2案の比較用ページを生成します。`npm run dev` の起動後、`http://127.0.0.1:4173/artifacts/design-study/index.html` で確認できます。2026年10月26日に案Bを選択し、写真のスライドショーを加えた構成を公開ページへ反映しました。

- `content/design-study.mjs`: 参考サイトの観察と文言の変更例。
- `design-study.css`: 2案の表示。
- `npm run check:design-study`: 4画面幅、日英、写真操作、3D入力・タッチ・動きを減らす設定の検証。既存テストと同様に必要に応じて `PLAYWRIGHT_MODULE` と `CHROME_PATH` を指定。
- `DESIGN_EVIDENCE=/path/to/captures npm run build:design-study` で調査画面をローカル比較資料へコピーできます。参考サイトの画面は `artifacts/` 内のみで扱い、公開サイトへ配布しません。


## 写真と3Dの操作

トップの写真は8秒ごとに切り替わります。前後ボタンで選ぶと停止し、ホバー・フォーカス・画面外・非表示タブでも切り替えを休止します。初期表示では1枚目だけ取得し、後続画像は切り替え時に読み込みます。読み込み失敗時は元の写真を保ち、前後ボタンで再試行できます。

3Dはドラッグ、矢印キー・ボタン、Homeキー・初期位置ボタンで操作できます。スマートフォンでは「3Dを操作」で開始し、「操作を終了」でスクロールに戻ります。操作後3秒で自動回転を再開しますが、手動停止やOSの動きを減らす設定では再開しません。自動回転を止めても手動操作できます。

`npm run check:interactions` はCDPタッチと描画ピクセルで3D入力を検証します。`npm run check:slideshow` は4画面幅×日英、読み込み、停止、失敗からの再試行、レイアウトの安定性を検証します。`measure:design` は初期表示と3Dをスクロールで表示した後の負荷を分けて計測します。比較は他のブラウザー検証を止め、同じ条件で順に実行してください。
