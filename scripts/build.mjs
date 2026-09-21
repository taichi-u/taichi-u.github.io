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
const archiveCount = archiveGroups.reduce((n, g) => n + g.entries.length, 0);

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

function icon() {
  return '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="9" stroke="currentColor" stroke-width="1.5"/><ellipse cx="20" cy="20" rx="19" ry="6" transform="rotate(-35 20 20)" stroke="currentColor" stroke-width="1.5"/><circle cx="33" cy="10" r="3" fill="currentColor"/></svg>';
}

function visual(p, root, T) {
  const artStart = `<div class="project-art art-${p.visual}" aria-hidden="true"><span class="art-corner">${esc(p.org)}</span>`;
  if (p.visual === "photo")
    return `${artStart}<img src="${root}assets/images/${p.image}.webp" width="1000" height="650" alt="" loading="lazy" decoding="async"><span class="art-bottom">${p.id === "space-robot-arm" ? "07 DOF / ROBOTICS" : "METAGENOMIC ANALYSIS"}</span></div>`;
  const common =
    '<svg viewBox="0 0 640 390" fill="none" xmlns="http://www.w3.org/2000/svg">';
  let svg = "";
  if (p.visual === "orbit")
    svg = `${common}<g stroke="currentColor" opacity=".38"><ellipse cx="300" cy="195" rx="120" ry="66" transform="rotate(-24 300 195)"/><ellipse cx="300" cy="195" rx="202" ry="108" transform="rotate(-24 300 195)"/><ellipse cx="300" cy="195" rx="300" ry="163" transform="rotate(-24 300 195)"/></g><path d="M90 290C178 148 330 68 534 91" stroke="#afccff" stroke-width="2" stroke-dasharray="5 7"/><circle cx="295" cy="192" r="18" fill="#f1efe5"/><circle cx="470" cy="92" r="6" fill="#b5d2ff"/><circle cx="138" cy="225" r="5" fill="white"/><path d="M493 70l22-12-7 24-3-12z" fill="white"/><text x="78" y="332" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">TRAJECTORY OPTIMIZATION</text></svg>`;
  if (p.visual === "control")
    svg = `${common}<g stroke="currentColor" opacity=".13">${[100, 160, 220, 280, 340].map((y) => `<path d="M50 ${y}H590"/>`).join("")}${[80, 160, 240, 320, 400, 480, 560].map((x) => `<path d="M${x} 60V350"/>`).join("")}</g><path d="M65 283C150 283 140 112 251 137S385 311 462 211S537 133 580 126" stroke="#687784" stroke-width="2" stroke-dasharray="7 7"/><path d="M65 290C143 290 149 119 253 144S385 316 462 218S537 140 580 133" stroke="#264fcb" stroke-width="3"/><g transform="translate(318 185) rotate(43)"><rect x="-24" y="-13" width="48" height="26" rx="8" fill="#264fcb"/><rect x="-13" y="-10" width="20" height="20" rx="3" fill="#e5edfb"/><path d="M-15-16h10M10-16h10M-15 16h10M10 16h10" stroke="#1a222e" stroke-width="5"/></g><text x="48" y="334" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">MODEL PREDICTIVE CONTROL</text></svg>`;
  if (p.visual === "lunar")
    svg = `${common}<circle cx="467" cy="114" r="53" stroke="currentColor" opacity=".2"/><path d="M0 300L100 251 191 282 258 249 332 292 449 258 640 305" stroke="currentColor" opacity=".4"/><g stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M252 190l-46 48-11 42m60-68 38 35-14 45m53-91 39 29 14 58m-53-67-7 31 42 38"/><path d="M256 176h65l22 31-57 12-43-22z" fill="#c0cab4"/><path d="M309 174l14-46 35-12"/><circle cx="359" cy="116" r="8"/><circle cx="208" cy="238" r="7" fill="#c0cab4"/><circle cx="295" cy="247" r="7" fill="#c0cab4"/><circle cx="371" cy="230" r="7" fill="#c0cab4"/></g><text x="42" y="341" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">LUNAR ROBOT CONTROL</text></svg>`;
  if (p.visual === "track")
    svg = `${common}<g stroke="currentColor" opacity=".55" stroke-width="2">${[0, 1, 2, 3, 4].map((i) => `<rect x="${118 - i * 23}" y="${116 - i * 23}" width="${410 + i * 46}" height="${160 + i * 46}" rx="${80 + i * 23}" transform="rotate(-20 320 195)"/>`).join("")}</g><circle cx="489" cy="172" r="11" fill="#1c3934"/><path d="M488 149v-15m23 31h15" stroke="#1c3934" stroke-width="2"/><text x="43" y="340" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">ATHLETICS RECORD MANAGEMENT</text></svg>`;
  if (p.visual === "language")
    svg = `${common}<text x="78" y="182" fill="currentColor" opacity=".35" font-family="Georgia,serif" font-size="76">Привет, мир.</text><path d="M80 198h205" stroke="currentColor" stroke-width="2" stroke-dasharray="3 5"/><rect x="182" y="229" width="333" height="65" rx="32" fill="#f2e6da"/><text x="214" y="272" fill="#5d4439" font-size="31" font-family="Georgia,serif">Hello, world.</text><text x="43" y="340" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">GRAMMATICAL ERROR CORRECTION</text></svg>`;
  if (p.visual === "life")
    svg = `${common}<g stroke="currentColor" stroke-width="1.5" opacity=".6">${Array.from(
      { length: 13 },
      (_, i) => {
        const x = 100 + ((i * 97) % 450),
          y = 100 + ((i * 53) % 205);
        return `<ellipse cx="${x}" cy="${y}" rx="32" ry="14" transform="rotate(${i * 33} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="3" fill="currentColor"/>`;
      },
    ).join(
      "",
    )}</g><circle cx="320" cy="195" r="146" stroke="currentColor" opacity=".2"/><text x="43" y="350" fill="currentColor" font-size="11" font-family="monospace" letter-spacing="2">HALOPHILIC ARCHAEA</text></svg>`;
  return artStart + svg + "</div>";
}

for (const lang of ["en", "ja"]) {
  const L = labels[lang],
    T = (v) => (Array.isArray(v) ? v[lang === "ja" ? 1 : 0] : v);
  const home = lang === "ja" ? "index-ja.html" : "index.html",
    cv = lang === "ja" ? "cv-ja.html" : "cv.html";
  const projectFile = (p) => `${p.id}${lang === "ja" ? "-ja" : ""}.html`;
  const title =
    T(profile.name) +
    " — " +
    (lang === "ja"
      ? "宇宙・ロボティクス・知的制御"
      : "Space, robotics & intelligent control");
  const tags = (p) =>
    `<ul class="tags" aria-label="${L.tools}">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const ext = (url, text) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)} ${arrow}<span class="sr-only"> (${lang === "ja" ? "新しいタブ" : "new tab"})</span></a>`;
  function header(root = "", isHome = false, other = "") {
    return `<a class="skip-link" href="#main">${L.skip}</a><header class="site-header"><a class="brand" href="${isHome ? "#top" : root + home}" aria-label="Taichi Uchida — ${L.home}">${icon()}<span>TAICHI UCHIDA</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" hidden>${L.menu}<span aria-hidden="true">＋</span></button><nav id="primary-nav" aria-label="${lang === "ja" ? "メインメニュー" : "Main navigation"}">${["about", "research", "journey", "beyond"].map((id) => `<a href="${isHome ? "" : root + home}#${id}" data-section="${id}">${L[id]}</a>`).join("")}<a class="nav-contact" href="${isHome ? "" : root + home}#contact" data-section="contact">${L.contact} ${arrow}</a></nav><div class="language-switch" aria-label="${L.lang}"><a href="${lang === "en" ? "#" : other}" ${lang === "en" ? 'aria-current="page"' : 'lang="en" hreflang="en" data-language'}>EN</a><span>/</span><a href="${lang === "ja" ? "#" : other}" ${lang === "ja" ? 'aria-current="page"' : 'lang="ja" hreflang="ja" data-language'}>JP</a></div></header>`;
  }
  function footer(root = "", isHome = false) {
    return `<footer class="site-footer"><a class="footer-brand" href="${isHome ? "#top" : root + home}">${icon()}<span>Taichi Uchida</span></a><p>© 2026 Taichi Uchida</p><div class="footer-options"><button type="button" class="motion-toggle" hidden aria-pressed="false" data-label="${L.motion}" data-on="${L.on}" data-off="${L.off}">${L.motion}: ${L.on}</button><a href="${isHome ? "#top" : root + home}">${lang === "ja" ? "トップへ" : "Back to top"} ↑</a></div></footer>`;
  }
  function head(
    pageTitle,
    description,
    root = "",
    path = home,
    other = "index-ja.html",
  ) {
    return `<!doctype html>\n<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f5f4ee"><link rel="canonical" href="https://taichi-u.github.io/${path === "index.html" ? "" : path}"><link rel="alternate" hreflang="${lang === "en" ? "ja" : "en"}" href="https://taichi-u.github.io/${other}"><meta property="og:title" content="${esc(pageTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="https://taichi-u.github.io/${path}"><meta property="og:image" content="https://taichi-u.github.io/assets/social-card.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}style.css"><script src="${root}script.js" defer></script></head><body id="top">`;
  }
  function sectionHead(n, kicker, heading, description = "") {
    return `<div class="section-heading"><div><p class="eyebrow"><span>${n}</span> ${kicker}</p><h2>${heading}</h2></div>${description ? `<p class="section-description">${description}</p>` : ""}</div>`;
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
    return `<div class="case-intro"><p class="eyebrow">${esc(p.org)} <span> / ${esc(p.date)}</span></p><${modal ? "h2" : "h1"} ${modal ? 'id="detail-' + p.id + '"' : ""}>${esc(T(p.title))}</${modal ? "h2" : "h1"}><p class="case-subtitle">${esc(T(p.subtitle))}</p>${tags(p)}</div>${visual(p, root, T)}${p.visual !== "photo" ? `<p class="visual-caption">${L.diagram}</p>` : ""}<dl class="case-facts"><div><dt>${L.role}</dt><dd>${esc(T(p.role))}</dd></div><div><dt>${L.period}</dt><dd>${esc(p.date)}</dd></div></dl><div class="case-copy"><section><h3>${L.purpose}</h3><p>${esc(T(p.question))}</p></section><section><h3>${L.contribution}</h3><ul>${p.work.map((w) => `<li>${esc(T(w))}</li>`).join("")}</ul></section><section><h3>${L.outcome}</h3><p>${esc(T(p.outcome))}</p></section></div>${p.photo ? `<figure class="case-photo"><img src="${root}assets/images/${p.photo}.webp" alt="${esc(T(p.photoAlt))}" width="1000" height="750" loading="lazy" decoding="async"><figcaption>${esc(T(p.photoAlt))}</figcaption></figure>` : ""}`;
  }
  function skillsBlock() {
    return `<dl class="skills-list">${skills.map(([name, items]) => `<div><dt>${esc(T(name))}</dt><dd>${esc(T(items))}</dd></div>`).join("")}</dl>`;
  }
  const aboutTitle = lang === "ja" ? "自己紹介" : "About";
  const other = lang === "en" ? "index-ja.html" : "index.html";
  const hero = `<section class="hero wrap" aria-labelledby="hero-name"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> AEROSPACE · ROBOTICS · CONTROL</p><h1 id="hero-name">Taichi<br>Uchida<span class="blue">.</span></h1><p class="hero-name">内田 大智 <span> / </span> KYOTO, JAPAN</p><p class="hero-description">${esc(T(profile.intro))}</p><div class="hero-actions"><a class="button" href="#research">${L.researchCta}<span aria-hidden="true">↘</span></a><a class="text-link" href="${cv}">${L.cvCta} ${arrow}</a></div></div><div class="hero-art"><div class="orbital-stage" aria-hidden="true"><svg viewBox="0 0 600 620" class="orbit-lines" fill="none"><g stroke="currentColor"><ellipse cx="300" cy="301" rx="281" ry="92" transform="rotate(-38 300 301)"/><ellipse cx="300" cy="301" rx="248" ry="145" transform="rotate(38 300 301)" opacity=".45"/><circle cx="300" cy="301" r="224" opacity=".2" stroke-dasharray="2 8"/><path d="M300 50V82M300 520V552M40 301h32m456 0h32" opacity=".5"/></g><g class="orbit-satellite"><circle cx="79" cy="325" r="7" fill="#2854d8"/><circle cx="79" cy="325" r="15" stroke="#2854d8" opacity=".3"/></g></svg><div class="planet"><div class="planet-longitude"></div><div class="planet-latitude"></div><span class="planet-shine"></span></div><span class="orbit-label label-left">35.01° N<br>135.77° E</span><span class="orbit-cross">+</span></div><figure class="hero-portrait"><img src="assets/images/portrait-small.webp" alt="${esc(T(profile.name))}" width="400" height="400" fetchpriority="high"></figure></div><div class="hero-bottom"><p><span class="status-dot"></span>${lang === "ja" ? "京都大学・学部4年生" : "Fourth-year student · Kyoto University"}</p><a href="#about">${L.scroll}<span aria-hidden="true">↓</span></a><span class="mono">PORTFOLIO / 2026</span></div></section>`;
  const about = `<section id="about" class="section wrap"><div class="about-grid"><div>${sectionHead("01", "ABOUT", aboutTitle)}<a class="text-link" href="${cv}">${lang === "ja" ? "プロフィールと経歴" : "Profile and CV"} ${arrow}</a></div><div class="about-copy"><p class="lead">${esc(T(profile.about))}</p><p>${esc(T(profile.about2))}</p><aside class="next-chapter"><span class="mono">${L.upcoming}</span><h3>${lang === "ja" ? "総合研究大学院大学" : "SOKENDAI"}</h3><p>${esc(T(profile.next))}</p></aside></div></div><div class="focus-strip"><span>MISSION DESIGN</span><span aria-hidden="true">✳</span><span>INTELLIGENT CONTROL</span><span aria-hidden="true">✳</span><span>SPACE ROBOTICS</span></div></section>`;
  const research = `<section id="research" class="section wrap">${sectionHead("02", "RESEARCH & PROJECTS", lang === "ja" ? "研究・開発" : "Research & projects", lang === "ja" ? "研究とソフトウェア開発の内容を、分野別に掲載しています。" : "Research and software development projects, organized by field.")}<span id="projects" class="anchor-alias"></span><div class="filter-bar"><div class="filters" role="group" aria-label="${lang === "ja" ? "プロジェクトの分野" : "Filter projects"}" hidden>${["all", "space", "robotics", "software", "life"].map((key, i) => `<button class="filter-button" type="button" data-filter="${key}" aria-pressed="${i === 0}">${L[key]}${key === "all" ? "<span>08</span>" : ""}</button>`).join("")}</div><p class="project-count mono" role="status" aria-live="polite" aria-atomic="true" data-unit="${L.count}">08 ${L.count}</p></div><div class="project-grid">${projects.map((p, i) => `<article class="project-card" data-category="${p.category.join(" ")}"><div class="project-cover">${visual(p, "", T)}<span class="project-open" aria-hidden="true">↗</span></div><div class="project-meta mono"><span>${String(i + 1).padStart(2, "0")} / ${esc(p.org)}</span><span>${esc(p.date)}</span></div><h3><a href="research/${projectFile(p)}" data-project="${p.id}">${esc(T(p.title))}</a></h3><p>${esc(T(p.summary))}</p>${tags(p)}</article>`).join("")}</div><details class="archive earlier-research"><summary>${L.researchHistory}<span class="mono">2020 — 2024</span><span class="plus" aria-hidden="true">＋</span></summary>${rows(earlierResearch)}</details></section>`;
  const journey = `<section id="journey" class="section journey-section"><div class="wrap">${sectionHead("03", "EXPERIENCE", lang === "ja" ? "経歴" : "Experience")}<div class="journey-columns"><div id="education"><h3 class="subheading">${L.education}</h3>${rows(education)}<div id="achievements"><h3 class="subheading spaced">${L.awards}</h3>${rows(awards, 3)}</div></div><div><h3 class="subheading">${L.publications}</h3>${publicationList()}</div></div><div class="toolkit"><h3>${L.skills}</h3>${skillsBlock()}</div></div></section>`;
  function eventPhotos(event) {
    return `<div class="event-photos">${event.photos.map((photo) => `<figure><img src="assets/images/${photo.file}.webp" width="1500" height="1001" loading="lazy" decoding="async" alt="${esc(T(photo.caption))}"><figcaption>${esc(T(photo.caption))}</figcaption></figure>`).join("")}</div>`;
  }
  const eventFeature = `<article class="event-feature" aria-labelledby="recent-event-title"><div class="event-heading"><p class="mono">${codexHackathon.date}</p><h3 id="recent-event-title">${esc(T(codexHackathon.title))}</h3></div><p>${esc(T(codexHackathon.summary))}</p>${eventPhotos(codexHackathon)}<p class="event-source">${ext(codexHackathon.url, lang === "ja" ? "イベント公式サイト" : "Official event page")}</p></article>`;
  const beyond = `<section id="beyond" class="section wrap">${sectionHead("04", "INTERESTS & ACTIVITIES", lang === "ja" ? "趣味・活動" : "Interests & activities")}${eventFeature}<div class="life-gallery">${[
    ["running", "RUNNING", lang === "ja" ? "陸上競技" : "Track & field"],
    ["travel", "TRAVEL", lang === "ja" ? "旅行" : "Travel"],
    ["diving", "DIVING", lang === "ja" ? "ダイビング" : "Diving"],
  ]
    .map(
      ([im, caption, name]) =>
        `<figure><img src="assets/images/${im}.webp" width="700" height="800" loading="lazy" decoding="async" alt="${esc(name)}"><figcaption><span class="mono">${caption}</span><span>${name}</span></figcaption></figure>`,
    )
    .join(
      "",
    )}</div><p class="interests-line">${lang === "ja" ? "その他の趣味：ウクレレ、料理、将棋、盆栽、短歌、コーヒー。" : "Other interests: ukulele, cooking, shogi, bonsai, tanka poetry, and coffee."}</p><div class="beyond-columns"><div id="activities"><h3 class="subheading">${L.activities}</h3>${rows(activities, 3)}<p class="affiliations">${lang === "ja" ? "所属・活動：京都大学医学部陸上部／将棋部／京大マイコンクラブ／宇宙医学若手コミュニティ／Moon Village Association勉強会" : "Communities: Kyoto University Medical School Track & Field Team · Shogi Club · Microcomputer Club · Space Medicine Japan Youth Community · Moon Village Association Study Group"}</p></div><div id="media"><h3 class="subheading">${L.media}</h3><ul class="media-list">${media.map(([date, name, description, url]) => `<li><span class="mono">${date}</span><div><h4>${url ? ext(url, T(name)) : esc(T(name))}</h4><p>${esc(T(description))}</p></div>${url ? "" : `<span class="print-label">${lang === "ja" ? "紙面" : "PRINT"}</span>`}</li>`).join("")}</ul></div></div></section>`;
  const contact = `<section id="contact" class="contact-section"><div class="wrap"><p class="eyebrow"><span>05</span> CONTACT</p><div class="contact-top"><h2>${L.contact}</h2><p>${lang === "ja" ? "メールまたはLinkedInからご連絡ください。" : "Contact me by email or LinkedIn."}</p></div><div class="contact-bottom"><div class="email-group"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><button class="copy-email" type="button" data-email="${profile.email}" data-copied="${L.copied}" data-error="${L.copyFail}" hidden>${L.copy} <span aria-hidden="true">⧉</span></button><span class="copy-status sr-only" role="status"></span></div><div class="social-links">${ext("https://github.com/taichi-u", "GitHub")}${ext("https://www.linkedin.com/in/taichi-uchida", "LinkedIn")}${ext("https://x.com/Ukulele_run", "X")}<a href="${cv}">${L.cv} ${arrow}</a></div></div></div></section>`;
  const dialogs = projects
    .map(
      (p) =>
        `<dialog class="project-dialog" id="project-${p.id}" aria-labelledby="detail-${p.id}"><template><div class="dialog-toolbar"><span class="mono">PROJECT DETAILS / ${esc(p.org)}</span><form method="dialog"><button class="dialog-close" aria-label="${L.closeDetail}">${L.close}<span aria-hidden="true">×</span></button></form></div><div class="dialog-inner">${projectBody(p, "", true)}<a class="button button-outline" href="research/${projectFile(p)}">${lang === "ja" ? "詳細ページを開く" : "Open project page"} ${arrow}</a></div></template></dialog>`,
    )
    .join("");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: T(profile.name),
    alternateName: "Taichi Uchida",
    url: "https://taichi-u.github.io/",
    image: "https://taichi-u.github.io/assets/images/portrait.webp",
    description: T(profile.intro),
    sameAs: [
      "https://github.com/taichi-u",
      "https://www.linkedin.com/in/taichi-uchida",
    ],
    knowsAbout: [
      "Astrodynamics",
      "Space robotics",
      "Optimal control",
      "Machine learning",
    ],
  };
  const archiveFile = lang === "ja" ? "archive-ja.html" : "archive.html";
  const archiveOther = lang === "ja" ? "archive.html" : "archive-ja.html";
  const archiveName = lang === "ja" ? "活動アーカイブ" : "Activity archive";
  const archiveCallout = `<div class="wrap"><div class="archive-callout"><div><p class="eyebrow">ACTIVITY ARCHIVE</p><p>${lang === "ja" ? `研究、企画運営、国際交流、スポーツなど、${archiveCount}件の活動記録を掲載しています。` : `${archiveCount} activity records across research, event organization, international exchange, sport, and other fields.`}</p></div><a href="${archiveFile}">${archiveName} ${arrow}</a></div></div>`;
  await writeFile(
    home,
    head(title, T(profile.intro), "", home, other) +
      header("", true, other) +
      `<main id="main">${hero}${about}${research}${journey}${beyond}${archiveCallout}${contact}</main>` +
      footer("", true) +
      dialogs +
      `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script></body></html>\n`,
  );
  await mkdir("research", { recursive: true });
  for (const [i, p] of projects.entries()) {
    const otherPath = `research/${p.id}${lang === "en" ? "-ja" : ""}.html`;
    const next = projects[(i + 1) % projects.length];
    await writeFile(
      "research/" + projectFile(p),
      head(
        T(p.title) + " — Taichi Uchida",
        T(p.summary),
        "../",
        "research/" + projectFile(p),
        otherPath,
      ) +
        header("../", false, otherPath.split("/")[1]) +
        `<main id="main" class="case-page wrap"><a class="back-link" href="../${home}#research">← ${L.back}</a>${projectBody(p, "../")}<div class="case-next"><span class="eyebrow">NEXT PROJECT</span><a href="${projectFile(next)}">${esc(T(next.title))} ${arrow}</a></div></main>` +
        footer("../") +
        "</body></html>\n",
    );
  }
  const cvOther = lang === "en" ? "cv-ja.html" : "cv.html";
  const cvPage = `<main id="main" class="cv-page wrap"><a class="back-link" href="${home}">← ${L.home}</a><div class="cv-heading"><div><p class="eyebrow">CURRICULUM VITAE / 2026</p><h1>${esc(T(profile.name))}<span class="blue">.</span></h1><p>${esc(T(profile.intro))}</p><a href="mailto:${profile.email}">${profile.email}</a></div><div class="cv-actions"><a class="button" href="cv_taichiuchida${lang === "ja" ? "-ja" : ""}.pdf" download>${L.cvDownload} ↓</a><a class="button button-outline print-button" href="cv_taichiuchida${lang === "ja" ? "-ja" : ""}.pdf" target="_blank" rel="noopener noreferrer">${L.print}<span class="sr-only"> (${lang === "ja" ? "新しいタブ" : "new tab"})</span></a><span class="mono">${L.updated}</span></div></div><section><h2>${L.education}</h2>${rows(education)}</section><section><h2>${L.research}</h2>${rows(projects.map((p) => [p.date, [p.org + " · " + p.title[0], p.org + " · " + p.title[1]], p.summary]))}${rows(earlierResearch)}</section><section><h2>${L.publications}</h2>${publicationList()}</section><section><h2>${L.awards}</h2>${rows(awards)}</section><section><h2>${L.activities}</h2>${rows(activities)}</section><section><h2>${L.skills}</h2>${skillsBlock()}</section><p class="cv-print-note">taichi-u.github.io · ${L.updated}</p></main>`;
  await writeFile(
    cv,
    head("CV — " + T(profile.name), T(profile.intro), "", cv, cvOther) +
      header("", false, cvOther) +
      cvPage +
      footer() +
      "</body></html>\n",
  );
  const archiveIntro =
    lang === "ja"
      ? "研究、企画運営、国際交流、スポーツなどの活動記録です。分野とキーワードで検索できます。"
      : "Records of research, event organization, international exchange, sport, and other activities. Filter by category or search by keyword.";
  const archivePage = `<main id="main" class="archive-page wrap"><a class="back-link" href="${home}#beyond">← ${L.home}</a><div class="archive-hero"><p class="eyebrow">ACTIVITY ARCHIVE / ${archiveCount} ENTRIES</p><h1>${archiveName}<span class="blue">.</span></h1><p>${archiveIntro}</p></div><div class="archive-controls" hidden><div class="archive-search"><label for="archive-search">${lang === "ja" ? "検索" : "Search"}</label><input type="search" id="archive-search" placeholder="${lang === "ja" ? "例：宇宙、インド、2021" : "Try space, India, 2021"}" autocomplete="off"><button type="button" class="filter-button" data-reset-search>${lang === "ja" ? "リセット" : "Reset"}</button></div><div class="filters" role="group" aria-label="${lang === "ja" ? "活動の分野" : "Activity categories"}"><button class="filter-button" data-archive-filter="all" aria-pressed="true">${lang === "ja" ? "すべて" : "All"}</button>${archiveGroups.map((g) => `<button class="filter-button" data-archive-filter="${g.id}" aria-pressed="false">${esc(T(g.title))}</button>`).join("")}</div></div><p id="archive-count" class="mono" role="status" aria-live="polite" aria-atomic="true" data-unit="${lang === "ja" ? "件の記録" : "entries"}">${archiveCount} ${lang === "ja" ? "件の記録" : "entries"}</p><p id="archive-empty" hidden>${lang === "ja" ? "該当する記録はありません。キーワードを変えるか、リセットしてください。" : "No matching entries. Try a different term or reset the filters."}</p>${archiveGroups.map((g) => `<section class="archive-group" id="${g.id}"><h2>${esc(T(g.title))}</h2>${g.entries.map(([date, en, ja, enText, jaText, event], i) => `<details class="archive-entry" id="${g.id}-${i + 1}" data-category="${g.id}"><summary><span class="mono">${date === "School years" && lang === "ja" ? "中学時代" : esc(date)}</span><span>${esc(lang === "ja" ? ja : en)}</span><span class="plus" aria-hidden="true">＋</span></summary><p>${esc(lang === "ja" ? jaText : enText)}</p>${event ? eventPhotos(event) + `<p class="event-source">${ext(event.url, lang === "ja" ? "イベント公式サイト" : "Official event page")}</p>` : ""}</details>`).join("")}</section>`).join("")}<div class="archive-callout"><p>${lang === "ja" ? "現在の研究と開発の詳細はこちら。" : "Details of current research and software projects."}</p><a href="${home}#research">${L.allWork} ${arrow}</a></div></main>`;
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
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2854d8"/><g fill="none" stroke="#f5f4ee" stroke-width="2"><circle cx="32" cy="32" r="13"/><ellipse cx="32" cy="32" rx="28" ry="9" transform="rotate(-35 32 32)"/></g><circle cx="51" cy="17" r="4" fill="#f5f4ee"/></svg>',
);
const paths = [
  "",
  "index-ja.html",
  "cv.html",
  "cv-ja.html",
  "archive.html",
  "archive-ja.html",
  ...projects.flatMap((p) => [
    `research/${p.id}.html`,
    `research/${p.id}-ja.html`,
  ]),
];
await writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>https://taichi-u.github.io/${p}</loc><lastmod>${profile.updated}</lastmod></url>`).join("")}</urlset>\n`,
);
await writeFile(
  "robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://taichi-u.github.io/sitemap.xml\n",
);
await writeFile(".nojekyll", "");
console.log(`Built ${paths.length} static pages in English and Japanese.`);
