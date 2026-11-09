/**
 * 理由カードの一覧（図つき）
 * 証明で使う可能性のあるカード（理由・合同条件）を、イメージ図・例・使う場面と一緒に見せる。
 * それぞれのカードを使う問題も、問題データから自動で探して表示する。
 */
import { allProblems, PARTS } from "./problems/index.js";
import { drawFigure } from "./figure.js";

const $ = id => document.getElementById(id);

// よく使う図（2つの三角形を並べたもの）
const TWO_TRI = { A: [25, 115], B: [95, 115], C: [45, 35], D: [145, 115], E: [215, 115], F: [165, 35] };
const TWO_RIGHT = { A: [25, 30], B: [95, 115], C: [25, 115], D: [145, 30], E: [215, 115], F: [145, 115] };
const PARALLEL = { A: [20, 35], B: [185, 35], C: [20, 105], D: [185, 105], E: [68, 18], F: [142, 128], P: [79.4, 35], Q: [126.5, 105] };
const PGRAM = { A: [50, 25], B: [20, 115], C: [170, 115], D: [200, 25] };

const reasonHas = re => p => p.proof.blocks.some(b => re.test(b.reason));
const conditionIs = text => p => p.proof.condition === text;

/**
 * cards: そのグループのカード
 *   card     カードの文（アプリでの書き方）
 *   figure   図（js/figure.js の書き方）
 *   example  この理由からわかる式の例（$...$ で数式）
 *   when     使う場面
 *   used     この理由を使っている問題を探す条件
 *   advanced 発展（定期テストより難しい）
 */
const GROUPS = [
  {
    id: "given", title: "問題文に書いてあること", part: "basic",
    cards: [{
      card: "仮定より、",
      figure: { width: 200, height: 130, pts: { A: [30, 25], C: [30, 105], D: [170, 25], B: [170, 105], O: [100, 65] }, segs: ["AOB", "COD"], sides: [{ segs: ["AO", "OB"], n: 1 }], labels: { O: [0, -13] } },
      example: "問題文に「$AO = BO$ ならば」 → 仮定より、$AO = BO$",
      when: "問題文に「〜ならば」「〜のとき」と、はじめから書いてあること（仮定）を使うとき。いちばんよく使います。",
      used: reasonHas(/^仮定より/)
    }]
  },
  {
    id: "lines", title: "交わる直線・平行線", part: "basic",
    cards: [{
      card: "対頂角は等しいので、",
      figure: { width: 200, height: 130, pts: { A: [30, 25], B: [170, 105], C: [30, 105], D: [170, 25], O: [100, 65] }, segs: ["AOB", "COD"], angles: [{ angs: ["AOC", "BOD"], n: 1 }], labels: { O: [0, -13] } },
      example: "$\\angle AOC = \\angle BOD$",
      when: "2本の直線が交わっているとき、向かい合う角（対頂角）は等しくなります。図に「×」の形を見つけたら考えよう。",
      used: reasonHas(/対頂角/)
    }, {
      card: "平行線の錯角は等しいので、",
      figure: { width: 205, height: 148, pts: PARALLEL, segs: [["A", "P", "B"], ["C", "Q", "D"], ["E", "P", "Q", "F"]], angles: [{ angs: ["APQ", "DQP"], n: 1 }], parallels: [{ segs: ["AB", "CD"], n: 1 }] },
      example: "$AB \\parallel CD$ より、$\\angle APQ = \\angle DQP$",
      when: "平行な2本の直線に1本の直線が交わるとき、「Z」の形の内側にできる角（錯角）は等しくなります。",
      used: reasonHas(/錯角/)
    }, {
      card: "平行線の同位角は等しいので、",
      figure: { width: 205, height: 148, pts: PARALLEL, segs: [["A", "P", "B"], ["C", "Q", "D"], ["E", "P", "Q", "F"]], angles: [{ angs: ["EPB", "PQD"], n: 1 }], parallels: [{ segs: ["AB", "CD"], n: 1 }] },
      example: "$AB \\parallel CD$ より、$\\angle EPB = \\angle PQD$",
      when: "平行な2本の直線に1本の直線が交わるとき、同じ位置にある角（同位角）は等しくなります。「F」の形を探そう。",
      used: reasonHas(/同位角/)
    }]
  },
  {
    id: "common", title: "共通な辺・角", part: "basic",
    cards: [{
      card: "共通な辺だから、",
      figure: { width: 220, height: 150, pts: { A: [110, 18], B: [45, 72], C: [110, 128], D: [175, 72] }, segs: ["AB", "BC", "CD", "DA", "AC"], highlights: ["AC"] },
      example: "$AC = AC$",
      when: "2つの三角形が、同じ辺（黄色）を両方とも使っているとき。等式は「$AC = AC$」のように同じ辺を2回書きます。",
      used: reasonHas(/共通な辺/)
    }, {
      card: "共通な角だから、",
      figure: { width: 220, height: 145, pts: { A: [110, 18], B: [40, 130], C: [180, 130], D: [71.5, 79.6], E: [148.5, 79.6] }, segs: ["ADB", "AEC", "BE", "CD"], angles: [{ angs: ["DAE"], n: 1 }] },
      example: "$\\angle BAE = \\angle CAD$",
      when: "2つの三角形が、同じ角を両方とも使っているとき。$\\angle BAE$ と $\\angle CAD$ は、どちらも頂点 $A$ の同じ角です。",
      used: reasonHas(/共通な角/)
    }]
  },
  {
    id: "mid", title: "中点・二等分線", part: "basic",
    cards: [{
      card: "$M$ は線分 $AB$ の中点だから、",
      figure: { width: 200, height: 70, pts: { A: [25, 40], M: [100, 40], B: [175, 40] }, segs: ["AMB"], sides: [{ segs: ["AM", "MB"], n: 1 }] },
      example: "$AM = BM$",
      when: "「中点」は線分をちょうど半分に分ける点です。中点の両側の長さが等しいと書けます。",
      used: reasonHas(/中点だから/)
    }, {
      card: "$AD$ は $\\angle A$ の二等分線だから、",
      figure: { width: 200, height: 150, pts: { A: [25, 75], B: [185, 20], C: [185, 130], D: [185, 75] }, segs: ["AB", "AC", "AD"], angles: [{ angs: ["BAD", "DAC"], n: 1, r: 30 }] },
      example: "$\\angle BAD = \\angle CAD$",
      when: "「二等分線」は角をちょうど半分に分ける線です。分けられた2つの角が等しいと書けます。",
      used: reasonHas(/二等分線/)
    }]
  },
  {
    id: "conditions", title: "三角形の合同条件", part: "basic",
    note: "等しい辺や角（①②③）をそろえたら、最後にどれか1つを選んで書きます。カードでは前に「①, ②, ③より、」が自動でつきます。",
    cards: [{
      card: "3組の辺がそれぞれ等しいので",
      figure: { width: 238, height: 130, pts: TWO_TRI, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], sides: [{ segs: ["AB", "DE"], n: 1 }, { segs: ["BC", "EF"], n: 2 }, { segs: ["CA", "FD"], n: 3 }] },
      example: "$AB = DE$、$BC = EF$、$CA = FD$",
      when: "辺が3組とも等しいとき。共通な辺を使うことも多いです。",
      used: conditionIs("3組の辺がそれぞれ等しいので")
    }, {
      card: "2組の辺とその間の角がそれぞれ等しいので",
      figure: { width: 238, height: 130, pts: TWO_TRI, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], sides: [{ segs: ["AB", "DE"], n: 1 }, { segs: ["CA", "FD"], n: 2 }], angles: [{ angs: ["BAC", "EDF"], n: 1 }] },
      example: "$AB = DE$、$AC = DF$、$\\angle BAC = \\angle EDF$",
      when: "等しい角が、等しい2組の辺に「はさまれている」ことを必ず確かめよう。",
      used: conditionIs("2組の辺とその間の角がそれぞれ等しいので")
    }, {
      card: "1組の辺とその両端の角がそれぞれ等しいので",
      figure: { width: 238, height: 130, pts: TWO_TRI, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], sides: [{ segs: ["AB", "DE"], n: 1 }], angles: [{ angs: ["CAB", "FDE"], n: 1 }, { angs: ["ABC", "DEF"], n: 2 }] },
      example: "$AB = DE$、$\\angle A = \\angle D$、$\\angle B = \\angle E$",
      when: "等しい2組の角が、等しい辺の「両はし」にあることを確かめよう。",
      used: conditionIs("1組の辺とその両端の角がそれぞれ等しいので")
    }]
  },
  {
    id: "triangle", title: "二等辺三角形・正三角形", part: "figures",
    cards: [{
      card: "二等辺三角形の底角は等しいので、",
      figure: { width: 200, height: 142, pts: { A: [100, 22], B: [35, 125], C: [165, 125] }, segs: ["AB", "AC", "BC"], sides: [{ segs: ["AB", "AC"], n: 1 }], angles: [{ angs: ["ABC", "BCA"], n: 1 }] },
      example: "$AB = AC$ の二等辺三角形で、$\\angle ABC = \\angle ACB$",
      when: "二等辺三角形では、等しい2辺にはさまれていない2つの角（底角）が等しくなります。",
      used: reasonHas(/底角/)
    }, {
      card: "正三角形の辺（角）はすべて等しいので、",
      figure: { width: 200, height: 142, pts: { A: [100, 20], B: [40, 124], C: [160, 124] }, segs: ["AB", "BC", "CA"], sides: [{ segs: ["AB", "BC", "CA"], n: 1 }], angles: [{ angs: ["ABC", "BCA", "CAB"], n: 1 }] },
      example: "$AB = BC = CA$、$\\angle A = \\angle B = \\angle C = 60^\\circ$",
      when: "正三角形は、3つの辺がすべて等しく、3つの角がすべて $60^\\circ$ です。アプリでは「$\\triangle ABC$ は正三角形だから、」「正三角形の角はすべて $60^\\circ$ だから、」などと書きます。",
      used: reasonHas(/正三角形/)
    }]
  },
  {
    id: "right", title: "直角三角形", part: "figures",
    note: "直角三角形では、三角形の3つの合同条件のほかに、次の2つの合同条件が使えます。斜辺は、直角の向かいにある辺です。",
    cards: [{
      card: "仮定より、（垂線があるとき）",
      figure: { width: 200, height: 140, pts: { A: [100, 18], B: [35, 125], C: [165, 125], H: [100, 125] }, segs: ["AB", "AC", "BHC", "AH"], rights: ["AHC", "AHB"] },
      example: "$AH \\perp BC$ のとき、$\\angle AHB = \\angle AHC = 90^\\circ$",
      when: "「垂線をひく」「⊥」と書いてあるときは、直角（$90^\\circ$）の角が等しいと書けます。直角三角形の合同条件を使う問題で必ず使います。",
      used: p => p.proof.blocks.some(b => b.equations.some(e => /= 90\^\\circ\$$/.test(e)))
    }, {
      card: "直角三角形の斜辺と1つの鋭角がそれぞれ等しいので",
      figure: { width: 238, height: 130, pts: TWO_RIGHT, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], rights: ["ACB", "DFE"], sides: [{ segs: ["AB", "DE"], n: 1 }], angles: [{ angs: ["CAB", "FDE"], n: 1 }] },
      example: "$\\angle C = \\angle F = 90^\\circ$、$AB = DE$、$\\angle A = \\angle D$",
      when: "直角三角形で、斜辺（直角の向かいの辺）と、直角でない角1つが等しいとき。直角であることも書きます。",
      used: conditionIs("直角三角形の斜辺と1つの鋭角がそれぞれ等しいので")
    }, {
      card: "直角三角形の斜辺と他の1辺がそれぞれ等しいので",
      figure: { width: 238, height: 130, pts: TWO_RIGHT, segs: ["AB", "BC", "CA", "DE", "EF", "FD"], rights: ["ACB", "DFE"], sides: [{ segs: ["AB", "DE"], n: 1 }, { segs: ["AC", "DF"], n: 2 }] },
      example: "$\\angle C = \\angle F = 90^\\circ$、$AB = DE$、$AC = DF$",
      when: "直角三角形で、斜辺と、もう1つの辺が等しいとき。直角であることも書きます。",
      used: conditionIs("直角三角形の斜辺と他の1辺がそれぞれ等しいので")
    }]
  },
  {
    id: "pgram", title: "平行四辺形", part: "figures",
    cards: [{
      card: "平行四辺形の向かい合う辺は等しいので、",
      figure: { width: 220, height: 135, pts: PGRAM, segs: ["AB", "BC", "CD", "DA"], sides: [{ segs: ["AB", "DC"], n: 1 }, { segs: ["AD", "BC"], n: 2 }] },
      example: "$AB = DC$、$AD = BC$",
      when: "平行四辺形では、2組の向かい合う辺（対辺）がそれぞれ等しくなります。",
      used: reasonHas(/平行四辺形の向かい合う辺/)
    }, {
      card: "平行四辺形の向かい合う角は等しいので、",
      figure: { width: 220, height: 135, pts: PGRAM, segs: ["AB", "BC", "CD", "DA"], angles: [{ angs: ["DAB", "BCD"], n: 1 }, { angs: ["ABC", "CDA"], n: 2 }] },
      example: "$\\angle BAD = \\angle DCB$、$\\angle ABC = \\angle CDA$",
      when: "平行四辺形では、2組の向かい合う角（対角）がそれぞれ等しくなります。",
      used: reasonHas(/向かい合う角/)
    }, {
      card: "平行四辺形の対角線は、それぞれの中点で交わるので、",
      figure: { width: 220, height: 135, pts: { ...PGRAM, O: [110, 70] }, segs: ["AB", "BC", "CD", "DA", "AOC", "BOD"], sides: [{ segs: ["AO", "OC"], n: 1 }, { segs: ["BO", "OD"], n: 2 }], labels: { O: [0, -13] } },
      example: "$AO = CO$、$BO = DO$",
      when: "平行四辺形の2本の対角線は、おたがいのまん中で交わります。ひし形・長方形・正方形でも使えます。",
      used: reasonHas(/対角線は、それぞれの中点/)
    }]
  },
  {
    id: "special", title: "長方形・ひし形・正方形", part: "figures",
    cards: [{
      card: "長方形の角はすべて 90° だから、",
      figure: { width: 220, height: 130, pts: { A: [30, 20], B: [30, 110], C: [190, 110], D: [190, 20] }, segs: ["AB", "BC", "CD", "DA"], rights: ["DAB", "ABC", "BCD", "CDA"], sides: [{ segs: ["AB", "DC"], n: 1 }, { segs: ["AD", "BC"], n: 2 }] },
      example: "$\\angle ABC = \\angle DCB = 90^\\circ$、$AB = DC$",
      when: "長方形は4つの角がすべて $90^\\circ$ です。平行四辺形の一種なので、向かい合う辺も等しくなります。",
      used: reasonHas(/長方形/)
    }, {
      card: "ひし形の辺はすべて等しいので、",
      figure: { width: 220, height: 152, pts: { A: [110, 18], B: [50, 76], C: [110, 134], D: [170, 76] }, segs: ["AB", "BC", "CD", "DA"], sides: [{ segs: ["AB", "BC", "CD", "DA"], n: 1 }] },
      example: "$AB = BC = CD = DA$",
      when: "ひし形は4つの辺がすべて等しい四角形です。平行四辺形の一種なので、対角線はそれぞれの中点で交わります。",
      used: reasonHas(/ひし形/)
    }, {
      card: "正方形の辺はすべて等しく、角はすべて 90° だから、",
      figure: { width: 200, height: 140, pts: { A: [45, 15], B: [45, 125], C: [155, 125], D: [155, 15] }, segs: ["AB", "BC", "CD", "DA"], sides: [{ segs: ["AB", "BC", "CD", "DA"], n: 1 }], rights: ["DAB", "ABC", "BCD", "CDA"] },
      example: "$AB = BC$、$\\angle ABE = \\angle BCF = 90^\\circ$",
      when: "正方形は「4つの辺が等しい」「4つの角が $90^\\circ$」の両方が使えます。アプリでは「正方形の辺はすべて等しいので、」「正方形の角はすべて $90^\\circ$ だから、」と分けて書きます。",
      used: reasonHas(/正方形/)
    }, {
      card: "$\\angle BAC = \\angle DAC = 45^\\circ$ だから、",
      figure: { width: 200, height: 140, pts: { A: [45, 15], B: [45, 125], C: [155, 125], D: [155, 15] }, segs: ["AB", "BC", "CD", "DA", "AC"], angles: [{ angs: ["BAC", "CAD"], n: 1, r: 22 }] },
      example: "$\\angle BAP = \\angle DAP$（$P$ は対角線 $AC$ 上の点）",
      when: "正方形の対角線は、$90^\\circ$ の角を $45^\\circ$ ずつに分けます。",
      used: reasonHas(/45/)
    }]
  },
  {
    id: "advanced", title: "角の和・外角（発展）", part: "figures",
    cards: [{
      card: "$\\angle ACD = 60^\\circ + \\angle ACE$, $\\angle BCE = 60^\\circ + \\angle ACE$ だから、",
      figure: { width: 220, height: 150, pts: { B: [25, 130], C: [115, 130], D: [195, 130], A: [70, 52.1], E: [155, 60.7] }, segs: ["BCD", "AB", "AC", "EC", "ED", "AD", "BE"], angles: [{ angs: ["ACE"], n: 1, r: 18 }] },
      example: "$\\angle ACD = \\angle BCE$",
      when: "2つの角が、どちらも「等しい角（$60^\\circ$ や $90^\\circ$）＋ 共通な角」になっているとき。2つの正三角形・2つの正方形の問題で使います。",
      used: reasonHas(/\+ \\angle/),
      advanced: true
    }, {
      card: "$\\angle ABD = 180^\\circ - \\angle ABC$ だから、（外角）",
      figure: { width: 210, height: 130, pts: { D: [20, 110], B: [75, 110], C: [175, 110], A: [125, 25] }, segs: ["DBC", "AB", "AC"], angles: [{ angs: ["ABD"], n: 1 }, { angs: ["CBA"], n: 2 }] },
      example: "底角が等しいとき、外角も等しい：$\\angle ABD = \\angle ACE$",
      when: "一直線は $180^\\circ$ なので、となりの角（外角）は「$180^\\circ$ − 内側の角」で表せます。内側の角が等しければ、外角も等しくなります。",
      used: reasonHas(/180/),
      advanced: true
    }, {
      card: "$\\angle BAD = 90^\\circ - \\angle CAE$, $\\angle ACE = 90^\\circ - \\angle CAE$ だから、",
      figure: { width: 220, height: 130, pts: { _L: [12, 30], D: [32.1, 30], A: [110, 30], E: [155, 30], _R: [200, 30], B: [32.1, 75], C: [155, 107.9] }, segs: [["_L", "D", "A", "E", "_R"], "BD", "CE", "AB", "AC"], rights: ["ADB", "AEC", "BAC"], angles: [{ angs: ["CAE"], n: 1, r: 20 }] },
      example: "$\\angle BAD = \\angle ACE$",
      when: "2つの角が、どちらも「$90^\\circ$ − 共通な角」になっているとき。直角が2つ以上ある図で使います。",
      used: reasonHas(/90\^\\circ - /),
      advanced: true
    }]
  }
];

function renderMath(el) {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(el, {
    delimiters: [{ left: "$", right: "$", display: false }],
    throwOnError: false,
    macros: { "\\parallel": "\\mathbin{/\\!/}" }
  });
}

function problemLinks(card) {
  const list = allProblems.filter(card.used);
  if (list.length === 0) return "";
  const link = p => `<a href="index.html?problem=${p.id}" title="${p.unitLabel}">${p.title}${p.tier === "advanced" ? "（発展）" : ""}</a>`;
  // 分野ごとに分けて並べる
  const byPart = PARTS.map(part => ({ part, items: list.filter(p => p.part === part.key) })).filter(x => x.items.length);
  const links = byPart.length > 1
    ? byPart.map(x => `<div class="rc-links-part">${x.part.label}</div><div class="rc-links">${x.items.map(link).join("")}</div>`).join("")
    : `<div class="rc-links">${list.map(link).join("")}</div>`;
  // 多いときはたたんでおく（タップで開く）
  if (list.length > 6) {
    return `
      <details class="rc-used">
        <summary class="rc-label cursor-pointer">この理由を使う問題（${list.length}問）▼</summary>
        ${links}
      </details>`;
  }
  return `
    <div class="rc-used">
      <div class="rc-label">この理由を使う問題（${list.length}問）</div>
      ${links}
    </div>`;
}

function cardHtml(card) {
  return `
    <article class="rc">
      <div class="rc-card">${card.card}${card.advanced ? `<span class="tier-badge tier-advanced small ml-1">発展</span>` : ""}</div>
      <div class="rc-fig">${drawFigure(card.figure)}</div>
      <div class="rc-example"><span class="rc-label">例</span> ${card.example}</div>
      <p class="rc-when">${card.when}</p>
      ${problemLinks(card)}
    </article>`;
}

function render() {
  // 分野（三角形の合同（基本）／いろいろな図形の合同）ごとに分けて並べる
  $("nav").innerHTML = PARTS.map(part => GROUPS.filter(g => g.part === part.key)
    .map(g => `<a href="#${g.id}" class="${part.key === "figures" ? "is-figures" : ""}">${g.title}</a>`).join("")).join('<span class="nav-sep" aria-hidden="true"></span>');
  $("groups").innerHTML = PARTS.map(part => `
    <section class="rc-part" aria-labelledby="part-${part.key}">
      <div class="rc-part-head">
        <h2 id="part-${part.key}">${part.label}</h2>
        <p>${part.desc}で使うカード</p>
      </div>
      ${GROUPS.filter(g => g.part === part.key).map(g => `
        <section id="${g.id}" class="rc-group">
          <h3>${g.title}</h3>
          ${g.note ? `<p class="rc-note">${g.note}</p>` : ""}
          <div class="rc-grid">${g.cards.map(cardHtml).join("")}</div>
        </section>`).join("")}
    </section>`).join("");
  renderMath(document.body);
}

render();
window.addEventListener("load", () => renderMath(document.body));
