# 合同の証明トレーニング（tomo0916.github.io/proof）

中学2年の「合同の証明」を練習する静的サイト（GitHub Pages）。ビルドなし、`main` に push すると公開される。

## 変更するときの決まり
- **アプリを改善・修正したら、必ず `js/news.js` の `NEWS` の先頭にお知らせを1件追加する。**
  生徒が読むので、むずかしい言葉を使わずに書く（tag: new / improve / fix / teacher）。
- 画面の言葉は中学生にわかる言い方にする（「型を判定」などの言い回しは使わない）。
- 問題データの書き方は `js/problems/index.js` と `js/figure.js` の先頭にある。
- 不具合・要望の送り先（Google フォーム）は `js/config.js` で設定する。

## ページ
- `index.html` アプリ本体（ステップ1：等しい辺や角 → ステップ2：カードで証明）
- `reasons.html` 理由カードの一覧（図つき）
- `admin.html` 管理者ページ（学習記録・問題一覧・印刷する問題の選択）
- `print.html` 印刷用プリント
