/**
 * 単元4: 直角三角形の合同
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "right";
const unitLabel = "直角三角形の合同";

export const unit4Problems = [
  {
    id: "rt-01",
    unit, unitLabel,
    level: "★★☆",
    title: "斜辺と他の1辺（二等辺三角形の垂線）",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ で、頂点 $A$ から辺 $BC$ に垂線 $AH$ をひく。このとき、$\\triangle ABH \\equiv \\triangle ACH$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [40, 130], C: [180, 130], H: [110, 130] },
      segs: ["AB", "AC", "BHC", "AH"],
      sides: [{ segs: ["AB", "AC"], n: 1 }],
      rights: ["AHC"]
    },
    triangles: ["ABH", "ACH"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$\\angle AHB = \\angle AHC = 90^\\circ$", "$AB = AC$"] },
        { reason: "共通な辺だから、", equations: ["$AH = AH$"] }
      ],
      condition: "直角三角形の斜辺と他の1辺がそれぞれ等しいので"
    },
    extraTrue: ["∠ABC=∠ACB"],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$BH = CH$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "直角三角形では、いちばん長い辺（直角の向かいの辺）を「斜辺」といいます。ここでは $AB$ と $AC$ が斜辺です。斜辺と、もう1つの辺 $AH$ が等しいので「斜辺と他の1辺」が使えます。直角であることも必ず書きましょう。"
  },
  {
    id: "rt-02",
    unit, unitLabel,
    level: "★★☆",
    title: "斜辺と1つの鋭角（角の二等分線）",
    statement: "図で、$\\angle XOY$ の二等分線上の点 $P$ から、半直線 $OX$, $OY$ にそれぞれ垂線 $PA$, $PB$ をひく。このとき、$\\triangle AOP \\equiv \\triangle BOP$ であることを証明しなさい。",
    figure: {
      width: 220, height: 170,
      pts: { O: [25, 85], A: [148.2, 27.5], B: [148.2, 142.5], P: [175, 85], X: [170, 17.4], Y: [170, 152.6] },
      segs: ["OAX", "OBY", "OP", "PA", "PB"],
      angles: [{ angs: ["AOP", "POB"], n: 1 }],
      rights: ["OAP", "OBP"]
    },
    triangles: ["AOP", "BOP"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$\\angle OAP = \\angle OBP = 90^\\circ$"] },
        { reason: "$OP$ は $\\angle XOY$ の二等分線だから、", equations: ["$\\angle AOP = \\angle BOP$"] },
        { reason: "共通な辺だから、", equations: ["$OP = OP$"] }
      ],
      condition: "直角三角形の斜辺と1つの鋭角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$PA = PB$" },
      { type: "condition", text: "直角三角形の斜辺と他の1辺がそれぞれ等しいので" }
    ],
    explanation: "直角の向かいにある $OP$ が、2つの直角三角形の共通な斜辺です。斜辺と1つの鋭角（$\\angle AOP = \\angle BOP$）が等しいので合同になります。$PA = PB$ は合同を証明したあとでわかることで、「角の二等分線上の点から2辺までの距離は等しい」という性質につながります。"
  },
  {
    id: "rt-03",
    unit, unitLabel,
    level: "★★★",
    title: "直角二等辺三角形と直線",
    statement: "図で、$\\triangle ABC$ は $\\angle BAC = 90^\\circ$, $AB = AC$ の直角二等辺三角形である。点 $A$ を通る直線 $\\ell$ に、点 $B$, $C$ からそれぞれ垂線 $BD$, $CE$ をひく。このとき、$\\triangle ABD \\equiv \\triangle CAE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 130,
      pts: { _L: [12, 30], D: [32.1, 30], A: [110, 30], E: [155, 30], _R: [200, 30], B: [32.1, 75], C: [155, 107.9] },
      segs: [["_L", "D", "A", "E", "_R"], "BD", "CE", "AB", "AC", "BC"],
      sides: [{ segs: ["AB", "AC"], n: 1 }],
      rights: ["ADB", "AEC", "BAC"],
      texts: [{ at: [208, 22], text: "ℓ" }]
    },
    triangles: ["ABD", "CAE"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$\\angle ADB = \\angle CEA = 90^\\circ$", "$AB = CA$"] },
        { reason: "$\\angle BAD = 90^\\circ - \\angle CAE$, $\\angle ACE = 90^\\circ - \\angle CAE$ だから、", equations: ["$\\angle BAD = \\angle ACE$"] }
      ],
      condition: "直角三角形の斜辺と1つの鋭角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$BD = AE$" },
      { type: "condition", text: "直角三角形の斜辺と他の1辺がそれぞれ等しいので" }
    ],
    explanation: "一直線は $180^\\circ$ なので $\\angle BAD + 90^\\circ + \\angle CAE = 180^\\circ$、三角形の内角の和から $\\angle ACE + 90^\\circ + \\angle CAE = 180^\\circ$ です。どちらも「$90^\\circ - \\angle CAE$」になるので等しい、と考えます。三角形の頂点の対応（$A$ と $C$、$B$ と $A$、$D$ と $E$）にも注意しましょう。"
  }
];
