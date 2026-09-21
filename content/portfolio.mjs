// Public portfolio content. Keep application-specific CVs and private contact details outside this repository.
// Localized values are [English, Japanese]. Use factual descriptions and descriptive headings; see docs/writing-guidelines.md.
import { codexHackathon } from "./events.mjs";

export const profile = {
  name: ["Taichi Uchida", "内田 大智"],
  email: "uchida.taichi.84f@st.kyoto-u.ac.jp",
  updated: "2026-09-21",
  intro: [
    "Fourth-year aerospace engineering student at Kyoto University, researching mission design, trajectory optimization, and robotics.",
    "京都大学 工学部物理工学科 宇宙基礎工学コースの学部4年生。ミッション設計、軌道最適化、ロボティクスを研究しています。",
  ],
  about: [
    "I research mission design and low-thrust trajectory optimization at JAXA ISAS, and learning-based control and lunar robotics at Kyoto University.",
    "JAXA宇宙科学研究所でミッション設計と低推力軌道最適化、京都大学で学習モデルを用いた制御と月面ロボットの研究に取り組んでいます。",
  ],
  about2: [
    "My previous work includes robot arm control at DFKI in Germany, metagenomic analysis at Georgia Tech in the United States, and halophilic archaea research at Tokyo Tech’s Earth-Life Science Institute.",
    "これまでに、ドイツのDFKIでロボットアームの制御、米国のジョージア工科大学でメタゲノム解析、東京工業大学地球生命研究所で好塩性古細菌の研究を経験しました。",
  ],
  next: [
    "Planning to join the five-year doctoral program in Space and Astronautical Science at SOKENDAI in April 2027, in Naoya Ozaki’s Mission Design Lab.",
    "2027年4月より、総合研究大学院大学 先端学術院 先端学術専攻 宇宙科学コースの5年一貫博士課程、尾崎直哉研究室（Mission Design Lab）に進学予定です。",
  ],
};

export const projects = [
  {
    id: "mission-design",
    category: ["space"],
    org: "JAXA / ISAS",
    date: "2025.08 —",
    visual: "orbit",
    title: [
      "Outer-planet mission design and trajectory optimization",
      "外惑星探査のミッション設計と軌道最適化",
    ],
    subtitle: [
      "Small probes and low-thrust trajectories",
      "超小型探査機・低推力軌道",
    ],
    summary: [
      "Multi-point observations with small outer-planet probes, and low-thrust trajectory optimization with Julia and DDP.",
      "超小型外惑星探査機による多点同時観測のミッション設計と、Julia・DDPを用いた低推力軌道最適化。",
    ],
    role: [
      "Research intern · Naoya Ozaki Lab",
      "テクニカル研修生・尾崎直哉研究室",
    ],
    question: [
      "Design trajectories for small probes to reach the outer planets and make simultaneous observations from multiple locations.",
      "超小型探査機による外惑星での多点同時観測に向け、ミッションと軌道を設計する。",
    ],
    work: [
      [
        "Analyze mission architectures for small probes sharing launches with large overseas missions.",
        "海外大型ミッションへの相乗りを想定した、超小型外惑星探査機のミッションと軌道を解析。",
      ],
      [
        "Develop low-thrust trajectory optimization methods using Julia and differential dynamic programming (DDP).",
        "Juliaと微分動的計画法（DDP）を用いて、低推力探査機の軌道最適化手法を開発。",
      ],
      [
        "Investigate HDDP for low-thrust transfers from GTO to GEO.",
        "GTOからGEOへの低推力軌道遷移におけるHDDPを用いた最適化を研究。",
      ],
    ],
    outcome: [
      "Oral presentation at SPS 2026 (March 2026). A paper on HDDP-based low-thrust optimization was submitted to the 70th UKAREN in August 2026.",
      "2026年3月の惑星圏シンポジウム（SPS 2026）で口頭発表。HDDPによる低推力軌道最適化の論文を第70回宇宙科学技術連合講演会へ2026年8月に投稿（投稿段階）。",
    ],
    tags: ["Julia", "DDP / HDDP", "Astrodynamics"],
    photo: "isas",
    photoAlt: ["At JAXA ISAS", "JAXA宇宙科学研究所にて"],
  },
  {
    id: "learning-control",
    category: ["robotics"],
    org: "KYOTO UNIVERSITY",
    date: "2026.04 —",
    visual: "control",
    title: [
      "Model predictive control with a Transformer",
      "Transformerを用いたモデル予測制御",
    ],
    subtitle: [
      "Transformer × nonlinear model predictive control",
      "Transformer × 非線形モデル予測制御",
    ],
    summary: [
      "A Transformer-based dynamics model integrated with nonlinear MPC for real-time autonomous tracking on an RC car.",
      "Transformerで同定したモデルと非線形モデル予測制御を組み合わせ、ラジコンカーの実時間自動追従を実機に実装。",
    ],
    role: [
      "Undergraduate researcher · Kenji Fujimoto Lab",
      "学部研究・藤本健治研究室（制御工学分野）",
    ],
    question: [
      "Use a learned dynamics model in nonlinear model predictive control for real-time tracking on an RC car.",
      "学習した動的モデルを非線形モデル予測制御に組み込み、ラジコンカーの実時間自動追従を実装する。",
    ],
    work: [
      [
        "Build a predictive dynamics model using a Transformer.",
        "Transformerを用いてシステムの予測モデルを同定。",
      ],
      [
        "Integrate the learned model into nonlinear model predictive control.",
        "学習済みモデルを非線形モデル予測制御（NMPC）へ統合。",
      ],
      [
        "Implement real-time autonomous tracking on a physical RC car.",
        "ラジコンカーを用いた実時間自動追従を実機に実装。",
      ],
    ],
    outcome: [
      "Implemented a Transformer-based predictive model and nonlinear model predictive control on a physical RC car.",
      "Transformerによる予測モデルと非線形モデル予測制御を、ラジコンカーの実機に実装。",
    ],
    tags: ["Transformer", "NMPC", "System identification"],
  },
  {
    id: "lunar-robotics",
    category: ["robotics", "space"],
    org: "KYOTO UNIVERSITY",
    date: "2025.10 —",
    visual: "lunar",
    title: [
      "Reinforcement learning and control for lunar robots",
      "月面ロボットの強化学習と制御",
    ],
    subtitle: ["Modular multi-legged robots", "多脚モジュールロボット"],
    summary: [
      "Reinforcement learning, inverse kinematics, and sim-to-real environments for modular multi-legged lunar robots.",
      "月面探査用の多脚モジュールロボットを対象に、強化学習・逆運動学・Sim-to-Real環境を研究。",
    ],
    role: [
      "Research assistant · Learning Machines Group",
      "研究補助・学習機械制御論分野（森本研究室）",
    ],
    question: [
      "Develop motion control for modular multi-legged lunar robots and evaluate transfer from simulation to physical hardware.",
      "月面探査用の多脚モジュールロボットの動作制御と、シミュレーションで学習した方策の実機への適用を検討する。",
    ],
    work: [
      [
        "Design reward functions and curriculum learning for modular lunar robots.",
        "月面探査ロボットの報酬関数とカリキュラム学習を設計。",
      ],
      [
        "Implement inverse kinematics and system identification; build sim-to-real environments.",
        "逆運動学・システム同定を実装し、Sim-to-Real環境を構築。",
      ],
      [
        "Compare model predictive control and reinforcement learning for redundant robotic systems.",
        "冗長系を対象としたモデル予測制御と強化学習を比較。",
      ],
    ],
    outcome: [
      "Developed reward functions, inverse kinematics, and sim-to-real environments. The research also compares model predictive control with reinforcement learning.",
      "報酬関数・逆運動学・Sim-to-Real環境を開発。モデル予測制御と強化学習の比較にも取り組んでいます。",
    ],
    tags: ["Python", "Isaac Lab", "Sim-to-Real"],
  },
  {
    id: "space-robot-arm",
    category: ["robotics", "space"],
    org: "DFKI · BREMEN",
    date: "2025.02 — 2025.04",
    visual: "photo",
    image: "robot-arm",
    title: ["7-DOF robot arm control", "7自由度ロボットアームの制御"],
    subtitle: [
      "Impedance and position control with Drake",
      "Drakeによるインピーダンス制御・位置制御",
    ],
    summary: [
      "Simulation environments and impedance / position controllers for a 7-DOF arm, with space-debris capture as the research context.",
      "宇宙デブリ捕獲を背景に、7自由度アームの物理シミュレーション環境とインピーダンス・位置制御器を開発。",
    ],
    role: [
      "Visiting research fellow · Robotics Innovation Center",
      "客員研究員・ロボティクス・イノベーション・センター",
    ],
    question: [
      "Develop robot arm controllers that account for contact with an object, in the context of spacecraft capture and debris removal.",
      "宇宙機捕獲・デブリ除去を背景に、対象物との接触を考慮したロボットアームの制御器を開発する。",
    ],
    work: [
      [
        "Build physics-based simulation environments for a 7-DOF robotic arm using Drake.",
        "Drakeを用いて7自由度ロボットアームの物理シミュレーション環境を構築。",
      ],
      [
        "Implement impedance and position controllers.",
        "インピーダンス制御器・位置制御器を実装。",
      ],
      [
        "Conduct research in Bremen through the fully funded Nakatani Foundation scholarship.",
        "中谷財団の全額給付型奨学金により、ドイツ・ブレーメンで研究。",
      ],
    ],
    outcome: [
      "Built a Drake simulation environment for a 7-DOF robot arm and implemented impedance and position controllers.",
      "Drakeによる7自由度アームのシミュレーション環境を構築し、インピーダンス制御器と位置制御器を実装。",
    ],
    tags: ["Drake", "Impedance control", "Robotics"],
    photo: "dfki",
    photoAlt: ["At DFKI in Bremen, Germany", "ドイツ・ブレーメンのDFKIにて"],
  },
  {
    id: "athletics-app",
    category: ["software"],
    org: "KYOTO UNIVERSITY · TRACK & FIELD",
    date: "2025 —",
    visual: "track",
    title: [
      "Athletics record management web app",
      "陸上競技の記録管理Webアプリ",
    ],
    subtitle: [
      "Kyoto University Medical School Track & Field Team",
      "京都大学医学部陸上部",
    ],
    summary: [
      "A custom React and Firebase application for the Kyoto University Medical School Track & Field Team.",
      "京都大学医学部陸上部に向けて、React・Firebaseによる競技記録管理アプリを設計・開発・運用。",
    ],
    role: ["Lead developer & system administrator", "開発・システム管理"],
    question: [
      "Replace the team’s Excel-based record entry and website-update workflow with an application that can be maintained without a permanent technical specialist.",
      "Excelへの記録入力とホームページ更新を、専任の技術者がいない部でも保守・運用できるWebアプリに移行する。",
    ],
    work: [
      [
        "Build a custom record management application with React, JavaScript, and Firebase.",
        "React・JavaScript・Firebaseを用いて記録管理アプリを開発。",
      ],
      [
        "Design the interface around the needs of team members.",
        "部員の使いやすさを意識してUIを設計。",
      ],
      [
        "Automate data aggregation and maintain the cloud deployment.",
        "データ集計の自動化とクラウド上での運用を担当。",
      ],
    ],
    outcome: [
      "Currently in trial use within the team. I continue to improve it based on member feedback, with maintainability and reliable operation as priorities.",
      "現在は部内で試用中。利用者のフィードバックを反映し、保守性と安定した運用を重視して改善しています。",
    ],
    tags: ["React", "Firebase", "JavaScript"],
  },
  {
    id: "russian-nlp",
    category: ["software"],
    org: "TLEEZ INC.",
    date: "2025.03 —",
    visual: "language",
    title: ["Russian grammatical error correction", "ロシア語の文法誤り訂正AI"],
    subtitle: ["Natural language processing", "自然言語処理・文法誤り訂正"],
    summary: [
      "AI-based grammatical error correction and training data generation for Russian language learning.",
      "ロシア語学習を支援する文法誤り訂正AIと、学習データ生成に取り組むエンジニアインターン。",
    ],
    role: ["Software engineer intern", "自然言語処理エンジニア インターン"],
    question: [
      "Develop an AI system that identifies and corrects grammatical errors in Russian text, along with the training data it requires.",
      "ロシア語の文章に含まれる文法上の誤りを検出・訂正するAIと、その学習に必要なデータを開発する。",
    ],
    work: [
      [
        "Develop grammatical error correction systems for Russian.",
        "ロシア語の文法誤り訂正AIを開発。",
      ],
      [
        "Generate training data using Python and NLP tools.",
        "Pythonと自然言語処理ツールを用いた学習データ生成。",
      ],
    ],
    outcome: [
      "Developing grammatical error correction models and generating training data as a software engineering intern at Tleez.",
      "株式会社Tleezのエンジニアインターンとして、文法誤り訂正モデルの開発と学習データ生成を担当しています。",
    ],
    tags: ["Python", "NLP", "Machine learning"],
  },
  {
    id: "metagenomics",
    category: ["life"],
    org: "GEORGIA TECH",
    date: "2024.08 —",
    visual: "photo",
    image: "presentation",
    title: [
      "Metagenomic analysis of microbial communities",
      "微生物群集のメタゲノム解析",
    ],
    subtitle: [
      "Bioinformatics & environmental research",
      "バイオインフォマティクス・環境研究",
    ],
    summary: [
      "Metagenomic analysis of microbial communities involved in heavy metal contaminant stabilization.",
      "重金属汚染物質の安定化に関わる微生物群集を、メタゲノムデータと統計解析から調べる。",
    ],
    role: [
      "Visiting research fellow · DiChristina Lab",
      "客員研究員・DiChristina研究室",
    ],
    question: [
      "Analyze microbial communities involved in heavy metal stabilization and examine their responses to Fe(III), sulfate, and pH buffer additions.",
      "重金属汚染物質の安定化に関わる微生物群集を解析し、Fe(III)・硫酸塩・pHバッファの添加による影響を調べる。",
    ],
    work: [
      [
        "Process metagenomic datasets using Python, R, and Linux.",
        "Python・R・Linuxを用いてメタゲノムデータを処理。",
      ],
      [
        "Apply statistical analysis to microbial communities involved in contaminant stabilization.",
        "汚染物質の安定化に関与する微生物群集を統計解析。",
      ],
      [
        "Visit Georgia Tech in August–September 2024 through a Nakatani Foundation scholarship, followed by remote research.",
        "中谷財団の奨学生として2024年8〜9月に現地滞在し、その後リモートで研究。",
      ],
    ],
    outcome: [
      "Analyzed changes in microbial communities and investigated a possible role of organic sulfur shuttles in metal reduction. This remains a research hypothesis. Research continued remotely after the visit.",
      "微生物群集の変化を解析し、金属還元に有機硫黄シャトルが関与する可能性を検討。現時点では研究上の仮説です。現地滞在後もリモートで研究を継続しています。",
    ],
    tags: ["Python / R", "Metagenomics", "Linux"],
    photo: "presentation",
    photoAlt: [
      "Presenting research at Georgia Tech",
      "ジョージア工科大学での研究発表",
    ],
  },
  {
    id: "astrobiology",
    category: ["life", "space"],
    org: "TOKYO TECH · ELSI",
    date: "2020.12 — 2023.03",
    visual: "life",
    title: [
      "Isolation and identification of halophilic archaea",
      "岩塩中の好塩性古細菌の単離・同定",
    ],
    subtitle: [
      "Extreme halophiles & astrobiology",
      "極限環境微生物・宇宙生物学",
    ],
    summary: [
      "Isolation, identification, and phylogenetic analysis of halophilic archaea in rock salt from around the world.",
      "世界各地の岩塩から好塩性古細菌を単離し、DNA解析と分子系統解析を実施。",
    ],
    role: [
      "Research intern · Kosuke Fujishima Lab",
      "研究インターン・藤島皓介研究室",
    ],
    question: [
      "Isolate microorganisms from rock salt and identify them using DNA sequences and phylogenetic analysis.",
      "岩塩から微生物を単離し、DNA配列と分子系統解析によって種類や系統関係を調べる。",
    ],
    work: [
      [
        "Isolate halophilic archaea and perform DNA extraction, PCR, electrophoresis, and sequencing.",
        "好塩性古細菌の単離・DNA抽出・PCR・電気泳動・シーケンス解析を実施。",
      ],
      [
        "Construct molecular phylogenetic trees with PhyML.",
        "PhyMLによる分子系統樹を構築。",
      ],
      [
        "Conduct wet-lab research at ELSI with JST support.",
        "JSTの支援のもと、東京工業大学地球生命研究所でウェットラボ研究。",
      ],
    ],
    outcome: [
      "Identified five species from eight colonies in one analysis. Presented at JpGU 2022 and received an Award for Academic Excellence in the high school session.",
      "8個のコロニーから5種の生物を確認。JpGU 2022の高校生セッションで発表し、優秀賞を受賞。",
    ],
    tags: ["PCR", "PhyML", "Astrobiology"],
  },
];

export const education = [
  [
    "2027.04",
    ["SOKENDAI · Planned enrollment", "総合研究大学院大学・進学予定"],
    [
      "Five-year doctoral program, Space and Astronautical Science. Graduate Institute for Advanced Studies. Naoya Ozaki’s Mission Design Lab.",
      "先端学術院 先端学術専攻 宇宙科学コース・5年一貫博士課程。尾崎直哉研究室（Mission Design Lab）。",
    ],
  ],
  [
    "2023.04 — 2027.03",
    ["Kyoto University", "京都大学"],
    [
      "Fourth-year undergraduate in Engineering Science (Aerospace Engineering). Graduation expected March 2027.",
      "工学部物理工学科 宇宙基礎工学コース・学部4年生。2027年3月卒業見込。",
    ],
  ],
  [
    "2020 — 2023",
    ["Seiko Gakuin High School", "聖光学院高等学校"],
    ["Kanagawa, Japan", "神奈川県横浜市"],
  ],
  [
    "2018 — 2020",
    ["Pathways School Gurgaon", "Pathways School Gurgaon"],
    [
      "IB Middle Years Programme · Haryana, India",
      "IB Middle Years Programme・インド ハリヤナ州",
    ],
  ],
  [
    "2017 — 2018",
    ["Seiko Gakuin Junior High School", "聖光学院中学校"],
    ["Kanagawa, Japan", "神奈川県横浜市"],
  ],
];

export const publications = [
  [
    "2026.08",
    ["Paper submitted", "論文投稿"],
    [
      "HDDP-based trajectory optimization for low-thrust GTO-to-GEO transfers",
      "GTOからGEOへの低推力軌道遷移におけるHDDPを用いた軌道最適化",
    ],
    "70th UKAREN",
    "",
  ],
  [
    "2026.03",
    ["Oral presentation", "口頭発表"],
    [
      "Mission design for multi-point simultaneous observations by ultra-small outer-planet probes on large overseas missions",
      "海外大型ミッション相乗りを想定した超小型外惑星探査機の多点同時観測のミッション設計",
    ],
    "SPS 2026",
    "https://pparc.tohoku.ac.jp/sympo/sps/archive/sps2026/",
  ],
  [
    "2023.11",
    ["Oral & poster", "口頭・ポスター発表"],
    [
      "Space medicine education in Japan",
      "日本における宇宙医学教育の現状と展望",
    ],
    "69th JSAEM",
    "",
  ],
  [
    "2022.05",
    ["Poster · Award", "ポスター発表・優秀賞"],
    [
      "Isolation and identification of extreme halophiles from global rock salts",
      "世界各地の岩塩からの高度好塩菌の単離と同定",
    ],
    "JpGU 2022",
    "",
  ],
  [
    "2022.06",
    ["Online presentation", "オンライン発表"],
    [
      "Extreme halophiles from global rock salts",
      "世界各地の岩塩からの極限環境微生物の分離同定",
    ],
    "NASA × AGI × High School Students",
    "",
  ],
  [
    "2022.03",
    ["Online presentation", "オンライン発表"],
    ["Research on extreme halophiles", "極限環境微生物研究"],
    "Japanese Society of Scientific Fisheries",
    "",
  ],
  [
    "2022.01",
    ["Online presentation", "オンライン発表"],
    [
      "Meteorite composition analysis with electron microscopy",
      "電子顕微鏡による隕石組成分析",
    ],
    "International Research for School",
    "",
  ],
];

export const awards = [
  [
    "2025",
    [
      "Startup Weekend Space Osaka · 2nd place",
      "Startup Weekend Space Osaka・準優勝",
    ],
    [
      "Team leader; business plan and prototype in 54 hours.",
      "チームリーダーとして54時間で事業案とプロトタイプを開発。",
    ],
  ],
  [
    "2024–25",
    ["Nakatani Foundation Scholarship", "中谷財団 海外留学奨学金"],
    [
      "Fully funded research at Georgia Tech and DFKI.",
      "ジョージア工科大学・DFKIへの研究派遣（全額給付）。",
    ],
  ],
  [
    "2022",
    [
      "JpGU Award for Academic Excellence",
      "日本地球惑星科学連合 高校生セッション優秀賞",
    ],
    ["Research on halophilic archaea.", "好塩性古細菌の研究。"],
  ],
  [
    "2022",
    [
      "Japanese Society of Scientific Fisheries Award",
      "日本水産学会 高校生優秀発表賞",
    ],
    ["Extreme halophiles research.", "極限環境微生物の研究。"],
  ],
  [
    "2022",
    ["SDGs Tankyu Award · Nihon Ryoko Prize", "SDGs探究アワード・日本旅行賞"],
    [
      "Founded and organized Seiko SDGs Food Ambassador.",
      "Seiko SDGs Food Ambassadorの創設・運営。",
    ],
  ],
  [
    "2021",
    [
      "Intelligent Water Rocket · Missions Award",
      "知能化水ロケット競技会 ミッション賞",
    ],
    ["Completed all competition missions.", "競技会の全ミッションを達成。"],
  ],
  [
    "2021",
    ["SSH Research Symposium Award", "SSH生徒研究発表会 優秀賞"],
    ["Artificial gravity research.", "人工重力機構の研究。"],
  ],
  [
    "2021",
    [
      "Yurikamome Relay Marathon · Overall winner",
      "ゆりかもめリレーマラソン・総合優勝",
    ],
    ["Team competition.", "チームでの総合優勝。"],
  ],
  [
    "2019",
    ["ISSO National Games · Three golds", "ISSO全国大会・3種目優勝"],
    [
      "1st in 800m, 1500m, and 3000m in India.",
      "インドで800m・1500m・3000mの3種目優勝。",
    ],
  ],
];

export const activities = [
  [codexHackathon.date, codexHackathon.title, codexHackathon.summary],
  [
    "2026.03",
    ["JENESYS2025 · Japan–Korea exchange", "JENESYS2025・日韓青少年交流訪韓団"],
    [
      "Selected delegate for an international cultural exchange program.",
      "外務省・日韓文化交流基金のプログラムに派遣団員として参加。",
    ],
  ],
  [
    "2025.05",
    [
      "Interpreting at the Kyoto International Music Students Festival",
      "京都・国際音楽学生フェスティバルでの通訳",
    ],
    [
      "English–Japanese interpreter and liaison at the Kyoto International Music Students Festival.",
      "京都・国際音楽学生フェスティバルで、海外音楽家の英日通訳とアテンドを担当。",
    ],
  ],
  [
    "2023 —",
    ["Mathematics instructor at Tetsuryokukai", "鉄緑会 数学講師"],
    [
      "Advanced mathematics instructor at Tetsuryokukai.",
      "鉄緑会で難関大学志望の高校生に数学を指導。",
    ],
  ],
  [
    "2021",
    ["Japan Students Space Forum", "日本学生宇宙フォーラム"],
    [
      "Founded and organized a forum with more than 100 participants.",
      "100名以上が参加するフォーラムを創設・企画運営。",
    ],
  ],
  [
    "2021",
    ["Seiko SDGs Food Ambassador", "聖光SDGs食アンバサダー"],
    [
      "Founded a project supporting regional producers through a school festival.",
      "文化祭での地域産品の販売を通じて生産者・観光を支援する活動を創設。",
    ],
  ],
  [
    "School years",
    ["The “Yokohama Banana” project", "「横浜バナナ」プロジェクト"],
    [
      "Founded and managed a venture that sold 3,800 chocolate bananas over two days.",
      "プロジェクトを創設・運営し、2日間で3,800本のチョコバナナを販売。",
    ],
  ],
  [
    "2025 / 2023",
    ["Space medicine & Moon Village", "宇宙医学・Moon Village"],
    [
      "Staff at the 71st JSAEM and 7th Global Moon Village Workshop; organized a university space medicine study tour.",
      "第71回日本宇宙航空環境医学会・第7回Global Moon Village Workshopの運営、大学生向け宇宙医学ツアーの企画。",
    ],
  ],
  [
    "2012 —",
    ["Rice farming & Shorinji Kempo", "稲作と少林寺拳法"],
    [
      "Long-term participation in organic rice farming; competed at the national junior-high Shorinji Kempo championship.",
      "有機稲作への継続的な参加。少林寺拳法では全国中学生大会に出場。",
    ],
  ],
  [
    "2021 / 2019",
    ["Science & international exchange", "科学と国際交流"],
    [
      "Founded the Science Club Summit; organized India–Japan student discussions and a Japanese calligraphy event.",
      "科学部サミットを創設。日印学生交流の企画や、インドでの書道体験イベントを運営。",
    ],
  ],
  [
    "2021",
    ["Legislative internship", "議員インターン"],
    [
      "ICAS program at the Tokyo Metropolitan Assembly.",
      "ICASプログラムで東京都議会の議員インターンに参加。",
    ],
  ],
];

export const earlierResearch = [
  [
    "2023.09 — 2024.08",
    ["Microbial metabolism · Kyoto University", "微生物代謝研究・京都大学"],
    [
      "Wet-lab research on hydrogen and oxygen utilization at the Atomi Lab.",
      "跡見研究室で、水素・酸素の利用に関する微生物代謝のウェットラボ研究。",
    ],
  ],
  [
    "2021.08 — 2022.02",
    ["Meteorite analysis · Seiko Gakuin", "隕石分析・聖光学院"],
    [
      "SEM-based composition analysis with UK schools and university researchers.",
      "電子顕微鏡（SEM）による組成分析。英国の高校・大学教員との国際共同研究。",
    ],
  ],
  [
    "2020.08 — 2021.08",
    ["Artificial gravity · Seiko Gakuin", "人工重力機構・聖光学院"],
    [
      "Prototyped a mechanism and built Arduino-based force sensors for evaluation.",
      "新規機構を試作し、Arduinoを用いた力センサーを設計・実装して評価。",
    ],
  ],
  [
    "2021",
    ["Intelligent water rocket", "知能化水ロケット"],
    [
      "A rocket with computer-controlled functions and automated parachute deployment.",
      "コンピュータ制御機能と自動パラシュート展開機構を備えたロケットを開発。",
    ],
  ],
];

export const media = [
  [
    "2023.03",
    ["Weekly Asahi", "週刊朝日"],
    ["Interview · March 24 issue", "インタビュー・3月24日号"],
    "",
  ],
  [
    "2022.05",
    ["TELSTAR Space Magazine", "宇宙フリーマガジン TELSTAR"],
    ["Contributed article", "記事寄稿"],
    "https://spacemgz-telstar.com/article/feature/a332",
  ],
  [
    "2021.11",
    ["TBS Radio · High School A go go", "TBSラジオ・High School A go go"],
    ["Guest speaker", "ゲスト出演"],
    "https://www.tbsradio.jp/articles/detail/?id=46518",
  ],
  [
    "2021.09",
    ["Mainichi Shimbun", "毎日新聞・15歳のニュース"],
    ["Interview", "インタビュー"],
    "https://mainichi.jp/maisho15/articles/20210918/dbg/048/040/004000c",
  ],
  [
    "2021.01",
    ["Koukousei Shimbun", "高校生新聞"],
    ["Interview", "インタビュー"],
    "https://www.koukouseishinbun.jp/articles/-/7255",
  ],
  [
    "2019.09",
    ["Kanagawa Shimbun H!P", "神奈川新聞 H!P"],
    ["Interview · Print", "インタビュー・紙面掲載"],
    "",
  ],
];

export const skills = [
  [["Programming", "プログラミング"], "Python · Julia · C++ · MATLAB · R · Go"],
  [
    ["Control & robotics", "制御・ロボティクス"],
    "DDP · NMPC · Drake · Pinocchio · MuJoCo · Isaac Lab · CasADi · ROS2",
  ],
  [
    ["Machine learning & web development", "機械学習・Web開発"],
    "PyTorch · React · Next.js · Firebase · Docker · Linux · Git",
  ],
  [["Life science", "生命科学"], "PCR · DNA extraction · PhyML · Metagenomics"],
  [
    ["Languages", "言語"],
    [
      "Japanese (native) · English (TOEFL iBT 100 / EIKEN Grade 1) · Russian (learning)",
      "日本語（母語）・英語（TOEFL iBT 100／英検1級）・ロシア語（学習中）",
    ],
  ],
  [
    ["Qualifications", "資格"],
    [
      "Model Rocket License Grade 4 · NAUI Open Water Diver · Driver’s license (AT)",
      "モデルロケットライセンス4級・NAUIオープンウォーターダイバー・普通自動車免許（AT限定）",
    ],
  ],
];
