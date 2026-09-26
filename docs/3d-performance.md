# 3D背景のCDP最適化 — 2026年9月26日

リアル寄りに制作した3種類のモデルを維持し、ホームページの3D背景を最適化した。変更前後を同じローカルサーバーとChromeで測定した。

## 測定方法

`scripts/measure-scene.mjs` でChrome DevTools ProtocolのNetwork、Performance、Runtime、Log、Audits、Tracingを使用。Resource Timing、PerformanceObserver、WebGLへの描画命令数も記録した。

- Chrome 153.0.8010.48、Windows、ANGLE / NVIDIA GeForce RTX 4090 / Direct3D11
- モバイル表示：390×844、DPR 2。デスクトップ表示：1440×1000、DPR 1
- キャッシュ無効、遅延150ms、ダウンロード200,000 bytes/s、アップロード100,000 bytes/s、CPU 4倍スローダウン
- 各表示幅で変更前3回・変更後3回。並行する別のブラウザー計測なし
- 本文のLCPと、最初の3Dフレームを描いた時点を別々に計測
- モデル表示後、回転中3秒・停止中1秒・画面外1秒の処理を比較
- 回転中は通信制限のみ解除。CPUスローダウンは4倍を維持

以下は実測の中央値であり、実ユーザーのCore Web Vitalsや実機スマートフォンのGPU性能ではない。サーバーは前後ともJavaScriptのHTTP圧縮を行っていない。GitHub Pages等のCDNでJavaScriptが圧縮される場合、実際の通信量・時間はこの結果と異なる。3回の試行で小さな時間差に統計的な有意差があるとは判断しない。

## 結果

| 指標 | 変更前 | 変更後 |
|---|---:|---:|
| 最初の3D表示に必要なデータ | 1,886,223 B | 1,054,340 B（44.1%削減） |
| 3D用JavaScript | 884,543 B / 6ファイル | 624,871 B / 1ファイル |
| モバイル：3D表示まで | 12.082秒 | 7.542秒（37.6%短縮） |
| デスクトップ：3D表示まで | 11.953秒 | 7.484秒（37.4%短縮） |
| モバイル：本文LCP | 1.676秒 | 1.704秒 |
| デスクトップ：本文LCP | 1.652秒 | 1.648秒 |
| 初期CLS（両表示幅） | 0 | 0 |
| モバイル：回転中3秒のメインスレッド処理 | 244.9ms | 217.0ms |
| デスクトップ：回転中3秒のメインスレッド処理 | 234.1ms | 234.9ms |
| 回転中3秒のWebGL描画命令数（両表示幅） | 1,152回 | 1,080回 |
| モバイル：使用JSヒープ | 8,815,056 B | 6,233,716 B |
| デスクトップ：使用JSヒープ | 8,631,700 B | 6,099,552 B |
| 停止中・画面外の描画命令数 | 0 | 0 |

主な改善は転送量と3D表示までの時間。本文LCPとデスクトップのメインスレッド時間は、これらの試行ではほぼ変わっていない。変更前の観測描画頻度はこの環境で約31.9fps、変更後は約29.9fpsだったため、この計測で描画負荷が半減したとは言えない。30fps制限は高リフレッシュレート環境で不要な描画を増やさないためにも有効。

## 変更内容

### 可逆圧縮したモデルを配信

`scripts/pack-models.mjs` がGLBをgzipレベル9で圧縮する。ブラウザーは標準の `DecompressionStream("gzip")` で展開してGLTFLoaderに渡す。対応しないブラウザーは従来のGLBを読み込む。サーバー固有のヘッダー設定や追加のJavaScriptデコーダーは不要。

| モデル | 元GLB | 配信用GLB.gz | 削減 |
|---|---:|---:|---:|
| 探査機 | 1,001,680 B | 429,469 B | 57.1% |
| 惑星 | 1,625,980 B | 1,318,440 B | 18.9% |
| ロボット | 779,084 B | 334,245 B | 57.1% |
| 合計 | 3,406,744 B | 2,082,154 B | 38.9% |

生成時とチェック時に、解凍後のデータが元GLBとバイト単位で完全一致することを検証。三角形数、テクスチャ、マテリアル、Blender元データを削減・変更していない。選択していないモデルはダウンロードしない。

### JavaScriptと描画の無駄を削減

- esbuildでThree.jsと必要なローダーをまとめ、不要なコードとコメントを削減。MITライセンス表記を保持。ブラウザーが実行するのは `scene.min.js`。
- `assets/scene-build.json` にソースと生成物のハッシュを保存し、古い生成物をチェックで検出。
- 3D領域の200px手前に近づくまで、ライブラリとモデルの初期読み込みを延期。`#contact` から開いた場合の不要な通信をCDPで検査。
- 65秒の回転周期を維持し、描画は最大約30fps。表示更新間隔に依存して回転が遅くならないよう、経過時間で角度を計算。
- モデル切り替え時の重複描画、同じモデルの再選択時の角度リセット、寸法が変わらない描画バッファの再確保を除去。
- 画面外・非表示時は描画しない。環境マップも最初に実際に表示する時点で生成。
- 惑星には影を落とす部品がないため、影マップ更新を省略。探査機とロボットの自己影は引き続き更新。

## 見た目と機能の確認

変更前の `scene.js` を保存し、同じモデル・停止した同じ角度で、390px/DPR 2と1440px/DPR 1の画面を比較した。3モデル×2表示幅で、RGBの最大差は0〜2/255、2を超える差が出る画素はゼロ。形状・材質・照明を保ったまま最適化できている。

- 静的チェック：24ページ、656リンク・アセットを検証
- 3Dチェック：全モデル、両言語、320〜1024px、回転・停止の画素比較、設定保存、低モーション設定、JavaScript/WebGL非対応、読み込み失敗後の再試行、WebGLコンテキスト復元
- 新規チェック：生成物の鮮度、gzipの完全一致、展開API非対応時のGLB読み込み、画面外から開いた場合の通信延期
- CDP：全24ルートで実行時エラー、通信失敗、DevTools Issuesなし
- 既存ギャラリーの転送量制限、元画像の遅延取得、スクリプト遅延時のレイアウトも合格

## 再現

開発サーバーを起動した状態で、必要に応じて `PLAYWRIGHT_MODULE` と `CHROME_PATH` を設定する。

```powershell
$env:MEASURE_LABEL = 'before'
node scripts/measure-scene.mjs
# 変更後、他の条件を変えずに実行
$env:MEASURE_LABEL = 'after'
node scripts/measure-scene.mjs
node scripts/check-scene.mjs
node scripts/check-cdp.mjs
```

詳細なJSON、前後のソースハッシュ、Chromeトレース、スクリーンショットは `artifacts/scene-performance/` に保存。全ページのCDP結果は `artifacts/cdp-3d-optimized/report.json`。これらはローカルの検証出力でGitの対象外。

モデル更新時は `node scripts/pack-models.mjs`、3Dコード更新時は `pnpm run build:scene` を実行する。通常のHTML生成やプレビューにはesbuildのインストールは不要。

参考：[CDP Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)、[ブラウザーのDecompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)、[esbuildのtree shaking](https://esbuild.github.io/api/#tree-shaking)。
