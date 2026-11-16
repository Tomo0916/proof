/**
 * 過去の回答（正解したときの答えの記録）を画面に出す部品。
 * アプリ本体と管理者ページの両方で使う。
 *
 * 1回分の記録： { at: "2026-11-16T18:20:00.000Z"（日時。わからないときは null）,
 *                given: ["AO=BO", ...]（ステップ1の「仮定」）, hidden: [...]（「隠れた条件」）,
 *                proof: ["△AOC と △BOD において", ...]（ステップ2で並べた証明。1行ずつ） }
 */
const escapeHtml = str => String(str).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

function dateText(at) {
  if (!at) return "日付の記録なし";
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return "日付の記録なし";
  const hm = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${hm}`;
}

const eqList = list => (list && list.length
  ? list.map(l => escapeHtml(String(l).replace(/=/g, " = "))).join("、 ")
  : "（なし）");

/** 過去の回答の一覧（新しい順）。entries は古い順に入っている */
export function historyHtml(entries) {
  if (!entries || entries.length === 0) return `<p class="hint">まだ記録がありません。証明を完成させると、ここに残ります。</p>`;
  return entries.map((e, i) => ({ e, n: i + 1 })).reverse().map(({ e, n }) => `
    <section class="past">
      <div class="past-head"><span class="past-n">${n}回目</span><span class="past-date">${dateText(e.at)}</span></div>
      <div class="past-label">ステップ1　等しい辺や角</div>
      <div class="past-eq">仮定：<b>${eqList(e.given)}</b></div>
      <div class="past-eq">隠れた条件：<b>${eqList(e.hidden)}</b></div>
      <div class="past-label">ステップ2　証明</div>
      <ol class="past-proof">${(e.proof || []).map(line => `<li>${line}</li>`).join("")}</ol>
    </section>`).join("");
}
