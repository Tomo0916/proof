/**
 * 印刷用プリント
 * print.html?ids=cong-01,tri-02 のように、印刷する問題の id を渡す
 *
 * ・A4 縦。標準は1ページに2問（紙の節約）、1問ずつ大きくもできる
 * ・各問題：問題文と図（右）→「等しい辺や角」の欄（選べる）→ 証明を書く罫線（残りの高さいっぱい）
 * ・解答は最後のページにまとめて2段組み
 */
import { allProblems } from "./problems/index.js";
import { texToPlain } from "./notation.js";
import { modelProofLines } from "./proof-text.js";

const $ = id => document.getElementById(id);

const ids = (new URLSearchParams(location.search).get("ids") || "").split(",").filter(Boolean);
// 選んだ順ではなく、アプリと同じ並び（単元 → やさしい順）で印刷する
const problems = allProblems.filter(p => ids.includes(p.id));

function renderMath(el) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(el, {
    delimiters: [{ left: "$", right: "$", display: false }],
    throwOnError: false,
    macros: { "\\parallel": "\\mathbin{/\\!/}" }
  });
}

// 印刷では色の印もそのまま使うが、図の大きさは CSS で決めるので幅・高さの指定を外す
const printableSvg = svg => svg.replace(/ width="\d+" height="\d+"/, "").replace(/ class="[^"]*"/, "");

function sheetHead(title, sub, withName) {
  return `
    <div class="sheet-head">
      <div class="sheet-title">${title}<small>${sub}</small></div>
      ${withName ? `<div class="name-box">　　組　　番　名前 <span style="width:45mm"></span></div>` : ""}
    </div>`;
}

function questionHtml(p, no, opts) {
  const [t1, t2] = p.triangles;
  const tag = p.tier === "advanced" ? `<span class="q-tag adv">発展</span>` : "";
  return `
    <div class="q">
      <div class="q-top">
        <div class="q-text"><span class="q-no">問${no}</span>${tag}${p.statement}</div>
        <div class="q-fig">${printableSvg(p.svg)}</div>
      </div>
      ${opts.step1 ? `
        <div class="box-label">等しい辺や角 <small>（「=」の左に $\\triangle ${t1}$、右に $\\triangle ${t2}$ の辺や角を書く）</small></div>
        <div class="step1-box"><div></div><div></div><div></div></div>` : ""}
      <div class="box-label">証明</div>
      <div class="lines">${"<div></div>".repeat(30)}</div>
    </div>`;
}

function answerHtml(p, no) {
  const eqs = p.proof.blocks.flatMap(b => b.equations).map(texToPlain).map(e => e.replace(/=/g, " = "));
  return `
    <div class="ans">
      <div class="ans-title">問${no}　${p.title}${p.tier === "advanced" ? "（発展）" : ""}</div>
      <div class="ans-eq">等しい辺や角：${eqs.join("，")}</div>
      <ol>${modelProofLines(p, "num").map(l => `<li>${l}</li>`).join("")}</ol>
    </div>`;
}

function render() {
  const opts = {
    per: Number($("opt-per").value),
    step1: $("opt-step1").checked,
    answers: $("opt-answers").checked,
    name: $("opt-name").checked
  };
  const pages = $("pages");

  if (problems.length === 0) {
    $("info").textContent = "";
    pages.innerHTML = `<div class="empty">印刷する問題が選ばれていません。<br>管理者ページの「問題一覧」で問題にチェックを入れてから、「選択した問題を印刷」を押してください。</div>`;
    return;
  }

  const sheetCount = Math.ceil(problems.length / opts.per);
  let html = "";
  for (let s = 0; s < sheetCount; s++) {
    const chunk = problems.slice(s * opts.per, (s + 1) * opts.per);
    html += `
      <section class="sheet ${opts.per === 1 ? "one-per-page" : ""}">
        ${sheetHead("合同の証明 プリント", sheetCount > 1 ? `（${s + 1} / ${sheetCount}）` : "", opts.name)}
        <div class="questions">
          ${chunk.map((p, i) => questionHtml(p, s * opts.per + i + 1, opts)).join("")}
          ${chunk.length < opts.per ? `<div style="flex:${opts.per - chunk.length}"></div>` : ""}
        </div>
      </section>`;
  }

  // 解答：最後にまとめて2段組み。入りきらない分は自動で次のページへ続く
  if (opts.answers) {
    html += `
      <section class="sheet flow">
        ${sheetHead("合同の証明 プリント　解答", "", false)}
        <div class="answers">${problems.map((p, i) => answerHtml(p, i + 1)).join("")}</div>
      </section>`;
  }

  pages.innerHTML = html;
  renderMath(pages);
  // 解答のページ数の目安（印刷できる高さ 277mm ずつ）
  const flow = pages.querySelector(".sheet.flow");
  const mm = px => (px * 25.4) / 96;
  const answerSheets = flow
    ? Math.max(1, Math.ceil((mm(flow.querySelector(".sheet-head").offsetHeight + flow.querySelector(".answers").offsetHeight) + 5) / 277))
    : 0;
  $("info").textContent = `${problems.length} 問 ／ 問題 ${sheetCount} 枚${opts.answers ? ` ＋ 解答 約${answerSheets} 枚` : ""}（A4）`;
}

["opt-per", "opt-step1", "opt-answers", "opt-name"].forEach(id => $(id).addEventListener("change", render));
$("btn-print").addEventListener("click", () => window.print());
render();
// KaTeX の読み込みが遅れたときのために、読み込み後にもう一度数式を描く
window.addEventListener("load", () => renderMath($("pages")));
