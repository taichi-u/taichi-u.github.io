# オリジナル3Dモデル

HPの背景用に、このリポジトリの `scripts/build-models.py` と `scripts/model_details.py` でBlender上に作成したモデルです。
外部のモデル・画像テクスチャ・HDRI・フォント・ロゴは使用していません。

| 元データ | HP用データ | 内容 |
|---|---|---|
| `planet.blend` | `assets/models/planet.glb` | 海・大陸・極冠・雲・大気を持つ架空の地球型惑星 |
| `satellite.blend` | `assets/models/satellite.glb` | しわのある断熱材、太陽電池の電極、アンテナ補強材、放熱板、スラスタ、配線 |
| `robot.blend` | `assets/models/robot.glb` | ベアリング、ボルト、モータカバー、電線・空圧管、コネクタ、グリッパ |

特定の実在機体を再現したモデルではありません。惑星の地形も地球の地図ではありません。
モデルに第三者アセットのライセンス条件は含まれていません。
Web表示に使うThree.jsはMITライセンスで、著作権表示とライセンスを `assets/vendor/three/LICENSE` に保存しています。

惑星の画像は球面ノイズから生成したオリジナルのテクスチャです。`textures/` に編集用PNGを保存し、`.blend` と `.glb` にも内包しています。地球の衛星写真や既存の地図を流用していません。
Blenderで作成したモデル・書き出しデータの商用利用については、[Blender公式の「Your Artwork」](https://www.blender.org/about/license/)を参照してください。

## Blenderで編集する

1. 対象の `.blend` を開く。部品名・材質名を付けた状態で保存しています。
2. 形やマテリアルの色を編集する。
3. 「ファイル → エクスポート → glTF 2.0」で `.glb` を選び、対応する `assets/models/` 内のファイルに書き出す。
4. リポジトリで `node scripts/pack-models.mjs` を実行し、配信用の `.glb.gz` を更新する。
5. ブラウザでHPを再読み込みする。形状の中心と大きさは自動で合わせます。

本番の素材を手作業で編集した後は、生成スクリプトを再実行すると上書きされるため、別名保存してから実行してください。

## 最初の状態を再生成する

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --factory-startup --python scripts/build-models.py
node scripts/pack-models.mjs
```

`.blend` は部品ごとに編集できる状態、`.glb` はマテリアルごとにメッシュをまとめた軽量版です。
生成に使用したBlenderは5.2.2 LTSです。通常のHTMLビルドや閲覧にはBlenderは不要です。
編集用GLBの容量は惑星約1.63MB、探査機約1.00MB、ロボット約0.78MBです。配信するgzip版はそれぞれ約1.32MB、0.43MB、0.33MBで、解凍後の内容は元のGLBと完全に一致します。テクスチャのための別途通信はありません。

## HPでの動き

`scene.js` から生成する `scene.min.js` が選択されたGLBのみを読み込みます。初期表示は探査機、1回転は約65秒、描画は最大30fpsです。
回転速度・初期角度・照明・カメラ距離は `scene.js` で変更し、`pnpm run build:scene` で配信用ファイルを更新できます（初回は `pnpm install --frozen-lockfile`）。
「動き: オフ」、OSの視差効果を減らす設定、非表示タブ、画面外では回転を停止します。
WebGLを使えない環境では既存のCSSの惑星を表示します。
環境光はThree.jsのRoomEnvironmentから生成し、金属の反射と部品の陰影を表示しています。
トップの3D表示領域から離れている間はライブラリやモデルの初期読み込みも延期します。惑星には影を落とす部品がないため、影用バッファの更新を省略します。

`node scripts/check-scene.mjs` で、モデルの整合性、両言語での切り替え、回転・停止の画素比較、スマホ幅、低モーション設定、読み込み失敗後の再試行を確認できます。PlaywrightとChromeが必要です。
