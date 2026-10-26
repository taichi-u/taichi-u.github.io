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
    caption: ["Longyearbyen Airport, March 2025.", "ロングイェールビーン空港。2025年3月。"],
  },
  {
    id: "dfki-visit", file: "gallery/dfki-visit", width: 1054, height: 1406,
    categories: ["research"],
    title: ["Studying abroad at DFKI", "DFKI留学"],
    caption: ["Research stay at DFKI in Bremen, Germany. Robot arm control.", "ドイツ・ブレーメン。ロボットアーム制御の研究留学。"],
  },
  {
    id: "fujiwara-bento", file: "gallery/fujiwara-bento", width: 1800, height: 1350,
    categories: ["travel", "interests"],
    title: ["Homemade bento at Fujiwara-kyō", "手作り弁当と藤原京"],
    caption: ["Homemade bento among the cosmos flowers at Fujiwara-kyō, Nara.", "奈良・藤原京のコスモス畑と、手作り弁当。"],
  },
  {
    id: "georgia-tech-presentation", file: "gallery/georgia-tech-presentation", width: 1800, height: 1013,
    categories: ["research"],
    title: ["Presentation at Georgia Tech", "ジョージア工科大学での発表"],
    caption: ["A metagenomics presentation during my research stay at Georgia Tech.", "ジョージア工科大学への留学中。メタゲノム解析の研究発表。"],
  },
  {
    id: "germany-beer-currywurst", file: "gallery/germany-beer-currywurst", width: 1350, height: 1800,
    categories: ["travel", "interests"],
    title: ["Beer and currywurst", "ビールとカレーブルスト"],
    caption: ["Germany. Beer and currywurst.", "ドイツで、ビールとカレーブルスト。"],
  },
  {
    id: "bayern-match", file: "gallery/bayern-match", width: 1350, height: 1800,
    categories: ["travel", "interests"],
    title: ["A Bayern Munich match", "バイエルンの試合観戦"],
    caption: ["A Bayern Munich Bundesliga match at the Allianz Arena.", "アリアンツ・アレーナ。ブンデスリーガのバイエルン戦。"],
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
    caption: ["A protein vending machine in Singapore.", "シンガポールのプロテイン自販機。"],
  },
  {
    id: "bremen-walk", file: "gallery/bremen-walk", width: 1350, height: 1800,
    categories: ["travel", "research"],
    title: ["Walking around Bremen", "ブレーメンの街歩き"],
    caption: ["Pig sculptures in Bremen, during my stay at DFKI.", "DFKI留学中。ブレーメンの豚の像。"],
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
    caption: ["Underwater, on a dive.", "ダイビング中。"],
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
    caption: ["Taichi Uchida", "内田 大智"],
  },
];
