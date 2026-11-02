/**
 * 管理者ページ
 * ・学習記録：この端末に記録がある人ごとの成績と、問題ごとの進み具合
 * ・問題一覧：全問題の区分・単元・合同条件など。行を開くと図・模範の証明・使わないカード・解説
 */
import { allProblems } from "./problems/index.js";
import { Storage } from "./storage.js";
import { texToPlain } from "./notation.js";
import { modelProofLines, shortCondition } from "./proof-text.js";

const $ = id => document.getElementById(id);

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function renderMath(el) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(el, {
    delimiters: [{ left: "$", right: "$", display: false }],
    throwOnError: false,
    macros: { "\\parallel": "\\mathbin{/\\!/}" }
  });
}

const userName = id => (id === "guest" ? "ゲスト" : id);
const tierBadge = (p, small = false) => p.tier === "advanced"
  ? `<span class="tier-badge tier-advanced ${small ? "small" : ""}">発展</span>`
  : `<span class="tier-badge tier-basic ${small ? "small" : ""}">定期テスト</span>`;

// 単元の順番と名前
const units = [];
allProblems.forEach(p => { if (!units.some(u => u.key === p.unit)) units.push({ key: p.unit, label: p.unitLabel }); });
const basicCount = allProblems.filter(p => p.tier !== "advanced").length;
const advancedCount = allProblems.length - basicCount;

// 単元の中での問題番号（アプリで「すべて」を選んだときと同じ番号）
const numberInUnit = new Map();
units.forEach(u => allProblems.filter(p => p.unit === u.key).forEach((p, i) => numberInUnit.set(p.id, i + 1)));

// ============================================================
// 学習記録
// ============================================================
function statusOf(problemId, data, work) {
  if (data.clearedProblems.includes(problemId)) return { code: "done", label: "✓", text: "正解" };
  const w = work.problems[problemId];
  if (w) {
    if (w.cleared) return { code: "step2", label: "2", text: "ステップ2の途中" };
    if (Array.isArray(w.lines) && w.lines.some(l => String(l).trim())) return { code: "step1", label: "1", text: "ステップ1の途中" };
  }
  return { code: "none", label: "－", text: "まだ" };
}

function loadUsers() {
  return Storage.listUsers().map(id => {
    const data = Storage.loadData(id);
    const work = Storage.loadWork(id);
    const statuses = new Map(allProblems.map(p => [p.id, statusOf(p.id, data, work)]));
    const done = allProblems.filter(p => statuses.get(p.id).code === "done");
    return {
      id, data, work, statuses,
      done: done.length,
      doneBasic: done.filter(p => p.tier !== "advanced").length,
      doneAdvanced: done.filter(p => p.tier === "advanced").length,
      inProgress: [...statuses.values()].filter(s => s.code === "step1" || s.code === "step2").length,
      last: allProblems.find(p => p.id === work.problemId)
    };
  });
}

function renderSummary(users) {
  const totalDone = users.reduce((n, u) => n + u.done, 0);
  const cards = [
    ["問題の数", `${allProblems.length} 問`, `定期テスト ${basicCount}・発展 ${advancedCount}`],
    ["単元の数", `${units.length}`, units.map(u => u.label.replace(/と合同$/, "")).join("／")],
    ["記録がある人", `${users.length} 人`, "この端末に保存されている人数"],
    ["正解の合計", `${totalDone} 問`, "全員が正解した問題数の合計"]
  ];
  $("summary").innerHTML = cards.map(([title, value, note]) => `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
      <div class="text-[11px] font-bold text-slate-500">${title}</div>
      <div class="text-xl font-bold text-slate-800">${value}</div>
      <div class="text-[10px] text-slate-400 truncate" title="${escapeHtml(note)}">${escapeHtml(note)}</div>
    </div>`).join("");
}

function renderUsers(users) {
  if (users.length === 0) {
    $("users-body").innerHTML = `<tr><td colspan="9" class="py-6 text-center text-slate-400">まだ記録がありません。アプリで問題を解くと、ここに表示されます。</td></tr>`;
    return;
  }
  $("users-body").innerHTML = users.map(u => {
    const pct = Math.round((u.done / allProblems.length) * 100);
    const last = u.last ? `${escapeHtml(u.last.unitLabel)} 問${numberInUnit.get(u.last.id)}「${escapeHtml(u.last.title)}」` : "－";
    return `
      <tr class="border-b border-slate-100">
        <td class="py-2 pr-3 font-bold">${escapeHtml(userName(u.id))}</td>
        <td class="py-2 pr-3 text-right">${u.data.clearedToday}</td>
        <td class="py-2 pr-3 text-right">${u.data.bestDaily}</td>
        <td class="py-2 pr-3">
          <div class="flex items-center gap-2">
            <div class="bar flex-1"><span style="width:${pct}%"></span></div>
            <span class="whitespace-nowrap">${u.done} / ${allProblems.length}</span>
          </div>
        </td>
        <td class="py-2 pr-3 text-right">${u.doneBasic} / ${basicCount}</td>
        <td class="py-2 pr-3 text-right">${u.doneAdvanced} / ${advancedCount}</td>
        <td class="py-2 pr-3 text-right">${u.inProgress}</td>
        <td class="py-2 pr-3 text-slate-600">${last}</td>
        <td class="py-2 text-right">
          <button type="button" class="text-rose-500 hover:text-rose-700 hover:underline whitespace-nowrap" data-delete="${escapeHtml(u.id)}">記録を消す</button>
        </td>
      </tr>`;
  }).join("");
}

function renderMatrix(users) {
  if (users.length === 0) {
    $("matrix-head").innerHTML = "";
    $("matrix-body").innerHTML = `<tr><td class="py-6 text-center text-slate-400">まだ記録がありません。</td></tr>`;
    return;
  }
  $("matrix-head").innerHTML = `
    <tr class="text-slate-500 border-b border-slate-200">
      <th class="sticky-col py-2 pr-4 text-left">問題</th>
      ${users.map(u => `<th class="py-2 px-1 text-center whitespace-nowrap">${escapeHtml(userName(u.id))}</th>`).join("")}
      <th class="py-2 px-2 text-center whitespace-nowrap">正解した人</th>
    </tr>`;
  let html = "";
  units.forEach(unit => {
    html += `<tr class="unit-row"><td class="sticky-col py-1.5 pr-4 font-bold text-slate-600" colspan="${users.length + 2}">${escapeHtml(unit.label)}</td></tr>`;
    allProblems.filter(p => p.unit === unit.key).forEach(p => {
      const doneBy = users.filter(u => u.statuses.get(p.id).code === "done").length;
      html += `
        <tr class="border-b border-slate-50">
          <td class="sticky-col py-1 pr-4 whitespace-nowrap">
            <span class="text-slate-400">問${numberInUnit.get(p.id)}</span> ${escapeHtml(p.title)} ${p.tier === "advanced" ? tierBadge(p, true) : ""}
          </td>
          ${users.map(u => {
            const s = u.statuses.get(p.id);
            return `<td class="py-1 px-1 text-center"><span class="st st-${s.code}" title="${escapeHtml(userName(u.id))}：${s.text}">${s.label}</span></td>`;
          }).join("")}
          <td class="py-1 px-2 text-center text-slate-600">${doneBy} / ${users.length}</td>
        </tr>`;
    });
  });
  $("matrix-body").innerHTML = html;
}

function renderRecords() {
  const users = loadUsers();
  renderSummary(users);
  renderUsers(users);
  renderMatrix(users);
}

// ============================================================
// 問題一覧
// ============================================================
const DUMMY_TYPE = { reason: "理由", equation: "等式", condition: "合同条件" };

function detailHtml(p) {
  const equalities = p.proof.blocks.flatMap(b => b.equations).map(texToPlain);
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
      <div>
        <div class="detail-figure bg-slate-50 border border-slate-200 rounded-lg p-2 flex justify-center">${p.svg}</div>
        <div class="text-[11px] text-slate-500 mt-2">入力ボタンの文字：${p.points.join(" ")}</div>
      </div>
      <div class="md:col-span-2 space-y-3 text-xs sm:text-sm">
        <div>
          <div class="text-[11px] font-bold text-slate-500 mb-0.5">問題文</div>
          <div class="leading-relaxed">${p.statement}</div>
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-500 mb-0.5">ステップ1の正解（等しい辺や角）</div>
          <div class="font-mono">${equalities.map(e => escapeHtml(e.replace(/=/g, " = "))).join("　")}</div>
          ${(p.extraTrue || []).length ? `<div class="text-[11px] text-amber-700 mt-0.5">△（正しいが使わない）：${p.extraTrue.map(e => escapeHtml(e.replace(/=/g, " = "))).join("　")}</div>` : ""}
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-500 mb-0.5">模範の証明</div>
          <ol class="space-y-0.5 bg-white border border-slate-200 rounded-lg p-2">
            ${modelProofLines(p).map((line, i) => `<li class="flex gap-2"><span class="step-number">${i + 1}</span><span>${line}</span></li>`).join("")}
          </ol>
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-500 mb-0.5">使わないカード</div>
          <ul class="space-y-0.5">
            ${(p.dummies || []).map(d => `<li><span class="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 mr-1">${DUMMY_TYPE[d.type] || d.type}</span>${d.text}</li>`).join("")}
          </ul>
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-500 mb-0.5">解説</div>
          <div class="leading-relaxed text-slate-700">${p.explanation}</div>
        </div>
      </div>
    </div>`;
}

let openId = null;
const selected = new Set();   // 印刷するために選んだ問題

function filteredProblems() {
  const tier = $("f-tier").value;
  const unit = $("f-unit").value;
  const cond = $("f-cond").value;
  const text = $("f-text").value.trim();
  return allProblems.filter(p =>
    (tier === "all" || p.tier === tier) &&
    (unit === "all" || p.unit === unit) &&
    (cond === "all" || shortCondition(p) === cond) &&
    (!text || `${p.id} ${p.title} ${p.statement}`.includes(text))
  );
}

function renderProblems() {
  const list = filteredProblems();
  $("f-count").textContent = `${list.length} / ${allProblems.length} 問`;
  renderSelection(list);
  if (list.length === 0) {
    $("problems-body").innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-400">条件に合う問題がありません。</td></tr>`;
    return;
  }
  $("problems-body").innerHTML = list.map(p => {
    const open = p.id === openId;
    return `
      <tr class="prob-row border-b border-slate-100 ${open ? "is-open" : ""}" data-id="${p.id}">
        <td class="py-2 pl-1 pr-2"><input type="checkbox" class="sel w-4 h-4 accent-indigo-600 cursor-pointer" data-sel="${p.id}" ${selected.has(p.id) ? "checked" : ""} aria-label="${escapeHtml(p.title)}を印刷に選ぶ"></td>
        <td class="py-2 pr-3 font-mono text-slate-500 whitespace-nowrap">${p.id}</td>
        <td class="py-2 pr-3">${tierBadge(p, true)}</td>
        <td class="py-2 pr-3 whitespace-nowrap">${escapeHtml(p.unitLabel)}</td>
        <td class="py-2 pr-3 whitespace-nowrap">${p.level}</td>
        <td class="py-2 pr-3 font-bold">${open ? "▼" : "▶"} ${escapeHtml(p.title)}</td>
        <td class="py-2 pr-3">${escapeHtml(shortCondition(p))}</td>
        <td class="py-2 pr-3 text-slate-600">${p.proof.blocks.map(b => b.reason.replace(/、$/, "")).join(" ／ ")}</td>
      </tr>
      ${open ? `<tr class="border-b border-slate-200 bg-indigo-50/40"><td colspan="8">${detailHtml(p)}</td></tr>` : ""}`;
  }).join("");
  renderMath($("problems-body"));
}

function initProblemFilters() {
  $("f-unit").innerHTML = `<option value="all">すべて</option>` +
    units.map(u => `<option value="${u.key}">${escapeHtml(u.label)}</option>`).join("");
  const conds = [...new Set(allProblems.map(shortCondition))];
  $("f-cond").innerHTML = `<option value="all">すべて</option>` +
    conds.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  ["f-tier", "f-unit", "f-cond"].forEach(id => $(id).addEventListener("change", renderProblems));
  $("f-text").addEventListener("input", renderProblems);
  $("problems-body").addEventListener("click", e => {
    const box = e.target.closest("[data-sel]");
    if (box) {
      if (box.checked) selected.add(box.dataset.sel); else selected.delete(box.dataset.sel);
      renderSelection(filteredProblems());
      return;
    }
    const row = e.target.closest(".prob-row");
    if (!row) return;
    openId = openId === row.dataset.id ? null : row.dataset.id;
    renderProblems();
  });
}

// 選んだ問題の数とボタンの状態
function renderSelection(list) {
  $("sel-count").textContent = `${selected.size} 問を選択中`;
  $("btn-print").disabled = selected.size === 0;
  const allChecked = list.length > 0 && list.every(p => selected.has(p.id));
  $("sel-all").checked = allChecked;
  $("sel-all").indeterminate = !allChecked && list.some(p => selected.has(p.id));
}

function initPrintSelection() {
  // 表示中の問題をまとめて選ぶ／外す
  $("sel-all").addEventListener("change", e => {
    filteredProblems().forEach(p => (e.target.checked ? selected.add(p.id) : selected.delete(p.id)));
    renderProblems();
  });
  $("btn-sel-clear").addEventListener("click", () => {
    selected.clear();
    renderProblems();
  });
  $("btn-print").addEventListener("click", () => {
    if (selected.size === 0) return;
    const ids = allProblems.filter(p => selected.has(p.id)).map(p => p.id);
    window.open(`print.html?ids=${ids.join(",")}`, "_blank");
  });
}

// ============================================================
// タブ
// ============================================================
function showTab(name) {
  const tab = name === "problems" ? "problems" : "records";
  document.querySelectorAll(".tab-btn").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  $("tab-records").classList.toggle("hidden", tab !== "records");
  $("tab-problems").classList.toggle("hidden", tab !== "problems");
  if (location.hash !== `#${tab}`) history.replaceState(null, "", `#${tab}`);
}

function init() {
  document.querySelectorAll(".tab-btn").forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
  $("users-body").addEventListener("click", e => {
    const btn = e.target.closest("[data-delete]");
    if (!btn) return;
    const id = btn.dataset.delete;
    if (window.confirm(`「${userName(id)}」の学習記録と途中経過をすべて消します。元に戻せません。よろしいですか？`)) {
      Storage.deleteUser(id);
      renderRecords();
    }
  });
  initProblemFilters();
  initPrintSelection();
  renderRecords();
  renderProblems();
  showTab(location.hash.replace("#", ""));
}

window.addEventListener("DOMContentLoaded", init);
// KaTeX の読み込みが遅れたときのために、読み込み後にもう一度数式を描く
window.addEventListener("load", () => renderMath($("problems-body")));
