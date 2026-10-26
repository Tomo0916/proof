/**
 * 問題データの目録（レジストリ）
 * 新しい単元ファイル（例: unit3_right_triangle.js）を追加した際は、
 * ここに import して配列に結合するだけで自動反映されます。
 *
 * ── 問題データを書くときのルール ──
 * ・pieces の role は "target"（宣言）/ "fact"（理由・等式）/ "condition"（合同条件）
 *   / "conclusion"（結論）/ "dummy"（使えないフレーズ）のいずれか
 * ・理由（「仮定より、」「〜ので、」）と等式（「〜 …… ①」）は別々のカードにする
 * ・requiredIds は「正しい証明の順番」どおりに並べる（判定で順番を照合します）
 * ・合同条件のダミーにも正解と同じく「①, ②, ③より、」を付け、見た目で区別できないようにする
 * ・平行記号は $\\parallel$、問題文では「右の図」ではなく「図で」と書く（スマホでは図が下に出るため）
 * ・仮定で等しいとされた辺・角には、図に印を付ける
 */
import { unit1Problems } from "./unit1_parallel.js";
import { unit2Problems } from "./unit2_triangle.js";

export const allProblems = [
  ...unit1Problems,
  ...unit2Problems
];
