# Portfolio refresh — 2026-09-16

## Reference inspection

Reference pages were opened in Chromium with agent-browser. Screenshots and live DOM / computed-style inspection informed the design; no source code or images from these sites were copied.

| Reference                       | Observed                                                                                                                                     | Applied here                                                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| https://www.webcreatormana.com/ | Compact introduction, portrait, a distinctive visual motif, short fixed navigation; Raleway and a light gray background.                     | One clear identity, a short explanation of the research, a personal photo, and direct paths to work and contact.         |
| https://sato-takaaki.work/      | Warm near-white background, restrained type, generous space, and a fixed three-item header.                                                  | Ivory and charcoal, thin rules, generous space, and concise navigation.                                                  |
| https://www.s5-studios.com/     | A fixed header and expressive full-screen motion. Live inspection found five canvas elements; content is presented inside a fixed container. | Persistent navigation and restrained motion, implemented with lightweight CSS and SVG while preserving native scrolling. |

## Information hierarchy

1. Identity, current field, and direct research / CV links.
2. Current research and previous affiliations plus a clearly marked **planned April 2027** SOKENDAI doctoral transition.
3. Eight selected projects, filterable by field, with objective / contribution / results and status / tools.
4. Education, presentations, submissions, selected awards, and skills.
5. Personal interests, selected community work, and media.
6. A separate 80-entry activity archive in five themes, with search and expandable details.
7. Contact and public CVs.

## Content decisions

- Name: **内田 大智 / Taichi Uchida**, directly confirmed by the user.
- Current year: fourth-year undergraduate, directly confirmed by the user.
- Planned enrollment: **総合研究大学院大学 先端学術院 先端学術専攻 宇宙科学コース 5年一貫博士課程 尾崎直哉研究室 (Mission Design Lab), April 2027**. Kept separate from current affiliations.
- New technical work and recent presentations were drawn from the provided CVs. New source attachments are kept outside the repository.
- The 70th UKAREN paper is labeled **submitted in August 2026**, not accepted, published, or already presented.
- The athletics application is described as **in trial use**, per the newly supplied project narrative.
- The latest explicit user message says **3,800 chocolate bananas over two days**. This takes precedence over the old website's “one day” and an older narrative's “3,200.” The date is left as school years because records differ.
- Pathways athletics captaincy is described as selection for a future role that did not commence due to lockdown, not a role actually held.
- The artificial-gravity study includes the limitation identified by the experiment. The Georgia Tech narrative treats organic sulfur involvement as a possibility, not a proven mechanism.
- Undated archive activities use a dash. Uncertain dates are not invented. Some earlier dates are expressed by year or a range where sources differ.
- Only the previously public university email is used. Postal addresses, phone numbers, and application-specific statements were excluded.
- All research visuals drawn for this revision are conceptual illustrations. Detailed project pages identify them as such, not experimental plots or real hardware photographs.
- Original external media links are retained. Their publisher availability is outside this site's control.
- Headings and project titles directly describe their content. Promotional and metaphorical copy was removed from both languages, including metadata, public CVs, and the social preview. See `writing-guidelines.md` for the owner's wording preferences and reference guidance.

## Implementation

- Static bilingual HTML generated from shared content; existing homepage and CV URLs retained.
- Native scrolling and CSS transforms; no scroll hijacking, WebGL, particle engines, typed-text library, icon font, or remote font dependency.
- An offscreen observer pauses the orbit animation. OS reduced-motion settings take precedence, and an explicit motion switch is provided.
- Native dialog focus trapping, Escape, explicit close, backdrop close, and focus restoration. Modified clicks and no-JavaScript visits follow the real project URL.
- Mobile navigation exposes expanded state, closes on selection / Escape / outside interaction, and adapts when the viewport changes.
- Image dimensions reserve layout space; below-the-fold photos are lazy loaded and WebP compressed. The hero portrait is about 15 KB.
- Meta descriptions, canonical / alternate language links, Open Graph preview, Person structured data, sitemap, and robots file.
- A4 print styling and updated public CV PDFs in both languages.

## Verification

Detailed measurements and test results are appended after final browser checks. Local metrics are laboratory measurements, not field Core Web Vitals.

### Final results

- Static validation: **22 pages, 424 local links/assets**, all passing; no stale name or third-year labels.
- Chromium browser validation: **46 checks passed**, no page errors or HTTP failures. English and Japanese pages were checked at 320, 390, 768, and 1440 pixels.
- Covered category filtering, project dialogs, keyboard focus trapping, Escape / close, focus restoration, clipboard copying, stored motion preference, language switching with the current section, archive category + text search, empty states, reset, mobile navigation, no-JavaScript fallback, and OS reduced-motion behavior.
- Lighthouse 12.8.2, simulated mobile conditions, local server: **Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100**. First contentful paint 1.2 s; largest contentful paint 1.6 s; total blocking time 0 ms; cumulative layout shift 0. These are local lab results, not a guarantee of production or field results.
- Public CV PDFs: four A4 pages per language, visually reviewed. Original application CVs and private contact details were not published.
- Fixed problems found during review: stale/missing images, the old undefined popup initializer, inaccessible menu controls, overly small supporting text, a contrast issue, duplicate project links, and contact decoration overflowing a 320-pixel screen. Project dialogs are now created lazily from templates.
- Browser evidence and Lighthouse JSON are under ignored `artifacts/`. Reference screenshots are under `artifacts/references/`.
