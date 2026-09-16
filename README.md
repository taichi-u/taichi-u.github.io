# Taichi Uchida — Portfolio

A bilingual, static portfolio for 内田 大智 / Taichi Uchida. Published files live at the repository root for GitHub Pages. There are no frontend framework, CDN, font, or build-service dependencies at runtime.

## Preview and build

Requires Node.js 20 or newer. No package installation is needed.

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
- `scripts/build.mjs`: shared templates that generate all 22 HTML pages, sitemap, and favicon.
- `style.css`: shared responsive design and CV print layout.
- `script.js`: optional navigation, filters, native dialogs, clipboard, archive search, and motion preference.
- `assets/images/`: compressed WebP derivatives. Original photos remain in `photo/`.

The homepage offers eight selected projects. Each has a real standalone URL and an optional native dialog. The 80-entry archive provides text search, category filters, and native disclosure controls. All substantive content remains available without JavaScript.

Follow `docs/writing-guidelines.md` when editing either language. Use descriptive headings and factual content; do not add slogans, poetic metaphors, or promotional copy. Apply wording changes to page metadata, CV PDFs, and the social preview image as well.

## CV PDFs

`cv.html` and `cv-ja.html` are the current, printable public CVs. They link to `cv_taichiuchida.pdf` and `cv_taichiuchida-ja.pdf`. After content changes, open each CV page and use **Print / Save as PDF**, A4 size, to regenerate the corresponding PDF. Application-specific CV source files, postal addresses, phone numbers, and application statements are not included.

## Design and verification

See `docs/design-review.md` for reference analysis, content decisions, and verification notes. Browser screenshots and temporary QA output are stored in ignored `artifacts/`. The repository check verifies local links, anchors, images, page metadata, localization, and key content requirements.

The optional browser suite requires Playwright and Chromium. With the preview server running:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run check:browser
```

The suite covers 46 browser checks in both languages, including widths from 320 to 1440 pixels, keyboard controls, reduced motion, and no-JavaScript access. `CHROME_PATH` can select an existing Chrome executable; `PLAYWRIGHT_MODULE` can select an existing Playwright module, and `PORTFOLIO_BASE_URL` can override the local preview URL.

## Publication

GitHub Pages serves the static files from the root of `main` at https://taichi-u.github.io/. Run the build and checks, regenerate the CV PDFs when their content changes, then commit the generated files and push to `main`. No hosting migration is required.
