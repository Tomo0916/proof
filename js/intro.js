/**
 * 入門編
 * 証明に慣れるための5つの練習。問題は、定期テストの問題データから自動で作る。
 *   1 理由あて            図で色のついた辺や角が、なぜ等しいのかを選ぶ
 *   2 合同条件えらび      印のついた辺や角から、合同条件を選ぶ
 *   3 対応する頂点さがし  合同な三角形の、対応する点・正しい書き方を選ぶ
 *   4 穴うめ証明          完成した証明の空らんを選ぶ（レベル1〜3）
 *   5 ガイドつき並べかえ  わくに合わせてカードを入れ、証明を完成させる
 */
import { allProblems } from "./problems/index.js";
import { drawFigure } from "./figure.js";
import { texToPlain } from "./notation.js";
import { Storage } from "./storage.js";
import { CIRCLED, shortCondition } from "./proof-text.js";

const $ = id => document.getElementById(id);
const BASIC = allProblems.filter(p => p.tier !== "advanced");

// ============================================================
// 小さな道具
// ============================================================
const rand = n => Math.floor(Math.random() * n);
const pick = arr => arr[rand(arr.length)];
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}
function renderMath(el) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(el, {
    delimiters: [{ left: "$", right: "$", display: false }],
    throwOnError: false,
    macros: { "\\parallel": "\\mathbin{/\\!/}" }
  });
}
const tri = t => `$\\triangle ${t}$`;
const congruent = (a, b) => `$\\triangle ${a} \\equiv \\triangle ${b}$`;
// 3文字の並べかえ（正しいもの以外）
function wrongOrders(t) {
  const perms = [];
  const s = [...t];
  [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach(([a, b, c]) => perms.push(s[a] + s[b] + s[c]));
  return perms.filter(x => x !== t);
}

// ============================================================
// 理由の種類（理由あてで使う）
// ============================================================
const CATS = [
  { key: "katei", re: /^仮定より/, label: "仮定（問題文に書いてある）" },
  { key: "taichokaku", re: /対頂角/, label: "対頂角は等しい" },
  { key: "sakkaku", re: /錯角/, label: "平行線の錯角は等しい" },
  { key: "doui", re: /同位角/, label: "平行線の同位角は等しい" },
  { key: "kyotsuhen", re: /共通な辺/, label: "共通な辺" },
  { key: "kyotsukaku", re: /共通な角/, label: "共通な角" },
  { key: "chuten", re: /中点だから/, label: "中点" },
  { key: "nitoubun", re: /二等分線/, label: "角の二等分線" },
  { key: "teikaku", re: /^二等辺三角形の底角/, label: "二等辺三角形の底角は等しい" },
  { key: "seisankaku", re: /正三角形/, label: "正三角形の性質" },
  { key: "heikou", re: /平行四辺形の(向かい合う|対角線)/, label: "平行四辺形の性質" },
  { key: "chouhou", re: /長方形/, label: "長方形の性質" },
  { key: "hishi", re: /ひし形/, label: "ひし形の性質" },
  { key: "seihou", re: /正方形|45/, label: "正方形の性質" }
];
// まちがえやすい組（選択肢に入れる）
const CONFUSE = [
  ["taichokaku", "sakkaku", "doui"],
  ["katei", "kyotsuhen", "kyotsukaku", "chuten", "nitoubun"],
  ["teikaku", "seisankaku", "nitoubun", "katei"],
  ["heikou", "chouhou", "hishi", "seihou", "sakkaku"]
];
const catOf = text => CATS.find(c => c.re.test(text)) || null;

// 問題文に書いてある図形の性質（中点・正三角形など）は「仮定」とも言えるので、そのときは「仮定」を選択肢に入れない
const GIVEN_FIGURE = ["chuten", "nitoubun", "teikaku", "seisankaku", "heikou", "chouhou", "hishi", "seihou"];

function distractorCats(correctKey, n) {
  const ok = k => k !== correctKey && !(GIVEN_FIGURE.includes(correctKey) && k === "katei");
  const near = shuffle([...new Set(CONFUSE.filter(g => g.includes(correctKey)).flat())].filter(ok));
  const far = shuffle(CATS.map(c => c.key).filter(k => ok(k) && !near.includes(k)));
  return [...near.slice(0, 2), ...far].slice(0, n).map(k => CATS.find(c => c.key === k));
}

// ============================================================
// 図（等しい辺や角に印をつけて描く）
// ============================================================
function eqParts(tex) {
  const [l, r] = texToPlain(tex).split("=");
  return { l, r, isAngle: l.startsWith("∠"), right: /= ?90\^\\circ\$$/.test(tex) };
}

/**
 * 問題の図に、指定した等式の印をつけて描く
 * keepMarks: もとの図の印も残すか / highlight: 辺を色で目立たせるか
 */
function figureWith(p, equations, { keepMarks = false, highlight = false, parallels = true } = {}) {
  const f = p.figure;
  const sides = keepMarks ? [...(f.sides || [])] : [];
  const angles = keepMarks ? [...(f.angles || [])] : [];
  const rights = [...(f.rights || [])];
  const highlights = [];
  equations.forEach((tex, i) => {
    const e = eqParts(tex);
    const n = i + 1;
    if (e.right) {
      rights.push(e.l.slice(1), e.r.slice(1));
    } else if (e.isAngle) {
      angles.push({ angs: [e.l.slice(1), e.r.slice(1)], n: keepMarks ? 1 : n, r: 18 });
    } else {
      sides.push({ segs: [e.l, e.r], n: keepMarks ? 1 : n });
      if (highlight) highlights.push(e.l, e.r);
    }
  });
  return drawFigure({ ...f, sides, angles, rights: [...new Set(rights)], highlights, parallels: parallels ? f.parallels || [] : [] });
}

// 2つの三角形を並べた図（合同条件えらびの例）
const PAIR = { A: [25, 115], B: [95, 115], C: [45, 35], D: [145, 115], E: [215, 115], F: [165, 35] };
const PAIR_RIGHT = { A: [25, 30], B: [95, 115], C: [25, 115], D: [145, 30], E: [215, 115], F: [145, 115] };
const PAIR_SMALL = { A: [25, 115], B: [95, 115], C: [45, 35], D: [150, 115], E: [199, 115], F: [164, 59] };
const pairFig = (pts, marks) => drawFigure({ width: 238, height: 130, pts, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], ...marks });

// ============================================================
// 練習1：理由あて
// ============================================================
const REASON_POOL = BASIC.flatMap(p => p.proof.blocks
  .map(b => ({ p, b, cat: catOf(b.reason) }))
  .filter(x => x.cat)
  .flatMap(x => x.b.equations
    .map(eq => ({ ...x, eq, key: `${x.p.id}:${eq}` }))));

function makeReasonQuestion() {
  const it = pick(REASON_POOL);
  const choices = shuffle([it.cat, ...distractorCats(it.cat.key, 3)]);
  return {
    key: it.key,
    kind: "choice",
    figure: figureWith(it.p, [it.eq], { highlight: true }),
    statement: it.p.statement,
    prompt: `図で印をつけた ${it.eq} が成り立つ理由は？`,
    choices: choices.map(c => ({ label: c.label, correct: c.key === it.cat.key })),
    explain: `正解は「${it.cat.label}」です。証明では「${it.b.reason}」と書きます。`
  };
}

// ============================================================
// 練習2：合同条件えらび
// ============================================================
const NOT_CONGRUENT = "これだけでは合同とは言えない";
const CONDITION_LABELS = [
  "3組の辺", "2組の辺とその間の角", "1組の辺とその両端の角",
  "直角三角形の斜辺と1つの鋭角", "直角三角形の斜辺と他の1辺", NOT_CONGRUENT
];
const CONDITION_HINT = {
  "3組の辺": "辺が3組とも等しいので、「3組の辺」です。",
  "2組の辺とその間の角": "等しい角が、等しい2組の辺にはさまれているので、「2組の辺とその間の角」です。",
  "1組の辺とその両端の角": "等しい2組の角が、等しい辺の両はしにあるので、「1組の辺とその両端の角」です。",
  "直角三角形の斜辺と1つの鋭角": "直角三角形で、斜辺（直角の向かいの辺）と直角でない角が等しいので、「斜辺と1つの鋭角」です。",
  "直角三角形の斜辺と他の1辺": "直角三角形で、斜辺（直角の向かいの辺）ともう1つの辺が等しいので、「斜辺と他の1辺」です。"
};

// 問題データにはない、自分で考えるための例
const CONDITION_EXAMPLES = [
  {
    key: "ex-ssa",
    figure: pairFig(PAIR, { sides: [{ segs: ["AB", "DE"], n: 1 }, { segs: ["BC", "EF"], n: 2 }], angles: [{ angs: ["CAB", "FDE"], n: 1 }] }),
    equations: ["$AB = DE$", "$BC = EF$", "$\\angle A = \\angle D$"],
    answer: NOT_CONGRUENT,
    explain: "2組の辺は等しいですが、等しい角（$\\angle A$, $\\angle D$）は2つの辺の「間」にありません。これでは合同とは言えません。"
  },
  {
    key: "ex-aaa",
    figure: pairFig(PAIR_SMALL, { angles: [{ angs: ["CAB", "FDE"], n: 1 }, { angs: ["ABC", "DEF"], n: 2 }, { angs: ["BCA", "EFD"], n: 3 }] }),
    equations: ["$\\angle A = \\angle D$", "$\\angle B = \\angle E$", "$\\angle C = \\angle F$"],
    answer: NOT_CONGRUENT,
    explain: "角が3つとも等しくても、大きさがちがう三角形があります（図）。辺が1つも等しくないので、合同とは言えません。"
  },
  {
    key: "ex-legs",
    figure: pairFig(PAIR_RIGHT, { rights: ["ACB", "DFE"], sides: [{ segs: ["AC", "DF"], n: 1 }, { segs: ["CB", "FE"], n: 2 }] }),
    equations: ["$\\angle C = \\angle F = 90^\\circ$", "$AC = DF$", "$BC = EF$"],
    answer: "2組の辺とその間の角",
    explain: "直角三角形ですが、斜辺は等しいとわかっていません。直角（$\\angle C$, $\\angle F$）が、等しい2組の辺の「間の角」になっているので、「2組の辺とその間の角」です。"
  }
];

function makeConditionQuestion() {
  const useExample = Math.random() < 0.3;
  if (useExample) {
    const ex = pick(CONDITION_EXAMPLES);
    return {
      key: ex.key,
      kind: "choice",
      figure: ex.figure,
      prompt: `わかっていることは ${ex.equations.join("、")} です。合同条件はどれ？`,
      choices: CONDITION_LABELS.map(l => ({ label: l, correct: l === ex.answer })),
      explain: ex.explain
    };
  }
  const p = pick(BASIC);
  const eqs = p.proof.blocks.flatMap(b => b.equations);
  const answer = shortCondition(p);
  const [t1, t2] = p.triangles;
  return {
    key: p.id,
    kind: "choice",
    figure: figureWith(p, eqs, { parallels: false }),
    prompt: `${tri(t1)} と ${tri(t2)} で、わかっていることは ${eqs.join("、")} です。合同条件はどれ？`,
    choices: CONDITION_LABELS.map(l => ({ label: l, correct: l === answer })),
    explain: CONDITION_HINT[answer] || ""
  };
}

// ============================================================
// 練習3：対応する頂点さがし
// ============================================================
function makeCorrespondQuestion() {
  const p = pick(BASIC);
  const [t1, t2] = p.triangles;
  const eqs = p.proof.blocks.flatMap(b => b.equations);
  const others = [...t2].sort().join(", ");
  const pairs = [...t1].map((v, i) => `${v} と ${t2[i]}`).join("、");
  const figure = figureWith(p, eqs);
  if (Math.random() < 0.6) {
    const i = rand(3);
    return {
      key: `${p.id}:${i}`,
      kind: "choice",
      figure,
      prompt: `${tri(t1)} と、点 ${others} でできる三角形は合同です。図の同じ印を見て、点 $${t1[i]}$ に対応する点を選ぼう。`,
      choices: shuffle([...t2]).map(v => ({ label: `点 $${v}$`, correct: v === t2[i] })),
      explain: `対応する点は、${pairs} です。同じ印のついた辺や角を、順にたどって見つけます。`
    };
  }
  const wrong = shuffle(wrongOrders(t2)).slice(0, 2);
  return {
    key: `${p.id}:write`,
    kind: "choice",
    figure,
    prompt: `${tri(t1)} と、点 ${others} でできる三角形は合同です。合同を表す正しい書き方は？`,
    choices: shuffle([t2, ...wrong]).map(t => ({ label: congruent(t1, t), correct: t === t2 })),
    explain: `対応する点は、${pairs} です。対応する順に書くので、${congruent(t1, t2)} です。`
  };
}

// ============================================================
// 練習4：穴うめ証明
// ============================================================
const OTHER_REASONS = [
  "対頂角は等しいので、", "平行線の錯角は等しいので、", "平行線の同位角は等しいので、",
  "共通な辺だから、", "共通な角だから、", "仮定より、", "二等辺三角形の底角は等しいので、"
];
const ALL_CONDITIONS = [
  "3組の辺がそれぞれ等しいので", "2組の辺とその間の角がそれぞれ等しいので",
  "1組の辺とその両端の角がそれぞれ等しいので", "直角三角形の斜辺と1つの鋭角がそれぞれ等しいので",
  "直角三角形の斜辺と他の1辺がそれぞれ等しいので"
];

// 証明を行ごとに分ける
function proofLines(p) {
  const [t1, t2] = p.triangles;
  const lines = [{ type: "target", text: `${tri(t1)} と ${tri(t2)} において` }];
  let n = 0;
  p.proof.blocks.forEach((b, bi) => {
    lines.push({ type: "reason", block: bi, text: b.reason });
    b.equations.forEach(eq => {
      lines.push({ type: "equation", block: bi, text: eq, num: CIRCLED[n] });
      n += 1;
    });
  });
  lines.push({ type: "condition", prefix: `${CIRCLED.slice(0, n).join(", ")}より、`, text: p.proof.condition });
  lines.push({ type: "conclusion", text: congruent(t1, t2) });
  return lines;
}

function optionsFor(line, p) {
  if (line.type === "reason") {
    const used = p.proof.blocks.map(b => b.reason);
    const dummy = (p.dummies || []).filter(d => d.type === "reason").map(d => d.text);
    const pool = shuffle([...new Set([...dummy, ...shuffle(OTHER_REASONS)])].filter(r => !used.includes(r)));
    return shuffle([line.text, ...pool.slice(0, 2)]);
  }
  if (line.type === "condition") {
    const dummy = (p.dummies || []).filter(d => d.type === "condition").map(d => d.text);
    const pool = [...new Set([...dummy, ...shuffle(ALL_CONDITIONS)])].filter(c => c !== line.text);
    return shuffle([line.text, ...pool.slice(0, 2)]);
  }
  const [t1, t2] = p.triangles;
  return shuffle([line.text, ...shuffle(wrongOrders(t2)).slice(0, 2).map(t => congruent(t1, t))]);
}

const KANA = ["ア", "イ", "ウ", "エ", "オ", "カ"];

function makeFillQuestion(level) {
  const p = pick(BASIC);
  const lines = proofLines(p);
  const reasonIdx = lines.map((l, i) => (l.type === "reason" ? i : -1)).filter(i => i >= 0);
  const condIdx = lines.findIndex(l => l.type === "condition");
  const conclIdx = lines.findIndex(l => l.type === "conclusion");
  let blanks;
  if (level === 1) blanks = [pick([condIdx, conclIdx, pick(reasonIdx)])];
  else if (level === 2) blanks = [pick(reasonIdx), condIdx];
  else blanks = [...reasonIdx, condIdx, conclIdx];
  blanks.sort((a, b) => a - b);
  return {
    key: `${p.id}:${level}:${blanks.join(",")}`,
    kind: "fill",
    level,
    p,
    lines,
    blanks: blanks.map((li, k) => ({ line: li, name: KANA[k], options: optionsFor(lines[li], p), chosen: null })),
    active: 0
  };
}

// ============================================================
// 練習5：ガイドつき並べかえ
// ============================================================
const SLOT_LABEL = {
  target: "どの三角形かを示すカード",
  reason: "理由のカード",
  equation: "等しい辺や角のカード",
  condition: "合同条件のカード",
  conclusion: "結論のカード"
};
const SECTIONS = [
  { sec: 1, title: "三角形を示す" },
  { sec: 2, title: "理由と等しい辺・角" },
  { sec: 3, title: "合同条件" },
  { sec: 4, title: "結論" }
];

function makeGuidedQuestion() {
  const p = pick(BASIC);
  const [t1, t2] = p.triangles;
  const cards = [{ id: "target", type: "target", text: `${tri(t1)} と ${tri(t2)} において` }];
  const slots = [{ sec: 1, type: "target" }];
  p.proof.blocks.forEach((b, bi) => {
    cards.push({ id: `r${bi}`, type: "reason", block: bi, text: b.reason });
    slots.push({ sec: 2, type: "reason" });
    b.equations.forEach((eq, ei) => {
      cards.push({ id: `e${bi}-${ei}`, type: "equation", block: bi, text: eq });
      slots.push({ sec: 2, type: "equation" });
    });
  });
  cards.push({ id: "cond", type: "condition", text: p.proof.condition });
  slots.push({ sec: 3, type: "condition" });
  cards.push({ id: "concl", type: "conclusion", text: congruent(t1, t2) });
  slots.push({ sec: 4, type: "conclusion" });
  return {
    key: p.id,
    kind: "guided",
    p,
    cards: shuffle(cards),
    slots: slots.map(s => ({ ...s, card: null, wrong: false })),
    selected: null,
    checked: false
  };
}

// ============================================================
// 練習の一覧と進み具合
// ============================================================
const LESSONS = [
  { id: "reason", title: "理由あて", desc: "図で印をつけた辺や角が、なぜ等しいのかを選ぼう。", goal: 8, make: makeReasonQuestion },
  { id: "condition", title: "合同条件えらび", desc: "わかっている辺や角から、どの合同条件にあてはまるかを選ぼう。", goal: 8, make: makeConditionQuestion },
  { id: "correspond", title: "対応する頂点さがし", desc: "合同な2つの三角形で、どの点とどの点が対応するかを見つけよう。", goal: 6, make: makeCorrespondQuestion },
  { id: "fill", title: "穴うめ証明", desc: "完成した証明の空らんに入る言葉を選ぼう。レベル1〜3まであります。", levels: [1, 2, 3], goalPerLevel: 3 },
  { id: "guided", title: "ガイドつき並べかえ", desc: "わくに合わせてカードを入れ、証明を完成させよう。使わないカードはありません。", goal: 3, make: makeGuidedQuestion }
];

let progress = Storage.loadIntro();

function lessonProgress(lesson) {
  const rec = progress[lesson.id] || {};
  if (lesson.levels) {
    const levels = lesson.levels.map(lv => Math.min((rec.levels || {})[lv] || 0, lesson.goalPerLevel));
    const done = levels.reduce((a, b) => a + b, 0);
    const goal = lesson.levels.length * lesson.goalPerLevel;
    return { done, goal, cleared: done >= goal, levels };
  }
  const done = Math.min(rec.correct || 0, lesson.goal);
  return { done, goal: lesson.goal, cleared: done >= lesson.goal };
}

function recordCorrect(lesson, level) {
  const rec = progress[lesson.id] || {};
  if (level) {
    rec.levels = rec.levels || {};
    rec.levels[level] = (rec.levels[level] || 0) + 1;
  } else {
    rec.correct = (rec.correct || 0) + 1;
  }
  progress[lesson.id] = rec;
  Storage.saveIntro(progress);
}

// ============================================================
// 画面
// ============================================================
const view = $("view");
const state = { lesson: null, level: 1, q: null, answered: false, lastKey: null };
window.__introState = state;   // 動作確認（テスト）用

function progressBar({ done, goal }) {
  const pct = Math.round((done / goal) * 100);
  return `<div class="ip-bar"><span style="width:${pct}%"></span></div>`;
}

function renderHome() {
  state.lesson = null;
  document.title = "入門編 | 合同の証明トレーニング";
  const allCleared = LESSONS.every(l => lessonProgress(l).cleared);
  view.innerHTML = `
    <section class="intro-hero">
      <h1>入門編</h1>
      <p>証明を書く前に、図の見方・合同条件・証明の形を、ひとつずつ練習しよう。上から順に進めるのがおすすめです。</p>
    </section>
    <ol class="lesson-list">
      ${LESSONS.map((l, i) => {
        const pr = lessonProgress(l);
        return `
        <li>
          <a class="lesson ${pr.cleared ? "is-cleared" : ""}" href="#${l.id}">
            <span class="lesson-num">${pr.cleared ? "✓" : i + 1}</span>
            <span class="lesson-body">
              <span class="lesson-title">${l.title}</span>
              <span class="lesson-desc">${l.desc}</span>
              <span class="lesson-progress">${progressBar(pr)}<span>${pr.cleared ? "クリア" : `${pr.done} / ${pr.goal}`}</span></span>
            </span>
            <span class="lesson-go" aria-hidden="true">›</span>
          </a>
        </li>`;
      }).join("")}
    </ol>
    <div class="intro-next ${allCleared ? "is-ready" : ""}">
      <p>${allCleared ? "入門編をすべてクリアしました。いよいよ本番の問題に挑戦しよう！" : "入門編が終わったら、本番の問題（定期テスト）に進もう。"}</p>
      <a class="btn-primary" href="index.html">定期テストの問題へ</a>
    </div>`;
  window.scrollTo(0, 0);
}

function renderLesson() {
  const lesson = state.lesson;
  const pr = lessonProgress(lesson);
  document.title = `${lesson.title} | 入門編`;
  const levelTabs = lesson.levels ? `
    <div class="level-tabs" role="tablist" aria-label="レベル">
      ${lesson.levels.map((lv, i) => `
        <button type="button" role="tab" class="level-tab" data-level="${lv}" aria-selected="${state.level === lv}">
          レベル${lv}<small>${pr.levels[i] >= lesson.goalPerLevel ? "クリア" : `${pr.levels[i]} / ${lesson.goalPerLevel}`}</small>
        </button>`).join("")}
    </div>
    <p class="hint mb-3">${["", "空らんは1つ。", "空らんは2つ（理由と合同条件）。", "理由・合同条件・結論が、すべて空らん。"][state.level]}</p>` : "";

  view.innerHTML = `
    <a class="back-link" href="#">‹ 入門編</a>
    <div class="lesson-head">
      <h1>${lesson.title}</h1>
      <span class="lesson-count">${pr.cleared ? "クリア！" : `正解 ${pr.done} / ${pr.goal}`}</span>
    </div>
    ${progressBar(pr)}
    <p class="lesson-lead">${lesson.desc}</p>
    ${levelTabs}
    <div id="question"></div>`;
  renderQuestion();
}

function newQuestion() {
  const lesson = state.lesson;
  let q;
  for (let i = 0; i < 6; i++) {
    q = lesson.levels ? makeFillQuestion(state.level) : lesson.make();
    if (q.key !== state.lastKey) break;
  }
  state.q = q;
  state.lastKey = q.key;
  state.answered = false;
}

function renderQuestion() {
  const box = $("question");
  if (!state.q) newQuestion();
  const q = state.q;
  if (q.kind === "choice") box.innerHTML = choiceHtml(q);
  else if (q.kind === "fill") box.innerHTML = fillHtml(q);
  else box.innerHTML = guidedHtml(q);
  renderMath(box);
}

function nextButton() {
  return `<button type="button" class="btn-primary block mt-4" data-act="next">次の問題</button>`;
}

function resultHtml(ok, explain) {
  return `
    <div class="feedback ${ok ? "feedback-success" : "feedback-error"}">
      <div class="font-bold text-base mb-1">${ok ? "正解！" : "おしい！"}</div>
      ${explain ? `<p>${explain}</p>` : ""}
    </div>`;
}

// ---------- 選んで答える問題 ----------
function choiceHtml(q) {
  const answered = state.answered;
  return `
    <div class="q-card">
      ${q.figure ? `<div class="figure">${q.figure}</div>` : ""}
      ${q.statement ? `<p class="q-statement">${q.statement}</p>` : ""}
      <p class="q-prompt">${q.prompt}</p>
      <div class="choices">
        ${q.choices.map((c, i) => {
          let cls = "";
          if (answered) cls = c.correct ? "is-correct" : (q.chosen === i ? "is-wrong" : "is-dim");
          return `<button type="button" class="choice ${cls}" data-choice="${i}" ${answered ? "disabled" : ""}>${c.label}</button>`;
        }).join("")}
      </div>
      ${answered ? resultHtml(q.choices[q.chosen].correct, q.explain) + nextButton() : ""}
    </div>`;
}

function answerChoice(i) {
  const q = state.q;
  if (state.answered) return;
  q.chosen = i;
  state.answered = true;
  if (q.choices[i].correct) recordCorrect(state.lesson);
  renderLesson();
}

// ---------- 穴うめ証明 ----------
function fillHtml(q) {
  const blankAt = new Map(q.blanks.map((b, k) => [b.line, { ...b, k }]));
  const lineHtml = (l, li) => {
    const b = blankAt.get(li);
    const content = b
      ? `<button type="button" class="blank ${q.active === b.k && !state.answered ? "is-active" : ""} ${state.answered ? (b.chosen === l.text ? "is-correct" : "is-wrong") : ""}" data-blank="${b.k}">
           <span class="blank-name">${b.name}</span>${b.chosen ? b.chosen : "　　？　　"}
         </button>`
      : l.text;
    const prefix = l.type === "condition" ? `<span class="auto-num">${l.prefix}</span>` : "";
    const num = l.type === "equation" ? ` <span class="auto-num">…… ${l.num}</span>` : "";
    return `<li class="ip-line ${l.type === "equation" ? "indent" : ""}"><span class="ip-no">${li + 1}</span><span class="ip-text">${prefix}${content}${num}</span></li>`;
  };
  const active = q.blanks[q.active];
  const allChosen = q.blanks.every(b => b.chosen);
  let tail = "";
  if (state.answered) {
    const ok = q.blanks.every(b => b.chosen === q.lines[b.line].text);
    const fixes = q.blanks.filter(b => b.chosen !== q.lines[b.line].text)
      .map(b => `［${b.name}］は「${q.lines[b.line].text}」`).join("、");
    tail = resultHtml(ok, ok ? "証明の形が見えてきたね。声に出して読んでみよう。" : `正しくは ${fixes} です。`) + nextButton();
  } else {
    tail = `
      <div class="fill-options">
        <p class="fill-options-title">［${active.name}］に入るものを選ぼう</p>
        <div class="choices">
          ${active.options.map((o, i) => `<button type="button" class="choice ${active.chosen === o ? "is-picked" : ""}" data-option="${i}">${o}</button>`).join("")}
        </div>
      </div>
      <button type="button" class="btn-primary block mt-4" data-act="check-fill" ${allChosen ? "" : "disabled"}>答え合わせ</button>`;
  }
  return `
    <div class="q-card">
      <div class="figure">${figureWith(q.p, q.p.proof.blocks.flatMap(b => b.equations))}</div>
      <p class="q-statement">${q.p.statement}</p>
      <ol class="ip-proof">${q.lines.map(lineHtml).join("")}</ol>
      ${tail}
    </div>`;
}

function chooseOption(i) {
  const q = state.q;
  if (state.answered) return;
  const b = q.blanks[q.active];
  b.chosen = b.options[i];
  const next = q.blanks.findIndex(x => !x.chosen);
  if (next !== -1) q.active = next;
  renderQuestion();
}

function checkFill() {
  const q = state.q;
  if (!q.blanks.every(b => b.chosen)) return;
  state.answered = true;
  if (q.blanks.every(b => b.chosen === q.lines[b.line].text)) recordCorrect(state.lesson, q.level);
  renderLesson();
}

// ---------- ガイドつき並べかえ ----------
function guidedHtml(q) {
  let n = 0;
  const sections = SECTIONS.map(sec => {
    const rows = q.slots.map((s, si) => ({ s, si })).filter(x => x.s.sec === sec.sec).map(({ s, si }) => {
      let num = "";
      if (s.type === "equation") { num = ` <span class="auto-num">…… ${CIRCLED[n]}</span>`; n += 1; }
      const prefix = s.type === "condition" ? `<span class="auto-num">${CIRCLED.slice(0, q.slots.filter(x => x.type === "equation").length).join(", ")}より、</span>` : "";
      const cls = ["slot", s.type === "equation" ? "indent" : "", q.selected === si ? "is-selected" : "", s.card ? "is-filled" : "", s.wrong ? "is-wrong" : ""].join(" ");
      return `
        <li>
          <button type="button" class="${cls}" data-slot="${si}">
            ${s.card ? `${prefix}${s.card.text}${num}` : `<span class="slot-empty">${prefix}${SLOT_LABEL[s.type]}${num}</span>`}
          </button>
        </li>`;
    }).join("");
    return `<li class="g-sec"><div class="g-sec-title"><span class="ph-step">${sec.sec}</span>${sec.title}</div><ol class="g-slots">${rows}</ol></li>`;
  }).join("");
  const remaining = q.cards.filter(c => !q.slots.some(s => s.card === c));
  const allFilled = q.slots.every(s => s.card);
  let tail;
  if (state.answered) {
    tail = resultHtml(true, "証明が完成しました。この順番が、合同の証明の型です。") + nextButton();
  } else {
    tail = `
      <p class="hint mt-4 mb-2">カードをタップすると、合うわくに入ります。わくを先にタップしてから、カードを選ぶこともできます。入れたカードは、もう一度タップすると戻せます。</p>
      <div class="g-cards">${remaining.map(c => `<button type="button" class="palette-item" data-card="${c.id}">${c.text}</button>`).join("") || `<p class="hint">カードはすべて入りました。</p>`}</div>
      ${q.checked ? `<div class="feedback feedback-error"><div class="font-bold mb-1">赤いわくを見直そう</div><p>理由と、そのすぐ下の等しい辺や角が、組み合わせになっているか確かめよう。</p></div>` : ""}
      <button type="button" class="btn-primary block mt-4" data-act="check-guided" ${allFilled ? "" : "disabled"}>答え合わせ</button>`;
  }
  return `
    <div class="q-card">
      <div class="figure">${figureWith(q.p, q.p.proof.blocks.flatMap(b => b.equations))}</div>
      <p class="q-statement">${q.p.statement}</p>
      <ol class="g-sections">${sections}</ol>
      <div id="guided-msg" class="hint mt-2" aria-live="polite"></div>
      ${tail}
    </div>`;
}

function placeCard(cardId) {
  const q = state.q;
  const card = q.cards.find(c => c.id === cardId);
  let target = q.selected;
  if (target !== null && q.slots[target].type !== card.type) {
    $("guided-msg").textContent = `そのわくには「${SLOT_LABEL[q.slots[target].type]}」が入ります。`;
    return;
  }
  if (target === null || q.slots[target].card) target = q.slots.findIndex(s => s.type === card.type && !s.card);
  if (target === -1) {
    $("guided-msg").textContent = `「${SLOT_LABEL[card.type]}」のわくは、もういっぱいです。入れたカードをタップすると戻せます。`;
    return;
  }
  q.slots[target].card = card;
  q.slots.forEach(s => { s.wrong = false; });
  q.selected = null;
  q.checked = false;
  renderQuestion();
}

function tapSlot(si) {
  const q = state.q;
  if (state.answered) return;
  const s = q.slots[si];
  if (s.card) {
    s.card = null;
    q.selected = si;
  } else {
    q.selected = q.selected === si ? null : si;
  }
  q.slots.forEach(x => { x.wrong = false; });
  q.checked = false;
  renderQuestion();
}

function checkGuided() {
  const q = state.q;
  // 理由のわくの下にある等しい辺・角のわくが、その理由と同じ組かを確かめる（組の順番は自由）
  let currentReason = null;
  q.slots.forEach(s => {
    s.wrong = false;
    if (s.type === "reason") currentReason = s.card;
    if (s.type === "equation" && (!currentReason || s.card.block !== currentReason.block)) s.wrong = true;
  });
  // 理由ごとの等式の数も合っているか
  q.slots.forEach((s, si) => {
    if (s.type !== "reason") return;
    let k = si + 1;
    let count = 0;
    while (k < q.slots.length && q.slots[k].type === "equation") { count++; k++; }
    const need = q.cards.filter(c => c.type === "equation" && c.block === s.card.block).length;
    if (count !== need) s.wrong = true;
  });
  const ok = q.slots.every(s => !s.wrong);
  if (ok) {
    state.answered = true;
    recordCorrect(state.lesson);
    renderLesson();
  } else {
    q.checked = true;
    renderQuestion();
  }
}

// ============================================================
// 操作
// ============================================================
view.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.choice !== undefined) answerChoice(Number(t.dataset.choice));
  else if (t.dataset.option !== undefined) chooseOption(Number(t.dataset.option));
  else if (t.dataset.blank !== undefined && !state.answered) { state.q.active = Number(t.dataset.blank); renderQuestion(); }
  else if (t.dataset.card !== undefined) placeCard(t.dataset.card);
  else if (t.dataset.slot !== undefined) tapSlot(Number(t.dataset.slot));
  else if (t.dataset.level !== undefined) { state.level = Number(t.dataset.level); state.q = null; renderLesson(); }
  else if (t.dataset.act === "next") { state.q = null; renderLesson(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  else if (t.dataset.act === "check-fill") checkFill();
  else if (t.dataset.act === "check-guided") checkGuided();
});

function route() {
  progress = Storage.loadIntro();
  const lesson = LESSONS.find(l => `#${l.id}` === location.hash);
  if (lesson) {
    if (state.lesson !== lesson) {
      state.lesson = lesson;
      state.q = null;
      state.lastKey = null;
      // 穴うめ証明は、まだクリアしていないいちばん低いレベルから
      if (lesson.levels) {
        const pr = lessonProgress(lesson);
        const idx = pr.levels.findIndex(v => v < lesson.goalPerLevel);
        state.level = lesson.levels[idx === -1 ? 0 : idx];
      }
    }
    renderLesson();
    window.scrollTo(0, 0);
  } else {
    renderHome();
  }
}

window.addEventListener("hashchange", route);
route();
window.addEventListener("load", () => renderMath(view));

// 名前の表示
const user = Storage.getActiveUser();
$("user-display").textContent = user === "guest" ? "ゲスト" : user;

export { LESSONS, REASON_POOL, makeReasonQuestion, makeConditionQuestion, makeCorrespondQuestion, makeFillQuestion, makeGuidedQuestion, proofLines };
