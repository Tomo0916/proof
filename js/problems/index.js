/**
 * 問題データの目録（レジストリ）
 * 新しい単元ファイル（例: unit3_right_triangle.js）を追加した際は、
 * ここに import して配列に結合するだけで自動反映されます。
 *
 * ── 問題データの書き方 ──
 * points      図にある点の名前（ステップ1のボタンになる）
 * lines       一直線上に並ぶ点を、並んでいる順に書く（∠BAO と ∠BAC を同じ角と判定するため）
 * triangles   合同を示す2つの三角形（対応する頂点の順に）
 *             →「△○○ と △○○ において」「△○○ ≡ △○○」のカードは自動で作られます
 * proof.blocks     「理由」と、その理由からわかる「等式」の組
 *                  ・等式に ①②③ は書かない（解答らんに入れたときに自動でつく）
 *                  ・ステップ1の正解も、ここに書いた等式から自動で作られる
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
import { unit1Problems } from "./unit1_parallel.js";
import { unit2Problems } from "./unit2_triangle.js";

export const allProblems = [
  ...unit1Problems,
  ...unit2Problems
];
