import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";
import { projects } from "../content/portfolio.mjs";
import { archiveGroups } from "../content/archive.mjs";

const root = resolve(".");
const files = [
  "index.html",
  "index-ja.html",
  "cv.html",
  "cv-ja.html",
  "archive.html",
  "archive-ja.html",
  ...(await readdir("research"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => "research/" + f),
];
const pages = new Map(
  await Promise.all(
    files.map(async (file) => [resolve(file), await readFile(file, "utf8")]),
  ),
);
let links = 0;
for (const [file, html] of pages) {
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  assert(
    !/内田\s*太一|3回生|third-year/i.test(html),
    `${file}: stale identity or year`,
  );
  assert(/<html lang="(?:ja|en)"/.test(html), `${file}: language`);
  assert(/name="description"/.test(html), `${file}: description`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\balt="[^"]*"/.test(image[0]), `${file}: image without alt`);
    assert(
      /\bwidth=/.test(image[0]) && /\bheight=/.test(image[0]),
      `${file}: missing intrinsic image size`,
    );
  }
  for (const anchor of html.matchAll(/<a\b[^>]*>/g))
    if (anchor[0].includes('target="_blank"'))
      assert(
        anchor[0].includes("noopener"),
        `${file}: external tab protection`,
      );
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
    const [path, hash] = href.split("#");
    const target = path
      ? resolve(dirname(file), decodeURIComponent(path))
      : file;
    const item = await stat(target).catch(() => null);
    assert(item?.isFile(), `${file}: missing ${href}`);
    if (hash && pages.has(target))
      assert(
        pages.get(target).includes(`id="${hash}"`),
        `${file}: missing anchor ${href}`,
      );
    links++;
  }
}
assert.equal(projects.length, 8);
assert.equal(
  archiveGroups.reduce((n, g) => n + g.entries.length, 0),
  80,
);
for (const lang of ["en", "ja"]) {
  const html = pages.get(
    resolve(lang === "en" ? "index.html" : "index-ja.html"),
  );
  assert(html.includes("2027"), `${lang}: planned enrollment`);
  assert(html.includes("Mission Design Lab"), `${lang}: doctoral laboratory`);
  assert(
    !/https:\/\/(?:fonts\.googleapis|cdnjs|cdn\.jsdelivr)/.test(html),
    `${lang}: third-party critical dependency`,
  );
  for (const project of projects)
    assert(
      html.includes(`id="project-${project.id}"`),
      `${lang}: detail fallback missing`,
    );
}
console.log(
  `PASS: ${pages.size} pages, ${links} local links/assets, 8 bilingual project details, 80 archive entries, identity and metadata checks.`,
);
