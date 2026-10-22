import { profile } from "../content/portfolio.mjs";

export const siteUrl = "https://taichi-u.github.io/";
// Public ownership token issued by Google Search Console. Keep after verification.
export const googleSiteVerification = "PpFXY3Ypbb2u1JRY7zz0Ehhoq-f4ba2DmgiuYslPvIM";
export const canonicalUrl = (path = "") =>
  new URL(path === "index.html" ? "" : path, siteUrl).href;

export function languageAlternates(lang, path, other) {
  const en = canonicalUrl(lang === "en" ? path : other);
  const ja = canonicalUrl(lang === "ja" ? path : other);
  return { en, ja, "x-default": en };
}

export function structuredData({ lang, path, title, description }) {
  const url = canonicalUrl(path);
  const localized = (values) => values[lang === "ja" ? 1 : 0];
  const isProfile = /^(index|cv)(-ja)?\.html$/.test(path);
  const isCollection = /^(gallery|archive)(-ja)?\.html$/.test(path);
  const personId = `${siteUrl}#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: "Taichi Uchida",
        alternateName: ["内田 大智", "内田大智"],
        inLanguage: ["en", "ja"],
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: localized(profile.name),
        alternateName: [...profile.name, "内田大智"].filter(name => name !== localized(profile.name)),
        url: siteUrl,
        image: canonicalUrl("assets/images/portrait.webp"),
        description: localized(profile.intro),
        affiliation: { "@type": "CollegeOrUniversity", name: "Kyoto University", alternateName: "京都大学" },
        sameAs: ["https://github.com/taichi-u", "https://www.linkedin.com/in/taichi-uchida"],
        knowsAbout: ["Astrodynamics", "Space robotics", "Optimal control", "Machine learning"],
      },
      {
        "@type": isProfile ? "ProfilePage" : isCollection ? "CollectionPage" : "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: lang,
        isPartOf: { "@id": `${siteUrl}#website` },
        author: { "@id": personId },
        ...(isProfile ? { mainEntity: { "@id": personId } } : {}),
      },
    ],
  };
}
