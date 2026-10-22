# Search visibility review — 2026-10-22

The public site has 24 English and Japanese HTML pages. The review found missing self-referencing language annotations, inconsistent use of the English homepage URL, identical homepage/CV descriptions, and a sitemap that used the profile's update date for every page.

## Changes

- Use `https://taichi-u.github.io/` consistently for the English homepage in canonical tags, Open Graph, internal navigation, language links, and the sitemap. Keep `index.html` accessible for existing links.
- Give every page reciprocal English/Japanese language annotations, including itself, and an English `x-default` fallback.
- Include the person's name and Kyoto University in homepage titles; use the Japanese name in Japanese project titles. Give the CV its own factual description.
- Describe the website, person, and individual pages with JSON-LD. Homepages and CVs use `ProfilePage` and a stable Person ID. Gallery/archive pages use `CollectionPage`. Current Kyoto University affiliation is distinguished from planned future enrollment in the visible content.
- Add the 15 gallery photos to each language's sitemap entry. Keep the existing responsive WebP images, dimensions, lazy loading, and accessible captions.
- Omit sitemap `lastmod` until reliable per-page modification dates are maintained, rather than presenting the profile's date as every page's modification date.
- Add the public Google ownership meta tag to both homepage languages. Keep it in `scripts/seo.mjs` after verification so future builds retain ownership verification.

## Validation

`npm run build`, `npm run check`, and `npm run check:seo` validate all generated pages. `check:seo` checks canonical URLs, reciprocal language links, unique titles/descriptions, structured-data references, the ownership tag, image sitemap entries, and crawl access.

Use `SEO_BASE_URL=https://taichi-u.github.io/ npm run check:seo` to validate the actual deployed HTML and image responses. Browser and CDP checks cover language switching, page interactions, errors, responsive layout, and image loading.

Search Console registration and sitemap submission are separate from indexing. Search results and reporting data update on Google's schedule; structured data does not guarantee a particular search appearance or ranking.

## Official guidance

- [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Title links](https://developers.google.com/search/docs/appearance/title-link) and [descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Localized versions and reciprocal hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page) and [site names](https://developers.google.com/search/docs/appearance/site-names)
- [Sitemaps and lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [image sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080)
