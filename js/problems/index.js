/**
 * 問題データの目録（レジストリ）
 * 新しい単元ファイルを追加した際は、ここに import して配列に加えるだけで自動反映されます。
 *
 * ── 問題データの書き方 ──
 * id          問題ごとに重ならない名前（学習記録に使うので、あとから変えない）
 * level       "★☆☆" 〜 "★★★"
 * figure      図のデータ。書き方は js/figure.js の先頭を参照
 *             → 図・入力ボタンの文字・一直線上の点は、ここから自動で作られます
 * triangles   合同を示す2つの三角形（対応する頂点の順に）
 *             →「△○○ と △○○ において」「△○○ ≡ △○○」のカードは自動で作られます
 * proof.blocks     「理由」と、その理由からわかる「等式」の組
 *                  ・等式に ①②③ は書かない（解答らんに入れたときに自動でつく）
 *                  ・ステップ1の正解も、ここに書いた等式から自動で作られる
 *                  ・直角は "$\\angle AHB = \\angle AHC = 90^\\circ$" のように書いてよい
 *                  ・理由の文は、同じ問題の中で重ならないようにする
 * proof.condition  合同条件。「①, ②, ③より、」は書かない（自動でつく）
 * extraTrue   正しいけれどこの証明には使わない等式（ステップ1で「△」として扱う）
 * dummies     使わないカード。type は "reason" / "equation" / "condition"
 *             見た目で正解と区別できないように、正解のカードと同じ書き方にそろえる
 *
 * ・平行の記号は $\\parallel$ を使う
 * ・問題文では「右の図」ではなく「図で」と書く（スマホでは図が下に出るため）
 * ・仮定で等しいとされた辺・角には、図に印を付ける
 */
import { prepareProblem } from "../figure.js";
import { unit1Problems } from "./unit1_parallel.js";
import { unit2Problems } from "./unit2_common.js";
import { unit3Problems } from "./unit3_isosceles.js";
import { unit4Problems } from "./unit4_right.js";
import { unit5Problems } from "./unit5_parallelogram.js";
import { unit6Problems } from "./unit6_special.js";

export const allProblems = [
  ...unit1Problems,
  ...unit2Problems,
  ...unit3Problems,
  ...unit4Problems,
  ...unit5Problems,
  ...unit6Problems
]
  // 単元の中は、やさしい問題から順に並べる（★の数が同じなら書いた順）
  .map((p, i) => ({ p, i, stars: (p.level.match(/★/g) || []).length, unit: p.unit }))
  .sort((a, b) => (a.unit === b.unit ? a.stars - b.stars || a.i - b.i : a.i - b.i))
  .map(x => prepareProblem(x.p));
