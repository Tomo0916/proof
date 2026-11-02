/**
 * 問題データから「模範の証明」の行を作る（管理者ページ・印刷で共通）
 */
export const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

/**
 * @param numClass 番号（①②③ と「①, ②, ③より、」）につける class 名
 * @returns 証明の各行（HTML。数式は $...$ のまま）
 */
export function modelProofLines(p, numClass = "auto-num") {
  const [t1, t2] = p.triangles;
  const lines = [`$\\triangle ${t1}$ と $\\triangle ${t2}$ において`];
  const nums = [];
  p.proof.blocks.forEach(block => {
    lines.push(block.reason);
    block.equations.forEach(eq => {
      const num = CIRCLED[nums.length] || String(nums.length + 1);
      nums.push(num);
      lines.push(`${eq} <span class="${numClass}">…… ${num}</span>`);
    });
  });
  lines.push(`<span class="${numClass}">${nums.join(", ")}より、</span>${p.proof.condition}`);
  lines.push(`$\\triangle ${t1} \\equiv \\triangle ${t2}$`);
  return lines;
}

/** 合同条件の短い名前（「〜がそれぞれ等しいので」を除く） */
export const shortCondition = p => p.proof.condition.replace(/がそれぞれ等しいので$/, "");
