import { mkdir, writeFile } from "node:fs/promises";
import {
  profile,
  projects,
  education,
  publications,
  awards,
  activities,
  earlierResearch,
  media,
  skills,
} from "../content/portfolio.mjs";
import { archiveGroups } from "../content/archive.mjs";
import { codexHackathon } from "../content/events.mjs";
import { galleryCategories, galleryPhotos } from "../content/gallery.mjs";
import { galleryImages } from "../content/gallery-images.mjs";
import { canonicalUrl, languageAlternates, structuredData, googleSiteVerification } from "./seo.mjs";
import {sceneMarkup} from "./scene-markup.mjs";
import {heroSlideshow} from "./hero-slideshow.mjs";
const archiveCount = archiveGroups.reduce((n, g) => n + g.entries.length, 0);
// Match .wrap, .photo-gallery columns, and their 28px gaps in style.css.
const gallerySizes = "(max-width: 600px) calc(100vw - 40px), (max-width: 1280px) calc((100vw - 118px) / 2), 581px";
const galleryImage = (photo, index, alt) => {
  const candidates = galleryImages[photo.id];
  const fallback = candidates.find(image => image.width >= 800) || candidates.at(-1);
  return `<img src="${fallback.src}" srcset="${candidates.map(image => `${image.src} ${image.width}w`).join(", ")}" sizes="${index === 0 ? "" : "auto, "}${gallerySizes}" width="${fallback.width}" height="${fallback.height}" style="aspect-ratio: ${photo.width} / ${photo.height}" alt="${esc(alt)}" loading="${index === 0 ? "eager" : "lazy"}"${index === 0 ? ' fetchpriority="high"' : ""} decoding="async">`;
};

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const arrow = '<span aria-hidden="true">↗</span>';
const labels = {
  en: {
    about: "About",
    research: "Research",
    journey: "Experience",
    beyond: "Interests",
    gallery: "Gallery",
    contact: "Contact",
    cv: "CV",
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    researchCta: "Research & projects",
    cvCta: "Read my CV",
    scroll: "About",
    all: "All work",
    space: "Space",
    robotics: "Robotics & control",
    software: "Software",
    life: "Life science",
    details: "Project details",
    back: "Back to research",
    purpose: "Objective",
    contribution: "My contribution",
    outcome: "Results and status",
    tools: "Tools & methods",
    role: "Role",
    period: "Period",
    institution: "Institution",
    next: "Planned enrollment",
    readMore: "View all",
    less: "Close",
    copy: "Copy email",
    copied: "Email copied",
    copyFail: "Please select and copy the email address.",
    motion: "Motion",
    on: "On",
    off: "Off",
    lang: "Language",
    count: "projects",
    cvDownload: "Download CV (PDF)",
    print: "Open PDF for printing",
    home: "Home",
    diagram: "Concept illustration · not experimental data",
    updated: "Updated September 2026",
    upcoming: "PLANNED · APRIL 2027",
    education: "Education",
    researchHistory: "Earlier research",
    publications: "Presentations & papers",
    awards: "Awards & scholarships",
    activities: "Activities",
    media: "Media",
    skills: "Skills",
    notes: "Notes",
    allWork: "All research & projects",
    closeDetail: "Close project details",
  },
  ja: {
    about: "自己紹介",
    research: "研究・開発",
    journey: "経歴",
    beyond: "趣味・活動",
    gallery: "ギャラリー",
    contact: "連絡先",
    cv: "CV",
    skip: "本文へスキップ",
    menu: "メニュー",
    close: "閉じる",
    researchCta: "研究・開発を見る",
    cvCta: "CVを読む",
    scroll: "自己紹介",
    all: "すべて",
    space: "宇宙",
    robotics: "ロボティクス・制御",
    software: "ソフトウェア",
    life: "生命科学",
    details: "プロジェクトを読む",
    back: "研究・開発に戻る",
    purpose: "目的",
    contribution: "担当したこと",
    outcome: "実施内容・結果",
    tools: "使用技術・手法",
    role: "担当・所属研究室",
    period: "期間",
    institution: "機関",
    next: "進学予定",
    readMore: "すべて見る",
    less: "閉じる",
    copy: "メールをコピー",
    copied: "コピーしました",
    copyFail: "メールアドレスを選択してコピーしてください。",
    motion: "動き",
    on: "オン",
    off: "オフ",
    lang: "言語",
    count: "件のプロジェクト",
    cvDownload: "CVをダウンロード（PDF）",
    print: "印刷用PDFを開く",
    home: "ホーム",
    diagram: "コンセプト図・実験データではありません",
    updated: "2026年9月更新",
    upcoming: "進学予定 · 2027年4月",
    education: "学歴",
    researchHistory: "これまでの研究",
    publications: "発表・執筆",
    awards: "受賞・採択",
    activities: "活動歴",
    media: "メディア掲載",
    skills: "スキル",
    notes: "記録",
    allWork: "研究・開発の一覧",
    closeDetail: "プロジェクト詳細を閉じる",
  },
};

// Intrinsic dimensions reserve the correct space before a lazy image is decoded.
const imageDimensions = {
  "robot-arm": [1000, 900],
  presentation: [1000, 563],
  isas: [750, 1000],
  dfki: [750, 1000],
  running: [1000, 624],
  travel: [750, 1000],
  diving: [602, 616],
};
function imageSize(name) {
  const [width, height] = imageDimensions[name];
  return `width="${width}" height="${height}" style="aspect-ratio: ${width} / ${height}"`;
}

function visual(p, root, T) {
  if (p.visual !== "photo") return "";
  return `<figure class="case-photo"><img src="${root}assets/images/${p.image}.webp" ${imageSize(p.image)} alt="${esc(T(p.title))}" loading="lazy" decoding="async"></figure>`;
}

for (const lang of ["en", "ja"]) {
  const L = labels[lang],
    T = (v) => (Array.isArray(v) ? v[lang === "ja" ? 1 : 0] : v);
  const home = lang === "ja" ? "index-ja.html" : "index.html",
    cv = lang === "ja" ? "cv-ja.html" : "cv.html";
  const homeHref = lang === "ja" ? home : "./";
  const projectFile = (p) => `${p.id}${lang === "ja" ? "-ja" : ""}.html`;
  const title =
    T(profile.name) +
    " | " +
    (lang === "ja"
      ? "京都大学・宇宙工学・ロボティクス"
      : "Kyoto University · Aerospace & Robotics");
  const tags = (p) =>
    `<ul class="tags" aria-label="${L.tools}">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const ext = (url, text) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)} ${arrow}<span class="sr-only"> (${lang === "ja" ? "新しいタブ" : "new tab"})</span></a>`;
  const galleryFile = lang === "ja" ? "gallery-ja.html" : "gallery.html";
  const galleryOther = lang === "ja" ? "gallery.html" : "gallery-ja.html";
  function header(root = "", isHome = false, other = "", isGallery = false) {
    return `<a class="skip-link" href="#main">${L.skip}</a><header class="site-header wrap"><a class="brand" href="${isHome ? "#top" : root + homeHref}" aria-label="Taichi Uchida — ${L.home}">${esc(T(profile.name))}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" hidden>${L.menu}<span aria-hidden="true">＋</span></button><nav id="primary-nav" aria-label="${lang === "ja" ? "メインメニュー" : "Main navigation"}">${["research", "journey", "beyond"].map((id) => `<a href="${isHome ? "" : root + homeHref}#${id}" data-section="${id}">${L[id]}</a>`).join("")}<a href="${root + galleryFile}"${isGallery ? ' aria-current="page"' : ""}>${L.gallery}</a><a class="nav-contact" href="${isHome ? "" : root + homeHref}#contact" data-section="contact">${L.contact} ${arrow}</a></nav><a class="nav-cv" href="${root + cv}">CV</a><div class="language-switch" aria-label="${L.lang}"><a href="${lang === "en" ? "#" : other}" ${lang === "en" ? 'aria-current="page"' : 'lang="en" hreflang="en" data-language'}>EN</a><span>/</span><a href="${lang === "ja" ? "#" : other}" ${lang === "ja" ? 'aria-current="page"' : 'lang="ja" hreflang="ja" data-language'}>JP</a></div></header>`;
  }
  function footer(root = "", isHome = false) {
    return `<footer class="site-footer wrap"><a class="footer-brand" href="${isHome ? "#top" : root + homeHref}"><span>Taichi Uchida</span></a><p>© 2026 Taichi Uchida</p><div class="footer-options"><button type="button" class="motion-toggle" hidden aria-pressed="false" data-label="${L.motion}" data-on="${L.on}" data-off="${L.off}">${L.motion}: ${L.on}</button><a href="${isHome ? "#top" : root + homeHref}">${lang === "ja" ? "トップへ" : "Back to top"} ↑</a></div></footer>`;
  }
  function head(
    pageTitle,
    description,
    root = "",
    path = home,
    other = "index-ja.html",
  ) {
    const alternates = Object.entries(languageAlternates(lang, path, other))
      .map(([language, url]) => `<link rel="alternate" hreflang="${language}" href="${esc(url)}">`).join("");
    const schema = JSON.stringify(structuredData({ lang, path, title: pageTitle, description })).replace(/</g, "\\u003c");
    const verification = path === home ? `<meta name="google-site-verification" content="${googleSiteVerification}">` : "";
    return `<!doctype html>\n<html lang="${lang}" data-design="b"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#fcfdfb"><link rel="canonical" href="${canonicalUrl(path)}">${alternates}${verification}<meta property="og:title" content="${esc(pageTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonicalUrl(path)}"><meta property="og:site_name" content="Taichi Uchida"><meta property="og:locale" content="${lang === "ja" ? "ja_JP" : "en_US"}"><meta property="og:locale:alternate" content="${lang === "ja" ? "en_US" : "ja_JP"}"><meta property="og:image" content="https://taichi-u.github.io/assets/social-card.png"><meta property="og:image:alt" content="${esc(T(profile.name))}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}style.css"><script src="${root}script.js" defer></script><script type="application/ld+json">${schema}</script></head><body id="top">`;
  }
  function sectionHead(n, kicker, heading, description = "") {
    return `<div class="section-heading"><div><h2>${heading}</h2></div>${description ? `<p class="section-description">${description}</p>` : ""}</div>`;
  }
  function rows(items, limit = 0) {
    const render = (arr) =>
      arr
        .map(
          ([date, name, desc]) =>
            `<li class="timeline-row"><span class="mono">${esc(date === "School years" && lang === "ja" ? "中学時代" : date)}</span><div><h4>${esc(T(name))}</h4><p>${esc(T(desc))}</p></div></li>`,
        )
        .join("");
    return `<ul class="timeline">${render(limit ? items.slice(0, limit) : items)}</ul>${limit && items.length > limit ? `<details class="archive"><summary>${L.readMore} <span class="mono">+${items.length - limit}</span><span class="plus" aria-hidden="true">＋</span></summary><ul class="timeline">${render(items.slice(limit))}</ul></details>` : ""}`;
  }
  function publicationList() {
    return `<ol class="publication-list">${publications.map(([date, type, name, venue, url]) => `<li><div class="publication-meta"><span class="mono">${date}</span><span class="status-tag">${esc(T(type))}</span></div><div><h4>${url ? ext(url, T(name)) : esc(T(name))}</h4><p>${esc(venue)}</p></div></li>`).join("")}</ol>`;
  }
  function projectBody(p, root = "", modal = false) {
    return `<div class="case-intro"><p class="eyebrow">${esc(p.org)} <span> / ${esc(p.date)}</span></p><${modal ? "h2" : "h1"} ${modal ? 'id="detail-' + p.id + '"' : ""}>${esc(T(p.title))}</${modal ? "h2" : "h1"}><p class="case-subtitle">${esc(T(p.subtitle))}</p>${tags(p)}</div>${visual(p, root, T)}<dl class="case-facts"><div><dt>${L.role}</dt><dd>${esc(T(p.role))}</dd></div><div><dt>${L.period}</dt><dd>${esc(p.date)}</dd></div></dl><div class="case-copy"><section><h3>${L.purpose}</h3><p>${esc(T(p.question))}</p></section><section><h3>${L.contribution}</h3><ul>${p.work.map((w) => `<li>${esc(T(w))}</li>`).join("")}</ul></section><section><h3>${L.outcome}</h3><p>${esc(T(p.outcome))}</p></section></div>${p.photo ? `<figure class="case-photo"><img src="${root}assets/images/${p.photo}.webp" alt="${esc(T(p.photoAlt))}" ${imageSize(p.photo)} loading="lazy" decoding="async"><figcaption>${esc(T(p.photoAlt))}</figcaption></figure>` : ""}`;
  }
  function skillsBlock() {
    return `<dl class="skills-list">${skills.map(([name, items]) => `<div><dt>${esc(T(name))}</dt><dd>${esc(T(items))}</dd></div>`).join("")}</dl>`;
  }
  const aboutTitle = lang === "ja" ? "自己紹介" : "About";
  const other = lang === "en" ? "index-ja.html" : "./";
  const hero = `<section class="hero wrap" aria-labelledby="hero-name">${heroSlideshow(lang)}<div class="hero-profile" id="about"><div class="identity"><img class="portrait" src="assets/images/portrait-small.webp" width="400" height="400" alt="${esc(T(profile.name))}"><div><h1 id="hero-name">${esc(T(profile.name))}</h1><p class="name-en">${lang === "ja" ? "Taichi Uchida" : "内田 大智"}</p></div></div><p class="intro">${esc(T(profile.intro))}</p><div class="hero-links"><a href="#research">${L.research}</a><a href="${cv}">CV</a><a href="#contact">${L.contact}</a></div>${sceneMarkup(lang)}</div></section>`;
  const about = "";
  const research = `<section id="research" class="section wrap">${sectionHead("", "", L.research)}<p class="research-description">${esc(T(profile.about))}</p><span id="projects" class="anchor-alias"></span><div class="filter-bar"><div class="filters" role="group" aria-label="${lang === "ja" ? "プロジェクトの分野" : "Filter projects"}" hidden>${["all", "space", "robotics", "software", "life"].map((key, i) => `<button class="filter-button" type="button" data-filter="${key}" aria-pressed="${i === 0}">${L[key]}</button>`).join("")}</div><p class="project-count mono" role="status" aria-live="polite" aria-atomic="true" data-unit="${L.count}">8 ${L.count}</p></div><div class="project-grid">${projects.map(p => `<article class="project-card" data-category="${p.category.join(" ")}"><div class="project-meta"><span>${esc(p.org)}</span><time>${esc(p.date)}</time></div><div><h3><a href="research/${projectFile(p)}" data-project="${p.id}">${esc(T(p.title))}</a></h3><p>${esc(T(p.summary))}</p>${tags(p)}</div></article>`).join("")}</div><details class="archive earlier-research"><summary>${L.researchHistory}<span class="mono">2020 — 2024</span><span class="plus" aria-hidden="true">＋</span></summary>${rows(earlierResearch)}</details><div class="research-history"><p>${esc(T(profile.about2))}</p><p class="planned">${esc(T(profile.next))}</p></div></section>`;
  const journey = `<section id="journey" class="section journey-section"><div class="wrap">${sectionHead("03", "EXPERIENCE", lang === "ja" ? "経歴" : "Experience")}<div class="journey-columns"><div id="education"><h3 class="subheading">${L.education}</h3>${rows(education)}<div id="achievements"><h3 class="subheading spaced">${L.awards}</h3>${rows(awards, 3)}</div></div><div><h3 class="subheading">${L.publications}</h3>${publicationList()}</div></div><div class="toolkit"><h3>${L.skills}</h3>${skillsBlock()}</div></div></section>`;
  function eventPhotos(event) {
    return `<div class="event-photos">${event.photos.map((photo) => `<figure><img src="assets/images/${photo.file}.webp" srcset="assets/images/${photo.file}-640.webp 640w, assets/images/${photo.file}-960.webp 960w, assets/images/${photo.file}.webp 1500w" sizes="auto, (max-width: 560px) calc(100vw - 40px), 612px" width="1500" height="1001" loading="lazy" decoding="async" alt="${esc(T(photo.caption))}"><figcaption>${esc(T(photo.caption))}</figcaption></figure>`).join("")}</div>`;
  }
  const eventFeature = `<article class="event-feature" aria-labelledby="recent-event-title"><div class="event-heading"><p class="mono">${codexHackathon.date}</p><h3 id="recent-event-title">${esc(T(codexHackathon.title))}</h3></div><p>${esc(T(codexHackathon.summary))}</p>${eventPhotos(codexHackathon)}<p class="event-source">${ext(codexHackathon.url, lang === "ja" ? "イベント公式サイト" : "Official event page")}</p></article>`;
  const beyond = `<section id="beyond" class="section wrap">${sectionHead("04", "INTERESTS & ACTIVITIES", lang === "ja" ? "趣味・活動" : "Interests & activities")}${eventFeature}<div class="life-gallery">${[
    ["running", "RUNNING", lang === "ja" ? "陸上競技" : "Track & field"],
    ["travel", "TRAVEL", lang === "ja" ? "旅行" : "Travel"],
    ["diving", "DIVING", lang === "ja" ? "ダイビング" : "Diving"],
  ]
    .map(
      ([im, caption, name]) =>
        `<figure><img src="assets/images/${im}.webp" ${imageSize(im)} loading="lazy" decoding="async" alt="${esc(name)}"><figcaption>${name}</figcaption></figure>`,
    )
    .join(
      "",
    )}</div><ul class="interests"><li>${lang === "ja" ? "少林寺拳法、筋トレ、ウクレレ" : "Shorinji Kempo, weight training, ukulele"}</li><li>${lang === "ja" ? "料理、歴史、将棋、盆栽、現代短歌" : "Cooking, history, shogi, bonsai, contemporary tanka"}</li><li>${lang === "ja" ? "コーヒー" : "Coffee"}</li><li>${lang === "ja" ? "好きなビール：バイツェン" : "Beer: Weizen"}</li></ul><p class="gallery-link"><a class="text-link" href="${galleryFile}">${lang === "ja" ? "ギャラリーを見る" : "View the photo gallery"} ${arrow}</a></p><div class="beyond-columns"><div id="activities"><h3 class="subheading">${L.activities}</h3>${rows(activities, 3)}<p class="affiliations">${lang === "ja" ? "所属・活動：京都大学医学部陸上部／将棋部／京大マイコンクラブ／宇宙医学若手コミュニティ／Moon Village Association勉強会" : "Communities: Kyoto University Medical School Track & Field Team · Shogi Club · Microcomputer Club · Space Medicine Japan Youth Community · Moon Village Association Study Group"}</p></div><div id="media"><h3 class="subheading">${L.media}</h3><ul class="media-list">${media.map(([date, name, description, url]) => `<li><span class="mono">${date}</span><div><h4>${url ? ext(url, T(name)) : esc(T(name))}</h4><p>${esc(T(description))}</p></div>${url ? "" : `<span class="print-label">${lang === "ja" ? "紙面" : "PRINT"}</span>`}</li>`).join("")}</ul></div></div></section>`;
  const contact = `<section id="contact" class="contact-section"><div class="wrap"><div class="contact-top"><h2>${L.contact}</h2><p>${lang === "ja" ? "メールまたはLinkedInからご連絡ください。" : "Contact me by email or LinkedIn."}</p></div><div class="contact-bottom"><div class="email-group"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><button class="copy-email" type="button" data-email="${profile.email}" data-copied="${L.copied}" data-error="${L.copyFail}" hidden>${L.copy} <span aria-hidden="true">⧉</span></button><span class="copy-status sr-only" role="status"></span></div><div class="social-links">${ext("https://github.com/taichi-u", "GitHub")}${ext("https://www.linkedin.com/in/taichi-uchida", "LinkedIn")}${ext("https://x.com/Ukulele_run", "X")}<a href="${cv}">${L.cv} ${arrow}</a></div></div></div></section>`;
  const dialogs = projects
    .map(
      (p) =>
        `<dialog class="project-dialog" id="project-${p.id}" aria-labelledby="detail-${p.id}"><template><div class="dialog-toolbar"><span class="mono">${esc(p.org)}</span><form method="dialog"><button class="dialog-close" aria-label="${L.closeDetail}">${L.close}<span aria-hidden="true">×</span></button></form></div><div class="dialog-inner">${projectBody(p, "", true)}<a class="button button-outline" href="research/${projectFile(p)}">${lang === "ja" ? "詳細ページを開く" : "Open project page"} ${arrow}</a></div></template></dialog>`,
    )
    .join("");
  const archiveFile = lang === "ja" ? "archive-ja.html" : "archive.html";
  const archiveOther = lang === "ja" ? "archive.html" : "archive-ja.html";
  const archiveName = lang === "ja" ? "活動アーカイブ" : "Activity archive";
  const photoUnit = lang === "ja" ? "枚の写真" : "photos";
  const galleryIntro = lang === "ja"
    ? "研究留学、旅行、趣味。"
    : "Research stays, travel and interests.";
  const galleryPage = `<main id="main" class="gallery-page wrap">
    <a class="back-link" href="${homeHref}#beyond">← ${L.beyond}</a>
    <div class="gallery-heading"><h1>${L.gallery}</h1><p>${galleryIntro}</p></div>
    <div class="gallery-toolbar"><div class="filters gallery-filters" role="group" aria-label="${lang === "ja" ? "写真のカテゴリ" : "Photo categories"}" hidden>
      <button class="filter-button" type="button" data-gallery-filter="all" aria-pressed="true">${lang === "ja" ? "すべて" : "All"}</button>
      ${galleryCategories.map(category => `<button class="filter-button" type="button" data-gallery-filter="${category.id}" aria-pressed="false">${esc(T(category.title))}</button>`).join("")}
    </div><p class="mono" id="gallery-count" role="status" aria-live="polite" aria-atomic="true" data-unit="${photoUnit}">${galleryPhotos.length} ${photoUnit}</p></div>
    <div class="photo-gallery">${galleryPhotos.map((photo, i) => `<figure class="gallery-card" id="${photo.id}" data-category="${photo.categories.join(" ")}">
      <a class="gallery-photo" href="assets/images/${photo.file}.webp" data-gallery-photo aria-label="${esc(T(photo.title))} — ${lang === "ja" ? "写真を拡大" : "Enlarge photo"}">
        ${galleryImage(photo, i, T(photo.title))}
        <span class="gallery-zoom" aria-hidden="true">↗</span>
      </a><figcaption><h2>${esc(T(photo.title))}</h2><p>${esc(T(photo.caption))}</p></figcaption>
    </figure>`).join("")}</div>
  </main>`;
  const galleryDialog = `<dialog class="gallery-dialog" id="gallery-dialog" aria-labelledby="gallery-dialog-title" aria-describedby="gallery-dialog-caption">
    <div class="gallery-dialog-toolbar"><p class="mono" id="gallery-position" aria-live="polite" aria-atomic="true"></p><form method="dialog"><button class="dialog-close" aria-label="${lang === "ja" ? "写真を閉じる" : "Close photo"}">${L.close}<span aria-hidden="true">×</span></button></form></div>
    <div class="gallery-dialog-image"></div>
    <div class="gallery-dialog-bottom"><div><h2 id="gallery-dialog-title"></h2><p id="gallery-dialog-caption"></p></div><div class="gallery-pagination"><button type="button" data-gallery-previous aria-label="${lang === "ja" ? "前の写真" : "Previous photo"}">←</button><button type="button" data-gallery-next aria-label="${lang === "ja" ? "次の写真" : "Next photo"}">→</button></div></div>
  </dialog>`;
  await writeFile(
    galleryFile,
    head(L.gallery + " — " + T(profile.name), lang === "ja" ? "内田 大智の写真。DFKI・ジョージア工科大学での研究留学、スバルバードなどへの旅行、陸上競技や料理の記録。15枚を紹介。" : "Taichi Uchida’s photos from research stays at DFKI and Georgia Tech, travel to Svalbard, track and field, cooking, and other interests. Browse 15 photographs.", "", galleryFile, galleryOther) +
      header("", false, galleryOther, true) + galleryPage + footer() + galleryDialog + "</body></html>\n",
  );
  const archiveCallout = `<div class="wrap"><div class="archive-callout"><div><p>${lang === "ja" ? `研究、企画運営、国際交流、スポーツ。${archiveCount}件の活動記録。` : `${archiveCount} activity records across research, event organization, international exchange, sport, and other fields.`}</p></div><a href="${archiveFile}">${archiveName} ${arrow}</a></div></div>`;
  await writeFile(
    home,
    head(title, T(profile.intro), "", home, other) +
      header("", true, other) +
      `<main id="main">${hero}${about}${research}${journey}${beyond}${archiveCallout}${contact}</main>` +
      footer("", true) +
      dialogs +
      "</body></html>\n",
  );
  await mkdir("research", { recursive: true });
  for (const [i, p] of projects.entries()) {
    const otherPath = `research/${p.id}${lang === "en" ? "-ja" : ""}.html`;
    const next = projects[(i + 1) % projects.length];
    await writeFile(
      "research/" + projectFile(p),
      head(
        T(p.title) + " — " + T(profile.name),
        T(p.summary),
        "../",
        "research/" + projectFile(p),
        otherPath,
      ) +
        header("../", false, otherPath.split("/")[1]) +
        `<main id="main" class="case-page wrap"><a class="back-link" href="../${homeHref}#research">← ${L.back}</a>${projectBody(p, "../")}<div class="case-next"><span>${lang === "ja" ? "次の研究・開発" : "Next project"}</span><a href="${projectFile(next)}">${esc(T(next.title))} ${arrow}</a></div></main>` +
        footer("../") +
        "</body></html>\n",
    );
  }
  const cvOther = lang === "en" ? "cv-ja.html" : "cv.html";
  const cvDescription = lang === "ja"
    ? "内田 大智のCV。京都大学での学歴、宇宙工学・ロボティクスの研究経験、留学、発表・執筆、受賞・採択、使用技術を掲載。PDF版もダウンロードできます。"
    : "Taichi Uchida's CV: education at Kyoto University, aerospace and robotics research, international research stays, presentations, awards, and skills. PDF available.";
  const cvPage = `<main id="main" class="cv-page wrap"><a class="back-link" href="${homeHref}">← ${L.home}</a><div class="cv-heading"><div><p class="eyebrow">CV</p><h1>${esc(T(profile.name))}</h1><p>${esc(T(profile.intro))}</p><a href="mailto:${profile.email}">${profile.email}</a></div><div class="cv-actions"><a class="button" href="cv_taichiuchida${lang === "ja" ? "-ja" : ""}.pdf" download>${L.cvDownload} ↓</a><a class="button button-outline print-button" href="cv_taichiuchida${lang === "ja" ? "-ja" : ""}.pdf" target="_blank" rel="noopener noreferrer">${L.print}<span class="sr-only"> (${lang === "ja" ? "新しいタブ" : "new tab"})</span></a><span class="mono">${L.updated}</span></div></div><section><h2>${L.education}</h2>${rows(education)}</section><section><h2>${L.research}</h2>${rows(projects.map((p) => [p.date, [p.org + " · " + p.title[0], p.org + " · " + p.title[1]], p.summary]))}${rows(earlierResearch)}</section><section><h2>${L.publications}</h2>${publicationList()}</section><section><h2>${L.awards}</h2>${rows(awards)}</section><section><h2>${L.activities}</h2>${rows(activities)}</section><section><h2>${L.skills}</h2>${skillsBlock()}</section><p class="cv-print-note">taichi-u.github.io · ${L.updated}</p></main>`;
  await writeFile(
    cv,
    head("CV — " + T(profile.name), cvDescription, "", cv, cvOther) +
      header("", false, cvOther) +
      cvPage +
      footer() +
      "</body></html>\n",
  );
  const archiveIntro =
    lang === "ja"
      ? "研究、企画運営、国際交流、スポーツなどの活動記録です。分野とキーワードで検索できます。"
      : "Records of research, event organization, international exchange, sport, and other activities. Filter by category or search by keyword.";
  const archivePage = `<main id="main" class="archive-page wrap"><a class="back-link" href="${homeHref}#beyond">← ${L.home}</a><div class="archive-hero"><h1>${archiveName}</h1><p>${archiveIntro}</p></div><div class="archive-controls" hidden><div class="archive-search"><label for="archive-search">${lang === "ja" ? "検索" : "Search"}</label><input type="search" id="archive-search" placeholder="${lang === "ja" ? "例：宇宙、インド、2021" : "Try space, India, 2021"}" autocomplete="off"><button type="button" class="filter-button" data-reset-search>${lang === "ja" ? "リセット" : "Reset"}</button></div><div class="filters" role="group" aria-label="${lang === "ja" ? "活動の分野" : "Activity categories"}"><button class="filter-button" data-archive-filter="all" aria-pressed="true">${lang === "ja" ? "すべて" : "All"}</button>${archiveGroups.map((g) => `<button class="filter-button" data-archive-filter="${g.id}" aria-pressed="false">${esc(T(g.title))}</button>`).join("")}</div></div><p id="archive-count" class="mono" role="status" aria-live="polite" aria-atomic="true" data-unit="${lang === "ja" ? "件の記録" : "entries"}">${archiveCount} ${lang === "ja" ? "件の記録" : "entries"}</p><p id="archive-empty" hidden>${lang === "ja" ? "該当する記録はありません。キーワードを変えるか、リセットしてください。" : "No matching entries. Try a different term or reset the filters."}</p>${archiveGroups.map((g) => `<section class="archive-group" id="${g.id}"><h2>${esc(T(g.title))}</h2>${g.entries.map(([date, en, ja, enText, jaText, event], i) => `<details class="archive-entry" id="${g.id}-${i + 1}" data-category="${g.id}"><summary><span class="mono">${date === "School years" && lang === "ja" ? "中学時代" : esc(date)}</span><span>${esc(lang === "ja" ? ja : en)}</span><span class="plus" aria-hidden="true">＋</span></summary><p>${esc(lang === "ja" ? jaText : enText)}</p>${event ? eventPhotos(event) + `<p class="event-source">${ext(event.url, lang === "ja" ? "イベント公式サイト" : "Official event page")}</p>` : ""}</details>`).join("")}</section>`).join("")}<div class="archive-callout"><p>${lang === "ja" ? "現在の研究と開発の詳細はこちら。" : "Details of current research and software projects."}</p><a href="${homeHref}#research">${L.allWork} ${arrow}</a></div></main>`;
  await writeFile(
    archiveFile,
    head(
      archiveName + " — " + T(profile.name),
      archiveIntro,
      "",
      archiveFile,
      archiveOther,
    ) +
      header("", false, archiveOther) +
      archivePage +
      footer() +
      "</body></html>\n",
  );
}

await writeFile(
  "assets/favicon.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="4" fill="#285d43"/><g fill="none" stroke="#f5f4ee" stroke-width="2"><circle cx="32" cy="32" r="13"/><ellipse cx="32" cy="32" rx="28" ry="9" transform="rotate(-35 32 32)"/></g><circle cx="51" cy="17" r="4" fill="#f5f4ee"/></svg>',
);
const paths = [
  "",
  "index-ja.html",
  "cv.html",
  "cv-ja.html",
  "archive.html",
  "archive-ja.html",
  "gallery.html",
  "gallery-ja.html",
  ...projects.flatMap((p) => [
    `research/${p.id}.html`,
    `research/${p.id}-ja.html`,
  ]),
];
await writeFile(
  "sitemap.xml",
  // Omit lastmod until actual per-page modification dates are maintained.
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${paths.map((p) => `<url><loc>${canonicalUrl(p)}</loc>${/^gallery(?:-ja)?\.html$/.test(p) ? galleryPhotos.map(photo => `<image:image><image:loc>${canonicalUrl(`assets/images/${photo.file}.webp`)}</image:loc></image:image>`).join("") : ""}</url>`).join("\n")}\n</urlset>\n`,
);
await writeFile(
  "robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://taichi-u.github.io/sitemap.xml\n",
);
await writeFile(".nojekyll", "");
console.log(`Built ${paths.length} static pages in English and Japanese.`);
