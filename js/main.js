import { allProblems } from "./problems/index.js";
import { Storage } from "./storage.js";

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
// アプリ全体の状態
// ============================================================
const state = {
  currentUnit: "all",
  filteredProblems: [...allProblems],
  currentProblemIndex: 0,
  availablePieces: [],
  answerPieces: [],
  lastMovedId: null
};

// DOM参照
const dom = {
  selectUnit: document.getElementById("select-unit"),
  selectProblem: document.getElementById("select-problem"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  probBadge: document.getElementById("prob-badge"),
  probTag: document.getElementById("prob-tag"),
  probTitle: document.getElementById("prob-title"),
  probStatement: document.getElementById("prob-statement"),
  probFigure: document.getElementById("prob-figure"),
  dropZone: document.getElementById("drop-zone"),
  paletteZone: document.getElementById("palette-zone"),
  btnCheck: document.getElementById("btn-check"),
  btnClear: document.getElementById("btn-clear"),
  feedbackArea: document.getElementById("feedback-area"),
  statToday: document.getElementById("stat-today"),
  statBest: document.getElementById("stat-best"),
  userDisplay: document.getElementById("user-display"),
  btnProfile: document.getElementById("btn-profile"),
  profileModal: document.getElementById("profile-modal"),
  inputProfileId: document.getElementById("input-profile-id"),
  btnProfileSave: document.getElementById("btn-profile-save"),
  btnProfileCancel: document.getElementById("btn-profile-cancel"),
  btnSoundToggle: document.getElementById("btn-sound-toggle"),
  soundIcon: document.getElementById("sound-icon")
};

// ============================================================
// ユーティリティ
// ============================================================

// KaTeX自動レンダリング（書き換えた要素だけを対象にする）
function renderMath(...elements) {
  if (!window.renderMathInElement) return;
  const targets = elements.length ? elements : [document.body];
  targets.forEach(el => {
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

// ユーザー入力（ニックネーム）を表示するときの安全対策
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

// ============================================================
// UI更新
// ============================================================
function updateStatsUI() {
  const data = Storage.loadData();
  dom.statToday.textContent = data.clearedToday;
  dom.statBest.textContent = data.bestDaily;
  const currentUser = Storage.getActiveUser();
  dom.userDisplay.textContent = currentUser === "guest" ? "ゲスト" : currentUser;
}

function updateSoundUI() {
  const on = Storage.getSoundEnabled();
  dom.soundIcon.textContent = on ? "🔊" : "🔇";
  dom.btnSoundToggle.setAttribute("aria-pressed", on ? "true" : "false");
}

// 単元セレクトボックスを問題データから動的生成
function initUnitSelector() {
  const unitsMap = new Map();
  allProblems.forEach(p => {
    if (!unitsMap.has(p.unit)) unitsMap.set(p.unit, p.unitLabel);
  });

  let optionsHtml = '<option value="all">すべて表示</option>';
  unitsMap.forEach((label, key) => {
    optionsHtml += `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
  });
  dom.selectUnit.innerHTML = optionsHtml;
}

// 単元フィルタリング
function filterProblems(unitKey) {
  state.currentUnit = unitKey;
  state.filteredProblems = unitKey === "all"
    ? [...allProblems]
    : allProblems.filter(p => p.unit === unitKey);

  dom.selectProblem.innerHTML = state.filteredProblems
    .map((p, idx) => `<option value="${idx}">問${idx + 1}: ${escapeHtml(p.title)}</option>`)
    .join("");

  loadProblem(0);
}

// 問題の読み込み
function loadProblem(index) {
  if (state.filteredProblems.length === 0) return;
  if (index < 0 || index >= state.filteredProblems.length) return;

  state.currentProblemIndex = index;
  const prob = state.filteredProblems[index];

  dom.probBadge.textContent = `難易度: ${prob.difficulty}`;
  dom.probTag.textContent = prob.unitLabel;
  dom.probTitle.textContent = `問${index + 1}. ${prob.title}`;
  dom.probStatement.innerHTML = prob.statement;
  dom.probFigure.innerHTML = prob.svg;
  dom.selectProblem.value = String(index);

  dom.btnPrev.disabled = index === 0;
  dom.btnNext.disabled = index === state.filteredProblems.length - 1;

  state.answerPieces = [];
  state.availablePieces = shuffle(prob.pieces);
  state.lastMovedId = null;

  hideFeedback();
  renderPieces();
  renderMath(dom.probStatement);
}

// ============================================================
// カードの描画（解答欄 & パレット）★ネタバレなし
// ============================================================

// 解答が変わったら、前回の判定結果は無効なので消す
function onAnswerChanged() {
  hideFeedback();
  renderPieces();
}

function movePiece(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= state.answerPieces.length) return;
  Sound.playClick();
  const list = state.answerPieces;
  [list[index], list[target]] = [list[target], list[index]];
  state.lastMovedId = list[target].id;
  onAnswerChanged();
}

function removePiece(index) {
  Sound.playClick();
  const [piece] = state.answerPieces.splice(index, 1);
  state.availablePieces.push(piece);
  state.lastMovedId = null;
  onAnswerChanged();
}

function addPiece(index) {
  Sound.playClick();
  const [piece] = state.availablePieces.splice(index, 1);
  state.answerPieces.push(piece);
  state.lastMovedId = null;
  onAnswerChanged();
}

function renderPieces() {
  // 1. 解答欄
  dom.dropZone.innerHTML = "";
  if (state.answerPieces.length === 0) {
    dom.dropZone.innerHTML = `
      <div class="text-xs text-slate-400 text-center py-12 pointer-events-none">
        下の「持ち駒パレット」からパーツをタップして追加してください。<br>
        追加したカードは【▲】【▼】で順序を入れ替え、【✕】でパレットに戻せます。
      </div>`;
  } else {
    const last = state.answerPieces.length - 1;
    state.answerPieces.forEach((piece, index) => {
      const card = document.createElement("div");
      card.className = "phrase-card drop-item px-3 py-2 rounded-lg text-xs sm:text-sm font-medium";
      if (piece.id === state.lastMovedId) card.classList.add("just-moved");

      card.innerHTML = `
        <span class="step-number">${index + 1}</span>
        <span class="flex-1 text-slate-800">${piece.text}</span>
        <div class="flex items-center gap-1 ml-2 shrink-0">
          <button type="button" class="sort-btn btn-up" aria-label="${index + 1}行目を上へ移動" ${index === 0 ? "disabled" : ""}>▲</button>
          <button type="button" class="sort-btn btn-down" aria-label="${index + 1}行目を下へ移動" ${index === last ? "disabled" : ""}>▼</button>
          <button type="button" class="remove-btn btn-remove ml-0.5" aria-label="${index + 1}行目をパレットに戻す">✕</button>
        </div>
      `;

      card.querySelector(".btn-up").addEventListener("click", () => movePiece(index, -1));
      card.querySelector(".btn-down").addEventListener("click", () => movePiece(index, 1));
      card.querySelector(".btn-remove").addEventListener("click", () => removePiece(index));

      dom.dropZone.appendChild(card);
    });
  }

  // 2. パレット（※ネタバレ用のバッジ等は一切表示しない）
  dom.paletteZone.innerHTML = "";
  if (state.availablePieces.length === 0) {
    dom.paletteZone.innerHTML = `
      <div class="w-full text-xs text-slate-400 text-center py-6 pointer-events-none">
        パーツはすべて解答欄に移動しました。
      </div>`;
  }
  state.availablePieces.forEach((piece, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "phrase-card palette-item px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-800";
    card.innerHTML = `<span>${piece.text}</span>`;
    card.addEventListener("click", () => addPiece(index));
    dom.paletteZone.appendChild(card);
  });

  renderMath(dom.dropZone, dom.paletteZone);
}

// ============================================================
// 判定エンジン
// ============================================================
function fail(type, title, body) {
  Sound.playNotice();
  showFeedback(type, `
    <div class="font-bold text-base mb-1">${title}</div>
    <p class="text-xs sm:text-sm">${body}</p>
  `);
}

function checkAnswer() {
  const prob = state.filteredProblems[state.currentProblemIndex];
  const userPieces = state.answerPieces;
  const userIds = userPieces.map(p => p.id);
  const required = prob.requiredIds;

  if (userPieces.length === 0) {
    fail("warning", "⚠️ まだパーツがありません", "パレットからパーツをタップして証明を組み立ててください。");
    return;
  }

  // 1. 使えないフレーズ（ダミー）が含まれていないか
  if (userPieces.some(p => p.role === "dummy")) {
    fail("error", "❌ 使えないフレーズが含まれています",
      "問題文の条件や図からは言えないこと、またはこの問題に当てはまらない合同条件が入っていないか見直してみましょう。");
    return;
  }

  // 2. 必要なパーツがすべて揃っているか
  if (required.some(id => !userIds.includes(id))) {
    fail("warning", "⚠️ 証明に必要なパーツが足りません",
      "合同条件を言うための「理由」と「等式（①②③）」がすべて揃っているか確認してください。");
    return;
  }

  // 3. 書き出し（宣言）
  if (userPieces[0].role !== "target") {
    fail("error", "💡 証明の書き出し（宣言）を確認しましょう",
      "証明はまず「どの三角形とどの三角形について考えるのか」を宣言する『〜において』から書き始めます。");
    return;
  }

  // 4. 結び（結論）
  if (userPieces[userPieces.length - 1].role !== "conclusion") {
    fail("error", "💡 証明の結び（結論）を確認しましょう",
      "証明の最後は、求められている結論（合同の式）で締めくくります。");
    return;
  }

  // 5. 合同条件の位置
  if (userPieces.findIndex(p => p.role === "condition") !== userPieces.length - 2) {
    fail("error", "💡 合同条件の位置を見直しましょう",
      "『①, ②, ③より、〜』という合同条件は、すべての根拠と等式を挙げ終えた後、結論の直前に置きます。");
    return;
  }

  // 6. 根拠・等式の順番（「理由 → 等式」の順、①②③が番号順）
  const wrongAt = userIds.findIndex((id, i) => id !== required[i]);
  if (wrongAt !== -1) {
    fail("error", `💡 ${wrongAt + 1}行目あたりの順番を見直しましょう`,
      "「仮定より、」「〜ので、」などの理由は、それが説明する等式の<strong>すぐ前</strong>に置きます。また、等式は①→②→③の番号順に並べましょう。");
    return;
  }

  // ---- すべてクリア：正解！ ----
  Sound.playSuccess();
  const { counted } = Storage.recordClear(prob.id);
  updateStatsUI();

  const countNote = counted
    ? ""
    : `<p class="text-[11px] text-emerald-700/80 mb-2">※この問題は今日すでにカウント済みのため、今日の問題数は増えません。</p>`;

  showFeedback("success", `
    <div class="font-bold text-base mb-1">🎉 素晴らしい！証明の「型」が完璧に整っています！</div>
    ${countNote}
    <p class="text-xs sm:text-sm mb-3">${prob.explanation}</p>
    <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-300 text-xs text-slate-700 space-y-1">
      <div class="font-bold text-emerald-900 mb-1">📘 この証明の論理フロー:</div>
      <div><span class="flow-badge flow-target mr-1">1. 宣言</span> 着目する三角形を示す（〜において）</div>
      <div><span class="flow-badge flow-fact mr-1">2. 根拠・等式</span> 理由（仮定・図形の性質）を述べてから、等しい辺・角を書く（①②③）</div>
      <div><span class="flow-badge flow-condition mr-1">3. 合同条件</span> 揃った条件に当てはまる合同条件を示す</div>
      <div><span class="flow-badge flow-conclusion mr-1">4. 結論</span> 三角形が合同であることを結ぶ</div>
    </div>
  `);
}

// ============================================================
// フィードバック表示
// ============================================================
function showFeedback(type, htmlContent) {
  const area = dom.feedbackArea;
  area.classList.remove("hidden", "feedback-success", "feedback-warning", "feedback-error");
  area.classList.add(`feedback-${type === "success" || type === "warning" ? type : "error"}`);
  area.innerHTML = htmlContent;
  renderMath(area);
}

function hideFeedback() {
  dom.feedbackArea.classList.add("hidden");
  dom.feedbackArea.innerHTML = "";
}

// ============================================================
// プロファイルモーダル
// ============================================================
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
  closeProfileModal();
}

// ============================================================
// イベント登録
// ============================================================
function initEvents() {
  // 最初のタップで音声を有効化（capture で各ボタンの処理より先に実行される）
  window.addEventListener("pointerdown", () => Sound.init(), { capture: true });
  window.addEventListener("keydown", () => Sound.init(), { capture: true, once: true });

  dom.btnCheck.addEventListener("click", checkAnswer);

  dom.btnClear.addEventListener("click", () => {
    Sound.playClick();
    loadProblem(state.currentProblemIndex);
  });

  dom.btnPrev.addEventListener("click", () => {
    if (state.currentProblemIndex > 0) {
      Sound.playClick();
      loadProblem(state.currentProblemIndex - 1);
    }
  });
  dom.btnNext.addEventListener("click", () => {
    if (state.currentProblemIndex < state.filteredProblems.length - 1) {
      Sound.playClick();
      loadProblem(state.currentProblemIndex + 1);
    }
  });

  dom.selectProblem.addEventListener("change", e => {
    Sound.playClick();
    loadProblem(Number(e.target.value));
  });

  dom.selectUnit.addEventListener("change", e => {
    Sound.playClick();
    filterProblems(e.target.value);
  });

  dom.btnSoundToggle.addEventListener("click", () => {
    const next = !Storage.getSoundEnabled();
    Storage.setSoundEnabled(next);
    updateSoundUI();
    if (next) Sound.playClick();
  });

  // プロファイル
  dom.btnProfile.addEventListener("click", () => {
    Sound.playClick();
    openProfileModal();
  });
  dom.btnProfileCancel.addEventListener("click", () => {
    Sound.playClick();
    closeProfileModal();
  });
  dom.btnProfileSave.addEventListener("click", saveProfile);
  dom.inputProfileId.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      saveProfile();
    }
  });
  // 背景（モーダルの外側）をタップしたら閉じる
  dom.profileModal.addEventListener("click", e => {
    if (e.target === dom.profileModal) closeProfileModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !dom.profileModal.classList.contains("hidden")) {
      closeProfileModal();
    }
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
