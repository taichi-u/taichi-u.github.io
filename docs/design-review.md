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

## 2026-09-21: Typeset CVs and Codex hackathon

- The on-screen CV layout is preserved. Download and print links now use PDFs compiled with LuaLaTeX from the existing public content, with Libertinus for Latin text and Harano Aji for Japanese. Both CVs have three A4 pages, consistent date columns, section rules, embedded fonts, and page numbers.
- The print link opens the compiled PDF in a new tab. The links work without JavaScript; the browser's direct HTML printing also receives a serif fallback style.
- The event date and official title were checked against https://codex-student-hack-fes.openai.chatgpt.site/ (15 September 2026). Participation, WalkIsFun, the shaded-route service, the three-person team, and the PM role were supplied by Taichi. No award or ranking is inferred.
- Both supplied photos appear in the activities section and the archive; they are resized WebP files with intrinsic dimensions and lazy loading. The archive now contains 81 records. Existing archive anchors remain stable.
- Verification: 22 pages and 434 local links/assets pass static checks; 50 browser checks pass with no page errors or HTTP failures. Both print links were clicked to verify they open the corresponding PDF. All six PDF pages were rendered and reviewed; the compiler reported no overfull boxes, missing characters, or undefined commands. PDF text checks confirm WalkIsFun, the PM role, planned enrollment, and use of public contact details.

## 2026-10-26: 写真を中心にした案Bへ

本人は案B寄りと回答し、背景写真の切り替えまたはスライドショーを提案。本文の読みやすさを保つため、冒頭の写真位置でのスライドショーを実装した。写真とプロフィールを並べ、研究の題名・所属・期間が読める一覧へ変更した。日本語は短い記録調、英語は事実を揃えて自然な文にする。進学予定、論文投稿中、アプリ試用中の区別を維持。

調査は日本語4件（小山裕己、徳田研究室、山形研究室、たきつぼ）、英語4件（Jon Barron、Maggie Appleton、Frank Chimero、Bruno Simon）を対象に、PCとスマートフォンで行った。Bruno Simonの3D画面はこの環境で描画できず、操作性の比較評価から除外した。観察・採用する点・採用しない点と出典は `content/design-study.mjs` に記録。比較ページは `npm run build:design-study` で再生成できる。元サイトのコード・文章・画像を公開物に流用していない。

- 白に近い地色 `#fcfdfb`、本文 `#24372c`、補足 `#53645a`、リンク `#285d43`。色自体をAIらしさの判定に使わず、写真と本文の読みやすさで選んだ。
- 日英ともOS標準フォントを使い、外部フォントの通信を増やさない。日本語は禁則と行間、英語は単語の折り返しと行長を別々に調整した。
- 全大文字の飾り見出し、連番、巨大な英字名、研究カードの架空の概念図を削除。本人の写真と具体的な研究内容を残した。
- 写真は8秒間隔。前後操作で停止し、ホバー・フォーカス・画面外・非表示タブ・動きを減らす設定でも停止。1枚目だけ初期取得し、原寸写真はギャラリー拡大時に取得。
- ギャラリーの2列表示に合わせて600pxのWebP候補を追加。初期画像量は390px/DPR2で306,072B、1440px/DPR1で248,936B。PCは800px候補だけの場合の417,130Bから約40%減少。これは新レイアウト内の比較であり、旧レイアウト全体より速いという主張ではない。
- 3Dは65秒で1周、ドラッグ・矢印ボタン・キー・Homeで操作。操作後3秒で再開し、手動停止・動きを減らす設定では再開しない。スマートフォンは操作開始・終了を明示。上下回転は±75度。
- URL、言語切り替え、SEOの構造化データ、canonical/hreflang、Search Consoleの所有権確認を維持。日英24ページ、研究8件、活動81件、写真15枚。

検証：静的チェック、SEO、ブラウザー87項目、3D・CDPタッチ、スライドショー、全24ページのCDPエラー・画像確認。390/1440pxの遅延スクリプト検証でメニュー初期化による位置ずれを修正。320/390/768/1440pxの日英表示を確認。CVは日英各3ページを再生成し、全6ページを画像として確認した。原稿のはみ出し・欠落文字なし。LaTeX-ja/microtypeの既存フォント設定警告は残るが、紙面に欠損はない。

スクリーンショット、A/B比較、文言変更の日英各10例、3つの部分試作、テストの詳細はローカルの `artifacts/design-study/` に保存。参照サイトの画面と中間資料はGitHub Pagesへ配布しない。

本文・補足・リンクの背景に対するコントラスト比は12.41、6.17、7.52。

追加の通信検証で、モバイルの初期画面に3Dの一部が入ると先読みが発生することを確認。初期表示の優先順位に合わせ、3D領域の半分が見えるまでモジュール・モデルの取得を延期した。

### 同条件のホームページ負荷比較

Chrome/CDP、150ms遅延、200KB/s、CPU 4倍、各2回、他のブラウザー検証を停止して順に実行。初期表示の集計後に3Dへスクロールし、描画中3秒・停止中1秒・画面外1秒を測定。実ユーザーや実機スマートフォンの測定ではない。

| 表示 | 版 | 初期リソース量 | LCP平均 | CLS | 描画中のメインスレッド時間/3秒 | 描画頻度 |
|---|---|---:|---:|---:|---:|---:|
| mobile | before | 82,544 B | 1,502 ms | 0.000 | 213 ms | 30.0 fps |
| desktop | before | 1,136,884 B | 1,312 ms | 0.000 | 236 ms | 29.9 fps |
| mobile | after | 162,543 B | 1,320 ms | 0.000 | 336 ms | 30.0 fps |
| desktop | after | 1,219,043 B | 1,158 ms | 0.000 | 276 ms | 29.8 fps |

写真を大きく加えたため初期リソース量は旧版より増加。今回の比較で描画CPU負荷の改善は確認していない。約30fpsを維持し、停止中・画面外の描画呼び出しは全試行0回。モバイル初期画面での3D通信は0Bで、スクロール後に取得する。LCPは少数回のローカル測定であり、速度改善を保証する値ではない。
