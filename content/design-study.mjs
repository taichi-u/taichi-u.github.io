// Preview copy: factual source remains portfolio.mjs / gallery.mjs.
export const copyChanges = [
  ['自己紹介','京都大学 工学部物理工学科 宇宙基礎工学コースの学部4年生。ミッション設計、軌道最適化、ロボティクスを研究しています。','京都大学 工学部4年。宇宙基礎工学コース。研究分野はミッション設計、軌道最適化、ロボティクス。','Fourth-year aerospace engineering student at Kyoto University, researching mission design, trajectory optimization, and robotics.','I’m a fourth-year aerospace engineering student at Kyoto University. My research covers mission design, trajectory optimization, and robotics.'],
  ['研究紹介','JAXA宇宙科学研究所でミッション設計と低推力軌道最適化、京都大学で学習モデルを用いた制御と月面ロボットの研究に取り組んでいます。','JAXA宇宙科学研究所：ミッション設計・低推力軌道最適化。京都大学：学習モデルを用いた制御・月面ロボット。','I research mission design and low-thrust trajectory optimization at JAXA ISAS, and learning-based control and lunar robotics at Kyoto University.','At JAXA ISAS, I work on mission design and low-thrust trajectory optimization. At Kyoto University, I study learning-based control and lunar robotics.'],
  ['研究一覧の導入','研究とソフトウェア開発の内容を、分野別に掲載しています。','削除。見出しと一覧で伝える。','Research and software development projects, organized by field.','Remove: the heading and project list already explain this.'],
  ['ビール','好きなビールのスタイルはバイツェンです。','好きなビール：バイツェン','My favorite beer style is Weizen.','Beer: Weizen'],
  ['スバルバード','2025年3月、スバルバードへの旅行で訪れたロングイェールビーンの空港にて。','ロングイェールビーン空港。2025年3月。','At the airport in Longyearbyen during a trip to Svalbard in March 2025.','Longyearbyen Airport, March 2025.'],
  ['藤原京','奈良・藤原京のコスモス畑で、手作りのお弁当。料理と歴史が好きです。','奈良・藤原京のコスモス畑と、手作り弁当。','A homemade bento beside the cosmos fields at Fujiwara-kyō in Nara. I enjoy cooking and history.','Homemade bento among the cosmos flowers at Fujiwara-kyō, Nara.'],
  ['DFKI','ロボットアーム制御の研究で滞在した、ドイツ・ブレーメンのDFKIにて。','ドイツ・ブレーメン。ロボットアーム制御の研究留学。','At DFKI in Bremen, Germany, during my research stay on robot arm control.','Research stay at DFKI in Bremen, Germany. Robot arm control.'],
  ['シンガポール','シンガポールで見つけたプロテインの自販機前にて。筋トレも趣味の一つです。','シンガポールのプロテイン自販機。','In front of a protein vending machine in Singapore. Weight training is one of my interests.','A protein vending machine in Singapore.'],
  ['ダイビング','ダイビング中の水中写真。','ダイビング中。','An underwater photograph while diving.','Underwater, on a dive.'],
  ['プロフィール写真','トップページに掲載しているプロフィール写真。','内田 大智','The photograph used on this website’s homepage.','Taichi Uchida'],
];
export const previewIntro = [copyChanges[0][4], copyChanges[0][2]];
export const previewAbout = [copyChanges[1][4], copyChanges[1][2]];
export const captionOverrides = {
  'svalbard-2025':[copyChanges[4][4],copyChanges[4][2]],
  'fujiwara-bento':[copyChanges[5][4],copyChanges[5][2]],
  'dfki-visit':[copyChanges[6][4],copyChanges[6][2]],
  'singapore-protein':[copyChanges[7][4],copyChanges[7][2]],
  diving:[copyChanges[8][4],copyChanges[8][2]],
  portrait:[copyChanges[9][4],copyChanges[9][2]],
  'germany-beer-currywurst':['Germany. Beer and currywurst.','ドイツで、ビールとカレーブルスト。'],
  'georgia-tech-presentation':['A metagenomics presentation during my research stay at Georgia Tech.','ジョージア工科大学への留学中。メタゲノム解析の研究発表。'],
  'bayern-match':['A Bayern Munich Bundesliga match at the Allianz Arena.','アリアンツ・アレーナ。ブンデスリーガのバイエルン戦。'],
  'bremen-walk':['Pig sculptures in Bremen, during my stay at DFKI.','DFKI留学中。ブレーメンの豚の像。'],
};
export const references = [
  {id:'koyama',lang:'日本語',name:'小山裕己',url:'https://koyama.xyz/index-j.html',facts:'顔写真と所属を並べ、略歴・研究分野・研究プロジェクトを明確な見出しで区分。日英のページがある。',take:'所属と研究分野を冒頭で把握できる構成、成果への直接リンク。',leave:'一画面の文字量と文献一覧の長さは、このサイトの情報量に合わせて減らす。'},
  {id:'tokuda',lang:'日本語',name:'徳田研究室',url:'https://glass1.net/?page_id=10',facts:'趣味や好物を具体的に列挙し、括弧書きに本人の補足がある。',take:'「好きなもの」を具体名で示す。趣味を抽象的な自己紹介に言い換えない。',leave:'冗談や打ち消し線まで真似しない。本人にない思い出を加えない。'},
  {id:'yamagata',lang:'日本語',name:'山形研究室',url:'https://yamagata-lab.fuis.u-fukui.ac.jp/about/',facts:'日本語の氏名・所属・学位と、研究者用の外部リンクを整理。自己紹介・研究内容・業績のナビゲーション。',take:'用途が分かる日本語の見出しとリンク。',leave:'研究室サイトの情報設計を個人サイトへそのまま移さない。'},
  {id:'taki',lang:'日本語',name:'たきつぼ',url:'https://taki-takitsubo.github.io/',facts:'本人の写真を冒頭に配置。制作物、自己紹介、ブログ、写真に分かれる。',take:'本人の写真と制作物を同じサイトで見せる構成。',leave:'大きな標語、写真上の長い文章、緑色の全面オーバーレイは採用しない。'},
  {id:'barron',lang:'英語',name:'Jon Barron',url:'https://jonbarron.info/',facts:'短いプロフィールとCVなどへのリンクの下に、画像と論文情報の行が続く。',take:'研究の題名・内容・成果を一覧で比較できる配置。',leave:'小さな本文や大量の文献をそのまま再現せず、スマートフォンでの読みやすさを優先。'},
  {id:'maggie',lang:'英語',name:'Maggie Appleton',url:'https://maggieappleton.com/',facts:'関心分野と、文章・図解などの実際のコンテンツがサイトの特徴になっている。',take:'中身に合わせて情報の大きさや見せ方を変える。',leave:'書体、挿絵、比喩、個人の語り口は借用しない。'},
  {id:'frank',lang:'英語',name:'Frank Chimero',url:'https://frankchimero.com/',facts:'冒頭は短いリンク一覧と広い余白。スタジオ、書籍、作品、自己紹介、アーカイブへ分岐。',take:'何へ進めるかを少ない言葉で示す。',leave:'研究内容が見えなくなるほど情報を削らない。小さな文字や低いコントラストは参考外。'},
  {id:'bruno',lang:'英語',name:'Bruno Simon',url:'https://bruno-simon.com/',facts:'3D空間を操作して進むポートフォリオ。操作案内と設定がある。',take:'入力にすぐ反応し、操作方法と解除方法が分かること。',leave:'ページ全体のゲーム化、音声、重い常時描画は今回の目的に合わない。'},
];
