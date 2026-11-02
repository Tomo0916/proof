import { allProblems } from "./problems/index.js";
import { Storage } from "./storage.js";
import { readEquality, texToPlain, formatPlain } from "./notation.js";

// ============================================================
// 効果音（Web Audio API で生成。外部音声ファイル不要）
// ============================================================
const Sound = {
  ctx: null,

  // 最初のユーザー操作で呼ぶ。iOS Safari の「停止中」状態も解除する
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  },

  _ready() {
    return Storage.getSoundEnabled() && this.ctx && this.ctx.state !== "closed";
  },

  _tone({ type, freq, volume, duration, delay = 0 }) {
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  },

  playClick() {
    if (!this._ready()) return;
    this._tone({ type: "sine", freq: 520, volume: 0.08, duration: 0.05 });
  },

  playSuccess() {
    if (!this._ready()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      this._tone({ type: "triangle", freq, volume: 0.12, duration: 0.3, delay: idx * 0.09 });
    });
  },

  playNotice() {
    if (!this._ready()) return;
    this._tone({ type: "sawtooth", freq: 260, volume: 0.08, duration: 0.2 });
  }
};

// ============================================================
// 定数・状態
// ============================================================
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
const MAX_LINES = 6;     // ステップ1で書ける行数
const MAX_CHARS = 12;    // 1行に書ける文字数

const state = {
  filteredProblems: [...allProblems],
  index: 0,
  prob: null,

  // ステップ1
  step1: {
    lines: [""],
    active: 0,
    results: [],     // 答え合わせ後の各行の判定（lines と同じ並び。未判定は null）
    cleared: false,
    requiredKeys: [],
    extraKeys: []
  },

  // ステップ2
  pieces: [],
  palette: [],
  answer: [],
  lastMovedId: null
};

const $ = id => document.getElementById(id);
const dom = {
  selectUnit: $("select-unit"),
  selectProblem: $("select-problem"),
  btnPrev: $("btn-prev"),
  btnNext: $("btn-next"),
  probBadge: $("prob-badge"),
  probTag: $("prob-tag"),
  probTitle: $("prob-title"),
  probStatement: $("prob-statement"),
  probFigure: $("prob-figure"),
  // ステップ1
  step1: $("step1"),
  step1Status: $("step1-status"),
  step1Prompt: $("step1-prompt"),
  eqLines: $("eq-lines"),
  keypad: $("keypad"),
  keypadWrap: $("keypad-wrap"),
  btnStep1Reset: $("btn-step1-reset"),
  btnStep1Check: $("btn-step1-check"),
  step1Feedback: $("step1-feedback"),
  // ステップ2
  step2: $("step2"),
  step2Locked: $("step2-locked"),
  step2Body: $("step2-body"),
  step2Found: $("step2-found"),
  dropZone: $("drop-zone"),
  paletteZone: $("palette-zone"),
  btnCheck: $("btn-check"),
  btnClear: $("btn-clear"),
  feedbackArea: $("feedback-area"),
  // ヘッダー・名前
  statToday: $("stat-today"),
  statBest: $("stat-best"),
  userDisplay: $("user-display"),
  btnProfile: $("btn-profile"),
  profileModal: $("profile-modal"),
  inputProfileId: $("input-profile-id"),
  btnProfileSave: $("btn-profile-save"),
  btnProfileCancel: $("btn-profile-cancel"),
  btnSoundToggle: $("btn-sound-toggle"),
  soundIcon: $("sound-icon")
};

// ============================================================
// ユーティリティ
// ============================================================
function renderMath(...elements) {
  if (!window.renderMathInElement) return;
  elements.forEach(el => {
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  });
}

// 偏りのないシャッフル（Fisher–Yates）
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function showFeedback(area, type, html) {
  area.classList.remove("hidden", "feedback-success", "feedback-warning", "feedback-error");
  area.classList.add(`feedback-${type}`);
  area.innerHTML = html;
  renderMath(area);
}

function hideFeedback(area) {
  area.classList.add("hidden");
  area.innerHTML = "";
}

function feedbackHtml(title, body = "") {
  return `<div class="font-bold text-base mb-1">${title}</div>${body ? `<p class="text-xs sm:text-sm">${body}</p>` : ""}`;
}

// ============================================================
// ヘッダー・問題の選択
// ============================================================
function updateStatsUI() {
  const data = Storage.loadData();
  dom.statToday.textContent = data.clearedToday;
  dom.statBest.textContent = data.bestDaily;
  const user = Storage.getActiveUser();
  dom.userDisplay.textContent = user === "guest" ? "ゲスト" : user;
}

function updateSoundUI() {
  const on = Storage.getSoundEnabled();
  dom.soundIcon.textContent = on ? "🔊" : "🔇";
  dom.btnSoundToggle.setAttribute("aria-pressed", on ? "true" : "false");
}

function initUnitSelector() {
  const units = new Map();
  allProblems.forEach(p => { if (!units.has(p.unit)) units.set(p.unit, p.unitLabel); });
  let html = '<option value="all">すべての単元</option>';
  units.forEach((label, key) => {
    html += `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
  });
  dom.selectUnit.innerHTML = html;
}

// 問題リスト（正解したことがある問題には ✓ をつける）
function renderProblemOptions() {
  const cleared = Storage.loadData().clearedProblems;
  dom.selectProblem.innerHTML = state.filteredProblems
    .map((p, i) => `<option value="${i}">${cleared.includes(p.id) ? "✓ " : ""}問${i + 1}: ${escapeHtml(p.title)}</option>`)
    .join("");
  dom.selectProblem.value = String(state.index);
}

function filterProblems(unitKey) {
  state.filteredProblems = unitKey === "all"
    ? [...allProblems]
    : allProblems.filter(p => p.unit === unitKey);
  state.index = 0;
  renderProblemOptions();
  loadProblem(0);
}

// ============================================================
// 問題の読み込み
// ============================================================

// 問題データから、ステップ2のカードを作る
function buildPieces(prob) {
  const [t1, t2] = prob.triangles;
  const pieces = [
    { id: "target", type: "target", text: `$\\triangle ${t1}$ と $\\triangle ${t2}$ において` }
  ];
  prob.proof.blocks.forEach((block, i) => {
    pieces.push({ id: `r${i}`, type: "reason", block: i, text: block.reason });
    block.equations.forEach((eq, j) => {
      pieces.push({ id: `e${i}-${j}`, type: "equation", block: i, text: eq });
    });
  });
  pieces.push({ id: "cond", type: "condition", text: prob.proof.condition });
  pieces.push({ id: "concl", type: "conclusion", text: `$\\triangle ${t1} \\equiv \\triangle ${t2}$` });
  (prob.dummies || []).forEach((d, k) => {
    pieces.push({ id: `x${k}`, type: d.type, block: -1, dummy: true, text: d.text });
  });
  return pieces;
}

// 問題データの等式から、ステップ1の正解（比較用の値）を作る
function buildStep1Keys(prob) {
  const toKey = text => {
    const r = readEquality(text, prob);
    if (!r.key) console.warn(`[問題データ ${prob.id}] 読み取れない式があります: ${text}`, r.error);
    return r.key;
  };
  const required = prob.proof.blocks.flatMap(b => b.equations).map(tex => toKey(texToPlain(tex)));
  const extra = (prob.extraTrue || []).map(toKey);
  return { required: required.filter(Boolean), extra: extra.filter(Boolean) };
}

function loadProblem(index) {
  if (index < 0 || index >= state.filteredProblems.length) return;
  state.index = index;
  const prob = state.filteredProblems[index];
  state.prob = prob;

  dom.probBadge.textContent = `レベル ${prob.level}`;
  dom.probTag.textContent = prob.unitLabel;
  dom.probTitle.textContent = `問${index + 1}. ${prob.title}`;
  dom.probStatement.innerHTML = prob.statement;
  dom.probFigure.innerHTML = prob.svg;
  dom.selectProblem.value = String(index);
  dom.btnPrev.disabled = index === 0;
  dom.btnNext.disabled = index === state.filteredProblems.length - 1;

  // ステップ1の準備
  const [t1, t2] = prob.triangles;
  dom.step1Prompt.innerHTML = `$\\triangle ${t1}$ と $\\triangle ${t2}$ で、等しいとわかる辺や角を、記号を使ってすべて書き出しましょう。問題文に書いてあることだけでなく、図からわかることも探してみよう。`;
  const keys = buildStep1Keys(prob);
  Object.assign(state.step1, {
    lines: [""],
    active: 0,
    results: [],
    cleared: false,
    requiredKeys: keys.required,
    extraKeys: keys.extra
  });
  renderKeypad();
  hideFeedback(dom.step1Feedback);

  // ステップ2の準備
  state.pieces = buildPieces(prob);
  resetStep2();

  renderStep1();
  renderStepLock();
  renderMath(dom.probStatement, dom.step1Prompt);
}

// ============================================================
// ステップ1：等しい辺や角を書き出す
// ============================================================
function renderKeypad() {
  const letters = state.prob.points
    .map(p => `<button type="button" class="key" data-key="${p}" aria-label="${p}">${p}</button>`)
    .join("");
  dom.keypad.innerHTML = `
    ${letters}
    <button type="button" class="key key-sym" data-key="∠" aria-label="角の記号">∠</button>
    <button type="button" class="key key-sym" data-key="=" aria-label="イコール">=</button>
    <button type="button" class="key key-fn" data-action="back" aria-label="1文字消す">⌫ 1字消す</button>
    <button type="button" class="key key-fn" data-action="newline" aria-label="次の行へ">↵ 次の行</button>
  `;
}

function renderStep1() {
  const s = state.step1;
  const markSymbol = { ok: "○", ng: "×", extra: "△" };

  dom.eqLines.innerHTML = s.lines.map((line, i) => {
    const r = s.results ? s.results[i] : null;
    const isActive = i === s.active && !s.cleared;
    const content = line
      ? escapeHtml(formatPlain(line))
      : `<span class="eq-placeholder">${isActive ? "下のボタンで入力" : "（空らん）"}</span>`;
    return `
      <div class="eq-line ${isActive ? "is-active" : ""} ${r ? `mark-${r.mark}` : ""}">
        <span class="eq-bullet">・</span>
        <button type="button" class="eq-text" data-line="${i}" aria-label="${i + 1}行目" ${s.cleared ? "disabled" : ""}>${content}${isActive ? '<span class="eq-caret"></span>' : ""}</button>
        ${r ? `<span class="eq-mark" aria-label="${r.mark === "ok" ? "正しい" : r.mark === "ng" ? "まちがい" : "使わない"}">${markSymbol[r.mark]}</span>` : ""}
        ${!s.cleared && s.lines.length > 1 ? `<button type="button" class="eq-del" data-del="${i}" aria-label="${i + 1}行目を消す">✕</button>` : ""}
        ${r && r.msg ? `<div class="eq-msg">${r.msg}</div>` : ""}
      </div>`;
  }).join("");

  dom.keypadWrap.classList.toggle("hidden", s.cleared);
  dom.step1Status.classList.toggle("hidden", !s.cleared);
}

// 書きかえたら、その行の答え合わせの結果だけを消す（ほかの行の ○ などは残す）
function onStep1Edited() {
  hideFeedback(dom.step1Feedback);
  renderStep1();
}

function typeChar(ch) {
  const s = state.step1;
  if (s.cleared) return;
  if (s.lines[s.active].length >= MAX_CHARS) return;
  Sound.playClick();
  s.lines[s.active] += ch;
  s.results[s.active] = null;
  onStep1Edited();
}

function backspace() {
  const s = state.step1;
  if (s.cleared) return;
  Sound.playClick();
  if (s.lines[s.active] === "" && s.lines.length > 1) {
    s.lines.splice(s.active, 1);
    s.results.splice(s.active, 1);
    s.active = Math.max(0, s.active - 1);
  } else {
    s.lines[s.active] = s.lines[s.active].slice(0, -1);
    s.results[s.active] = null;
  }
  onStep1Edited();
}

function newLine() {
  const s = state.step1;
  if (s.cleared) return;
  if (s.lines[s.active] === "") return;            // 空の行のままでは増やさない
  if (s.lines.length >= MAX_LINES) {
    Sound.playNotice();
    return;
  }
  Sound.playClick();
  s.lines.splice(s.active + 1, 0, "");
  s.results.splice(s.active + 1, 0, null);
  s.active += 1;
  onStep1Edited();
}

function deleteLine(i) {
  const s = state.step1;
  if (s.cleared || s.lines.length <= 1) return;
  Sound.playClick();
  s.lines.splice(i, 1);
  s.results.splice(i, 1);
  if (s.active >= s.lines.length) s.active = s.lines.length - 1;
  else if (s.active > i) s.active -= 1;
  onStep1Edited();
}

function selectLine(i) {
  const s = state.step1;
  if (s.cleared) return;
  s.active = i;
  renderStep1();
}

function resetStep1() {
  const s = state.step1;
  if (s.cleared) return;
  Sound.playClick();
  s.lines = [""];
  s.results = [];
  s.active = 0;
  onStep1Edited();
}

// 答え合わせで今の行が認められたら（○ か △）、自動で次の空いた行へ移る
function moveToNextEmptyLine() {
  const s = state.step1;
  const r = s.results[s.active];
  if (!r || r.mark === "ng") return;          // × の行は直せるようにそのまま
  let next = s.lines.findIndex(l => l.trim() === "");
  if (next === -1) {
    if (s.lines.length >= MAX_LINES) return;
    s.lines.push("");
    s.results.push(null);
    next = s.lines.length - 1;
  }
  s.active = next;
}

function checkStep1() {
  const s = state.step1;
  if (s.cleared) return;

  if (s.lines.every(l => l.trim() === "")) {
    Sound.playNotice();
    showFeedback(dom.step1Feedback, "warning", feedbackHtml("⚠️ まだ何も書いていません", "下のボタンを使って、等しい辺や角を書きましょう。"));
    return;
  }

  const found = new Set();
  s.results = s.lines.map(line => {
    const r = readEquality(line, state.prob);
    if (r.empty) return null;
    if (r.error) return { mark: "ng", msg: r.error };
    if (found.has(r.key)) return { mark: "ng", msg: "同じことを2回書いています" };
    found.add(r.key);
    if (s.requiredKeys.includes(r.key)) return { mark: "ok", msg: "" };
    if (s.extraKeys.includes(r.key)) return { mark: "extra", msg: "正しいけれど、この2つの三角形の証明には使いません" };
    return { mark: "ng", msg: "問題文や図からは、まだこの2つが等しいとは言えません" };
  });

  const wrongCount = s.results.filter(r => r && r.mark === "ng").length;
  const missing = s.requiredKeys.filter(k => !found.has(k)).length;

  if (wrongCount === 0 && missing === 0) {
    s.cleared = true;
    Sound.playSuccess();
    renderStep1();
    showFeedback(dom.step1Feedback, "success", feedbackHtml(
      "🎉 正解！ 等しい辺や角をすべて見つけられました。",
      "次は、ステップ2でこれを使って証明を組み立てましょう。"
    ));
    renderStepLock();
    setTimeout(() => dom.step2.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    return;
  }

  Sound.playNotice();
  moveToNextEmptyLine();
  renderStep1();
  if (wrongCount > 0) {
    showFeedback(dom.step1Feedback, "error", feedbackHtml(
      "× のついた行を見直しましょう",
      "書き方がちがうか、問題文や図からは言えないことが書かれています。行をタップすると書き直せます。"
    ));
  } else {
    showFeedback(dom.step1Feedback, "warning", feedbackHtml(
      `あと ${missing} つあります`,
      "問題文に書いてあることのほかに、図からわかること（対頂角、共通な辺、平行線の角など）も探してみよう。"
    ));
  }
}

// ============================================================
// ステップ2：カードを並べて証明を書く
// ============================================================
function renderStepLock() {
  const unlocked = state.step1.cleared;
  dom.step2Locked.classList.toggle("hidden", unlocked);
  dom.step2Body.classList.toggle("hidden", !unlocked);
  dom.btnClear.classList.toggle("hidden", !unlocked);
  dom.step2.classList.toggle("is-locked", !unlocked);
  dom.step2.classList.toggle("border-indigo-200", unlocked);
  dom.step2.classList.toggle("border-slate-200", !unlocked);

  if (unlocked) {
    const s = state.step1;
    const okLines = s.lines.filter((_, i) => s.results && s.results[i] && s.results[i].mark === "ok");
    dom.step2Found.innerHTML = `ステップ1で見つけた等しい辺や角：<span class="font-semibold text-slate-800">${okLines.map(l => escapeHtml(formatPlain(l))).join("、 ")}</span>`;
  }
}

function resetStep2() {
  state.answer = [];
  state.palette = shuffle(state.pieces);
  state.lastMovedId = null;
  hideFeedback(dom.feedbackArea);
  renderPieces();
}

// 解答らんでの表示（①②③ と「①, ②, ③より、」を自動でつける）
function displayText(piece, index) {
  if (piece.type === "equation") {
    const num = state.answer.slice(0, index + 1).filter(p => p.type === "equation").length;
    return `${piece.text} <span class="auto-num">…… ${CIRCLED[num - 1] || num}</span>`;
  }
  if (piece.type === "condition") {
    const nums = state.answer.slice(0, index)
      .filter(p => p.type === "equation")
      .map((_, i) => CIRCLED[i] || i + 1);
    return nums.length
      ? `<span class="auto-num">${nums.join(", ")}より、</span>${piece.text}`
      : piece.text;
  }
  return piece.text;
}

function onAnswerChanged() {
  hideFeedback(dom.feedbackArea);
  renderPieces();
}

function movePiece(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= state.answer.length) return;
  Sound.playClick();
  const list = state.answer;
  [list[index], list[target]] = [list[target], list[index]];
  state.lastMovedId = list[target].id;
  onAnswerChanged();
}

function removePiece(index) {
  Sound.playClick();
  const [piece] = state.answer.splice(index, 1);
  state.palette.push(piece);
  state.lastMovedId = null;
  onAnswerChanged();
}

function addPiece(index) {
  Sound.playClick();
  const [piece] = state.palette.splice(index, 1);
  state.answer.push(piece);
  state.lastMovedId = null;
  onAnswerChanged();
}

function renderPieces() {
  // 証明（解答らん）
  dom.dropZone.innerHTML = "";
  if (state.answer.length === 0) {
    dom.dropZone.innerHTML = `
      <div class="text-xs text-slate-400 text-center py-10 pointer-events-none">
        下の「カード」をタップすると、ここに入ります。<br>
        上から順に読んで、証明になるように並べましょう。
      </div>`;
  } else {
    const last = state.answer.length - 1;
    state.answer.forEach((piece, index) => {
      const card = document.createElement("div");
      card.className = "phrase-card drop-item px-3 py-2 rounded-lg text-xs sm:text-sm font-medium";
      if (piece.id === state.lastMovedId) card.classList.add("just-moved");
      card.innerHTML = `
        <span class="step-number">${index + 1}</span>
        <span class="flex-1 text-slate-800">${displayText(piece, index)}</span>
        <div class="flex items-center gap-1 ml-2 shrink-0">
          <button type="button" class="sort-btn" data-act="up" aria-label="${index + 1}行目を上へ" ${index === 0 ? "disabled" : ""}>▲</button>
          <button type="button" class="sort-btn" data-act="down" aria-label="${index + 1}行目を下へ" ${index === last ? "disabled" : ""}>▼</button>
          <button type="button" class="remove-btn ml-0.5" data-act="remove" aria-label="${index + 1}行目をカードに戻す">✕</button>
        </div>`;
      card.querySelector('[data-act="up"]').addEventListener("click", () => movePiece(index, -1));
      card.querySelector('[data-act="down"]').addEventListener("click", () => movePiece(index, 1));
      card.querySelector('[data-act="remove"]').addEventListener("click", () => removePiece(index));
      dom.dropZone.appendChild(card);
    });
  }

  // カード置き場（番号はつけない）
  dom.paletteZone.innerHTML = "";
  if (state.palette.length === 0) {
    dom.paletteZone.innerHTML = `<div class="w-full text-xs text-slate-400 text-center py-6 pointer-events-none">カードはすべて証明に入っています。</div>`;
  }
  state.palette.forEach((piece, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "phrase-card palette-item px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-800";
    card.innerHTML = `<span>${piece.text}</span>`;
    card.addEventListener("click", () => addPiece(index));
    dom.paletteZone.appendChild(card);
  });

  renderMath(dom.dropZone, dom.paletteZone);
}

function failStep2(type, title, body) {
  Sound.playNotice();
  showFeedback(dom.feedbackArea, type, feedbackHtml(title, body));
}

function checkStep2() {
  const ans = state.answer;
  const n = ans.length;

  if (n === 0) {
    failStep2("warning", "⚠️ まだカードがありません", "下のカードをタップして、証明を組み立てましょう。");
    return;
  }

  // 1. 使わないカードが入っていないか
  const dummyAt = ans.findIndex(p => p.dummy);
  if (dummyAt !== -1) {
    failStep2("error", `${dummyAt + 1}行目のカードは、この証明では使いません`,
      "問題文や図から本当に言えることか、合同を証明したあとでわかることを先に使っていないか、合同条件が合っているかを確かめましょう。");
    return;
  }

  // 2. 必要なカードがそろっているか
  const missing = state.pieces.filter(p => !p.dummy && !ans.includes(p)).length;
  if (missing > 0) {
    failStep2("warning", `必要なカードが、あと ${missing} 枚あります`,
      "ステップ1で見つけた等しい辺や角と、その理由がすべて入っているか確かめましょう。");
    return;
  }

  // 3. 書き始め
  if (ans[0].type !== "target") {
    failStep2("error", "1行目を見直しましょう",
      "証明は、どの三角形について考えるのかを書く「△… と △… において」から始めます。");
    return;
  }

  // 4. 最後の行
  if (ans[n - 1].type !== "conclusion") {
    failStep2("error", "最後の行を見直しましょう",
      "証明の最後は、2つの三角形が合同であること（△… ≡ △…）を書いて終わります。");
    return;
  }

  // 5. 合同条件の位置
  if (ans[n - 2].type !== "condition") {
    failStep2("error", "合同条件のカードの位置を見直しましょう",
      "合同条件は、等しい辺や角をすべて書いたあと、最後の行のすぐ前に置きます。");
    return;
  }

  // 6. 「理由 → その理由でわかる等式」の組になっているか
  let i = 1;
  while (i < n - 2) {
    const reason = ans[i];
    if (reason.type !== "reason") {
      failStep2("error", `${i + 1}行目を見直しましょう`,
        "等しい辺や角を書く前に、「仮定より、」のような、なぜ等しいのかという理由を書きます。");
      return;
    }
    let j = i + 1;
    while (j < n - 2 && ans[j].type === "equation") {
      if (ans[j].block !== reason.block) {
        failStep2("error", `${j + 1}行目を見直しましょう`,
          `${i + 1}行目の理由からは、${j + 1}行目のことは言えません。理由と、その理由でわかることの組み合わせを確かめましょう。`);
        return;
      }
      j++;
    }
    if (j === i + 1) {
      failStep2("error", `${i + 1}行目のあとを見直しましょう`,
        "理由を書いたら、そのすぐ後に、その理由でわかる等しい辺や角を書きます。");
      return;
    }
    i = j;
  }

  // ---- 正解！ ----
  Sound.playSuccess();
  const { counted } = Storage.recordClear(state.prob.id);
  updateStatsUI();
  renderProblemOptions();

  const hasNext = state.index < state.filteredProblems.length - 1;
  showFeedback(dom.feedbackArea, "success", `
    <div class="font-bold text-base mb-1">🎉 正解！ 証明が書けました。</div>
    ${counted ? "" : `<p class="text-[11px] text-emerald-700/80 mb-2">※この問題は今日すでに正解しているので、今日の問題数は増えません。</p>`}
    <p class="text-xs sm:text-sm mb-3">${state.prob.explanation}</p>
    <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-300 text-xs text-slate-700 space-y-1">
      <div class="font-bold text-emerald-900 mb-1">📘 合同の証明の書き方</div>
      <div><span class="flow-badge flow-target mr-1">1</span> どの三角形について考えるかを書く（△… と △… において）</div>
      <div><span class="flow-badge flow-fact mr-1">2</span> 理由を書いてから、等しい辺や角を書く（①②③）</div>
      <div><span class="flow-badge flow-condition mr-1">3</span> 使った合同条件を書く（①, ②, ③より、…）</div>
      <div><span class="flow-badge flow-conclusion mr-1">4</span> 合同であることを書く（△… ≡ △…）</div>
    </div>
    ${hasNext ? `<div class="flex justify-end mt-3"><button type="button" id="btn-go-next" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg">次の問題へ ▶</button></div>` : ""}
  `);
  const goNext = document.getElementById("btn-go-next");
  if (goNext) {
    goNext.addEventListener("click", () => {
      Sound.playClick();
      loadProblem(state.index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ============================================================
// 名前の登録
// ============================================================
function isModalOpen() {
  return !dom.profileModal.classList.contains("hidden");
}

function openProfileModal() {
  const user = Storage.getActiveUser();
  dom.inputProfileId.value = user === "guest" ? "" : user;
  dom.profileModal.classList.remove("hidden");
  setTimeout(() => dom.inputProfileId.focus(), 0);
}

function closeProfileModal() {
  dom.profileModal.classList.add("hidden");
  dom.btnProfile.focus();
}

function saveProfile() {
  Sound.playClick();
  Storage.setActiveUser(dom.inputProfileId.value.trim() || "guest");
  updateStatsUI();
  renderProblemOptions();
  closeProfileModal();
}

// ============================================================
// イベント登録
// ============================================================
function initEvents() {
  // 最初のタップで音を出せるようにする（各ボタンの処理より先に実行）
  window.addEventListener("pointerdown", () => Sound.init(), { capture: true });
  window.addEventListener("keydown", () => Sound.init(), { capture: true, once: true });

  // --- ステップ1 ---
  dom.keypad.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.key) typeChar(btn.dataset.key);
    else if (btn.dataset.action === "back") backspace();
    else if (btn.dataset.action === "newline") newLine();
  });
  dom.eqLines.addEventListener("click", e => {
    const del = e.target.closest("[data-del]");
    if (del) { deleteLine(Number(del.dataset.del)); return; }
    const line = e.target.closest("[data-line]");
    if (line) selectLine(Number(line.dataset.line));
  });
  dom.btnStep1Reset.addEventListener("click", resetStep1);
  dom.btnStep1Check.addEventListener("click", checkStep1);

  // パソコンのキーボードでの入力（ステップ1）
  document.addEventListener("keydown", e => {
    if (isModalOpen() || state.step1.cleared) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    const onOtherButton = tag === "BUTTON" && !e.target.closest("#keypad, #eq-lines");

    const upper = e.key.length === 1 ? e.key.toUpperCase() : "";
    if (upper && state.prob.points.includes(upper)) { e.preventDefault(); typeChar(upper); }
    else if (e.key === "=") { e.preventDefault(); typeChar("="); }
    else if (e.key === "<") { e.preventDefault(); typeChar("∠"); }
    else if (e.key === "Backspace") { e.preventDefault(); backspace(); }
    else if (e.key === "Enter" && !onOtherButton) { e.preventDefault(); newLine(); }
  });

  // --- ステップ2 ---
  dom.btnCheck.addEventListener("click", checkStep2);
  dom.btnClear.addEventListener("click", () => {
    Sound.playClick();
    resetStep2();
  });

  // --- 問題の切りかえ ---
  dom.btnPrev.addEventListener("click", () => {
    if (state.index > 0) { Sound.playClick(); loadProblem(state.index - 1); }
  });
  dom.btnNext.addEventListener("click", () => {
    if (state.index < state.filteredProblems.length - 1) { Sound.playClick(); loadProblem(state.index + 1); }
  });
  dom.selectProblem.addEventListener("change", e => {
    Sound.playClick();
    loadProblem(Number(e.target.value));
  });
  dom.selectUnit.addEventListener("change", e => {
    Sound.playClick();
    filterProblems(e.target.value);
  });

  // --- 音 ---
  dom.btnSoundToggle.addEventListener("click", () => {
    const next = !Storage.getSoundEnabled();
    Storage.setSoundEnabled(next);
    updateSoundUI();
    if (next) Sound.playClick();
  });

  // --- 名前の登録 ---
  dom.btnProfile.addEventListener("click", () => { Sound.playClick(); openProfileModal(); });
  dom.btnProfileCancel.addEventListener("click", () => { Sound.playClick(); closeProfileModal(); });
  dom.btnProfileSave.addEventListener("click", saveProfile);
  dom.inputProfileId.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); saveProfile(); }
  });
  dom.profileModal.addEventListener("click", e => {
    if (e.target === dom.profileModal) closeProfileModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isModalOpen()) closeProfileModal();
  });
}

// ============================================================
// 起動
// ============================================================
function initApp() {
  initEvents();
  updateStatsUI();
  updateSoundUI();
  initUnitSelector();
  filterProblems("all");
}

window.addEventListener("DOMContentLoaded", initApp);
