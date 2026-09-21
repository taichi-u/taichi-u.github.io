import { codexHackathon } from "./events.mjs";

// Captions describe the supplied photos. Dates are included only when known.
export const galleryCategories = [
  { id: "research", title: ["Research & study abroad", "研究・留学"] },
  { id: "travel", title: ["Travel", "旅行"] },
  { id: "interests", title: ["Interests & daily life", "趣味・日常"] },
  { id: "events", title: ["Events", "イベント"] },
];

export const galleryPhotos = [
  {
    id: "svalbard-2025", file: "gallery/svalbard-2025", width: 1800, height: 1350,
    categories: ["travel"],
    title: ["Longyearbyen, Svalbard", "スバルバード・ロングイェールビーン"],
    caption: ["At the airport in Longyearbyen during a trip to Svalbard in March 2025.", "2025年3月、スバルバードへの旅行で訪れたロングイェールビーンの空港にて。"],
  },
  {
    id: "dfki-visit", file: "gallery/dfki-visit", width: 1054, height: 1406,
    categories: ["research"],
    title: ["Studying abroad at DFKI", "DFKI留学"],
    caption: ["At DFKI in Bremen, Germany, during my research stay on robot arm control.", "ロボットアーム制御の研究で滞在した、ドイツ・ブレーメンのDFKIにて。"],
  },
  {
    id: "fujiwara-bento", file: "gallery/fujiwara-bento", width: 1800, height: 1350,
    categories: ["travel", "interests"],
    title: ["Homemade bento at Fujiwara-kyō", "手作り弁当と藤原京"],
    caption: ["A homemade bento beside the cosmos fields at Fujiwara-kyō in Nara. I enjoy cooking and history.", "奈良・藤原京のコスモス畑で、手作りのお弁当。料理と歴史が好きです。"],
  },
  {
    id: "georgia-tech-presentation", file: "gallery/georgia-tech-presentation", width: 1800, height: 1013,
    categories: ["research"],
    title: ["Presentation at Georgia Tech", "ジョージア工科大学での発表"],
    caption: ["Presenting research on metagenomic analysis during my stay at Georgia Tech in the United States.", "米国のジョージア工科大学（GT）への留学中、メタゲノム解析の研究について発表。"],
  },
  {
    id: "germany-beer-currywurst", file: "gallery/germany-beer-currywurst", width: 1350, height: 1800,
    categories: ["travel", "interests"],
    title: ["Beer and currywurst", "ビールとカレーブルスト"],
    caption: ["Beer and currywurst in Germany. My favorite beer style is Weizen.", "ドイツで味わったビールとカレーブルスト。好きなビールのスタイルはバイツェンです。"],
  },
  {
    id: "bayern-match", file: "gallery/bayern-match", width: 1350, height: 1800,
    categories: ["travel", "interests"],
    title: ["A Bayern Munich match", "バイエルンの試合観戦"],
    caption: ["At the Allianz Arena in Germany for a Bayern Munich Bundesliga match.", "ドイツのアリアンツ・アレーナで、ブンデスリーガのバイエルン戦を観戦。"],
  },
  {
    id: "shorinji-kempo", file: "gallery/shorinji-kempo", width: 535, height: 535,
    categories: ["interests"],
    title: ["Shorinji Kempo", "少林寺拳法"],
    caption: ["Practicing Shorinji Kempo.", "少林寺拳法の練習風景。"],
  },
  {
    id: "singapore-protein", file: "gallery/singapore-protein", width: 604, height: 616,
    categories: ["travel", "interests"],
    title: ["Weight training and a trip to Singapore", "筋トレとシンガポール旅行"],
    caption: ["In front of a protein vending machine in Singapore. Weight training is one of my interests.", "シンガポールで見つけたプロテインの自販機前にて。筋トレも趣味の一つです。"],
  },
  {
    id: "bremen-walk", file: "gallery/bremen-walk", width: 1350, height: 1800,
    categories: ["travel", "research"],
    title: ["Walking around Bremen", "ブレーメンの街歩き"],
    caption: ["Pig sculptures encountered while walking around Bremen during my research stay at DFKI.", "DFKI留学中、ブレーメンの街歩きで出会った豚の像。"],
  },
  {
    id: "running", file: "running", width: 1000, height: 624,
    categories: ["interests"],
    title: ["Track & field", "陸上競技"],
    caption: ["Training on the athletics track.", "陸上競技のトレーニング風景。"],
  },
  {
    id: "isas", file: "isas", width: 750, height: 1000,
    categories: ["research"],
    title: ["JAXA ISAS", "JAXA宇宙科学研究所"],
    caption: ["At JAXA’s Institute of Space and Astronautical Science.", "JAXA宇宙科学研究所にて。"],
  },
  {
    id: "diving", file: "diving", width: 602, height: 616,
    categories: ["interests", "travel"],
    title: ["Diving", "ダイビング"],
    caption: ["An underwater photograph while diving.", "ダイビング中の水中写真。"],
  },
  ...codexHackathon.photos.map((photo) => ({
    id: photo.file, file: photo.file, width: 1500, height: 1001,
    categories: ["events"], title: photo.caption,
    caption: [
      `${codexHackathon.title[0]} · ${codexHackathon.date}. ${codexHackathon.summary[0]}`,
      `${codexHackathon.title[1]}（${codexHackathon.date}）。${codexHackathon.summary[1]}`,
    ],
  })),
  {
    id: "portrait", file: "portrait", width: 1000, height: 1000,
    categories: ["interests"],
    title: ["Profile photograph", "プロフィール写真"],
    caption: ["The photograph used on this website’s homepage.", "トップページに掲載しているプロフィール写真。"],
  },
];
