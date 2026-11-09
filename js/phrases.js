/**
 * 証明で使う言葉の一覧（早見表）
 * アプリの「📚 証明で使う言葉」と、phrases.html（印刷もできるページ）で共通に使う。
 *
 * 文言を足したら、tools などで「問題データのすべての理由が、どれかの文言に当てはまるか」を
 * 確かめるとよい（match に正規表現を書いておくと、何問で使うかも自動で数える）。
 */
import { allProblems } from "./problems/index.js";

const reason = re => p => p.proof.blocks.some(b => re.test(b.reason));
const condition = text => p => p.proof.condition === text;
const rightAngle = p => p.proof.blocks.some(b => b.equations.some(e => /= 90\^\\circ\$$/.test(e)));

/**
 * part   証明のどの部分か（「証明の型」と同じ 1〜4）
 * items  text: 文言（$...$ は数式）, note: いつ使うか, used: 使う問題を探す条件, advanced: 発展
 */
export const PHRASE_PARTS = [
  {
    part: 1, title: "三角形を示す", cls: "s1",
    lead: "証明のいちばん最初に書きます。",
    groups: [{
      items: [
        { text: "$\\triangle ABC$ と $\\triangle DEF$ において", note: "どの三角形とどの三角形について考えるかを書く。頂点は対応する順に。" }
      ]
    }]
  },
  {
    part: 2, title: "理由と等しい辺・角", cls: "s2",
    lead: "「理由」を書いてから、その理由でわかる「等しい辺や角」を書きます。「〜より、」「〜ので、」「〜だから、」は、どれも理由を表す言い方です。",
    groups: [
      {
        title: "問題文に書いてあること",
        items: [
          { text: "仮定より、", note: "問題文に「〜ならば」「〜のとき」と、はじめから書いてあること。", used: reason(/^仮定より/) },
          { text: "仮定より、$\\angle AHB = \\angle AHC = 90^\\circ$", note: "垂線（⊥）があるとき、直角が等しいと書く。直角三角形の合同で必ず使う。", used: rightAngle }
        ]
      },
      {
        title: "図からわかること",
        items: [
          { text: "対頂角は等しいので、", note: "2本の直線が交わってできる、向かい合う角。", used: reason(/対頂角/) },
          { text: "$AB \\parallel CD$ より、平行線の錯角は等しいので、", note: "平行線と交わる直線でできる「Z」の形の角。", used: reason(/錯角/) },
          { text: "$AB \\parallel CD$ より、平行線の同位角は等しいので、", note: "平行線と交わる直線でできる、同じ位置の角（「F」の形）。", used: reason(/同位角/) },
          { text: "共通な辺だから、", note: "2つの三角形が両方とも使っている辺。$AC = AC$ のように書く。", used: reason(/共通な辺/) },
          { text: "共通な角だから、", note: "2つの三角形が両方とも使っている角。", used: reason(/共通な角/) }
        ]
      },
      {
        title: "言葉の意味からわかること",
        items: [
          { text: "$M$ は線分 $AB$ の中点だから、", note: "中点は線分をちょうど半分に分ける点。$AM = BM$。", used: reason(/中点だから/) },
          { text: "$AD$ は $\\angle A$ の二等分線だから、", note: "二等分線は角をちょうど半分に分ける線。$\\angle BAD = \\angle CAD$。", used: reason(/二等分線/) }
        ]
      },
      {
        title: "図形の性質からわかること",
        items: [
          { text: "二等辺三角形の底角は等しいので、", note: "等しい2辺にはさまれていない2つの角。", used: reason(/^二等辺三角形の底角/) },
          { text: "$\\triangle ABC$ は正三角形だから、", note: "3つの辺がすべて等しい。", used: reason(/は正三角形だから/) },
          { text: "正三角形の角はすべて $60^\\circ$ だから、", note: "3つの角がすべて $60^\\circ$。", used: reason(/正三角形の角/) },
          { text: "平行四辺形の向かい合う辺は等しいので、", note: "2組の向かい合う辺（対辺）がそれぞれ等しい。", used: reason(/平行四辺形の向かい合う辺/) },
          { text: "平行四辺形の向かい合う角は等しいので、", note: "2組の向かい合う角（対角）がそれぞれ等しい。", used: reason(/向かい合う角/) },
          { text: "平行四辺形の対角線は、それぞれの中点で交わるので、", note: "2本の対角線はおたがいのまん中で交わる。ひし形などでも同じ。", used: reason(/対角線は、それぞれの中点/) },
          { text: "長方形の向かい合う辺は等しいので、", used: reason(/長方形の向かい合う辺/) },
          { text: "長方形の角はすべて $90^\\circ$ だから、", used: reason(/長方形の角/) },
          { text: "ひし形の辺はすべて等しいので、", used: reason(/ひし形の辺/) },
          { text: "四角形 $ABCD$ は正方形だから、", note: "正方形の4つの辺が等しいことを使うとき。", used: reason(/は正方形だから/) },
          { text: "正方形の辺はすべて等しいので、", used: reason(/正方形の辺/) },
          { text: "正方形の角はすべて $90^\\circ$ だから、", used: reason(/正方形の角/) },
          { text: "$\\angle BAC = \\angle DAC = 45^\\circ$ だから、", note: "正方形の対角線は、$90^\\circ$ の角を $45^\\circ$ ずつに分ける。", used: reason(/45/) }
        ]
      },
      {
        title: "角の和・差、長さの差（発展）",
        advanced: true,
        items: [
          { text: "$\\angle ACD = 60^\\circ + \\angle ACE$, $\\angle BCE = 60^\\circ + \\angle ACE$ だから、", note: "どちらも「等しい角 ＋ 共通な角」になっているとき。", used: reason(/\+ \\angle/) },
          { text: "$\\angle BAD = 90^\\circ - \\angle CAE$, $\\angle ACE = 90^\\circ - \\angle CAE$ だから、", note: "どちらも「$90^\\circ$ − 共通な角」になっているとき。", used: reason(/90\^\\circ - /) },
          { text: "$\\angle ABD = 180^\\circ - \\angle ABC$ で、……だから、", note: "一直線（$180^\\circ$）のとなりの角（外角）を使うとき。", used: reason(/180/) },
          { text: "$AF = AC - CF$, $BD = AB - AD$ で、……だから、", note: "等しい長さから等しい長さをひいた残りも等しい。", used: reason(/= [A-Z]+ - [A-Z]+/) }
        ]
      },
      {
        title: "等しい辺や角の書き方",
        items: [
          { text: "$AB = DE$ …… ①", note: "「=」の左に1つ目の三角形、右に2つ目の三角形の辺や角。番号は書いた順に ①②③。" }
        ]
      }
    ]
  },
  {
    part: 3, title: "合同条件", cls: "s3",
    lead: "見つけた等しい辺や角をまとめて、「①, ②, ③より、」に続けて書きます。",
    groups: [{
      items: [
        { text: "①, ②, ③より、3組の辺がそれぞれ等しいので", used: condition("3組の辺がそれぞれ等しいので") },
        { text: "①, ②, ③より、2組の辺とその間の角がそれぞれ等しいので", note: "等しい角が、2組の辺に「はさまれている」とき。", used: condition("2組の辺とその間の角がそれぞれ等しいので") },
        { text: "①, ②, ③より、1組の辺とその両端の角がそれぞれ等しいので", note: "等しい2組の角が、等しい辺の「両はし」にあるとき。", used: condition("1組の辺とその両端の角がそれぞれ等しいので") },
        { text: "①, ②, ③より、直角三角形の斜辺と1つの鋭角がそれぞれ等しいので", note: "斜辺は直角の向かいの辺。直角であることも書いておく。", used: condition("直角三角形の斜辺と1つの鋭角がそれぞれ等しいので") },
        { text: "①, ②, ③より、直角三角形の斜辺と他の1辺がそれぞれ等しいので", note: "斜辺と、もう1つの辺が等しいとき。", used: condition("直角三角形の斜辺と他の1辺がそれぞれ等しいので") }
      ]
    }]
  },
  {
    part: 4, title: "結論", cls: "s4",
    lead: "最後に、2つの三角形が合同であることを書いて終わります。",
    groups: [{
      items: [
        { text: "$\\triangle ABC \\equiv \\triangle DEF$", note: "頂点は、書き出しと同じ対応する順に。" }
      ]
    }]
  }
];

export const SYMBOLS = [
  ["$\\triangle ABC$", "三角形 ABC"],
  ["$\\angle ABC$", "角 ABC（真ん中の B が頂点）"],
  ["$\\equiv$", "合同"],
  ["$\\parallel$", "平行"],
  ["$\\perp$", "垂直"],
  ["$=$", "等しい"]
];

// その文言を使う問題の数
const usedCount = item => (item.used ? allProblems.filter(item.used).length : 0);

/** 一覧の HTML（数式は $...$ のまま。表示したあとに KaTeX で描く） */
export function phrasesHtml({ showCounts = true } = {}) {
  const parts = PHRASE_PARTS.map(part => `
    <section class="ph-part ${part.cls}">
      <h3 class="ph-part-title"><span class="ph-step">${part.part}</span>${part.title}</h3>
      ${part.lead ? `<p class="ph-lead">${part.lead}</p>` : ""}
      ${part.groups.map(g => `
        ${g.title ? `<h4 class="ph-group-title">${g.title}${g.advanced ? ` <span class="tier-badge tier-advanced small">発展</span>` : ""}</h4>` : ""}
        <ul class="ph-list">
          ${g.items.map(item => {
            const n = usedCount(item);
            return `
            <li class="ph-item">
              <div class="ph-text">${item.text}</div>
              <div class="ph-note">
                ${item.note ? `<span>${item.note}</span>` : ""}
                ${showCounts && n > 0 ? `<span class="ph-count ${n >= 5 ? "often" : ""}">${n >= 5 ? "よく使う・" : ""}${n}問で使う</span>` : ""}
              </div>
            </li>`;
          }).join("")}
        </ul>`).join("")}
    </section>`).join("");

  const symbols = `
    <section class="ph-part ph-symbols">
      <h3 class="ph-part-title">記号の読み方</h3>
      <ul class="ph-symbol-list">
        ${SYMBOLS.map(([sym, read]) => `<li><span class="ph-sym">${sym}</span><span>${read}</span></li>`).join("")}
      </ul>
    </section>`;

  return parts + symbols;
}
