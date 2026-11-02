/**
 * 単元6: 正方形・長方形・ひし形
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "special";
const unitLabel = "正方形・長方形・ひし形";

export const unit6Problems = [
  {
    id: "sq-01",
    unit, unitLabel,
    level: "★☆☆",
    title: "長方形の対角線",
    statement: "長方形 $ABCD$ に対角線 $AC$, $DB$ をひく。このとき、$\\triangle ABC \\equiv \\triangle DCB$ であることを証明しなさい。",
    figure: {
      width: 230, height: 150,
      pts: { A: [40, 25], B: [40, 125], C: [190, 125], D: [190, 25] },
      segs: ["AB", "BC", "CD", "DA", "AC", "DB"],
      rights: ["ABC", "DCB"]
    },
    triangles: ["ABC", "DCB"],
    proof: {
      blocks: [
        { reason: "長方形の向かい合う辺は等しいので、", equations: ["$AB = DC$"] },
        { reason: "長方形の角はすべて $90^\\circ$ だから、", equations: ["$\\angle ABC = \\angle DCB$"] },
        { reason: "共通な辺だから、", equations: ["$BC = CB$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AD=BC"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AC = DB$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "長方形は平行四辺形の一種なので「向かい合う辺は等しい」が使え、さらに4つの角がすべて $90^\\circ$ です。この合同から $AC = DB$、つまり「長方形の対角線は等しい」ことが証明できます。"
  },
  {
    id: "sq-02",
    unit, unitLabel,
    level: "★★☆",
    title: "正方形の2辺上の点",
    statement: "正方形 $ABCD$ の辺 $BC$ 上に点 $E$、辺 $CD$ 上に点 $F$ を、$BE = CF$ となるようにとる。このとき、$\\triangle ABE \\equiv \\triangle BCF$ であることを証明しなさい。",
    figure: {
      width: 220, height: 155,
      pts: { A: [50, 15], B: [50, 135], C: [170, 135], D: [170, 15], E: [95, 135], F: [170, 90] },
      segs: ["AB", "BEC", "CFD", "DA", "AE", "BF"],
      sides: [{ segs: ["BE", "CF"], n: 1 }],
      rights: ["ABE", "BCF"]
    },
    triangles: ["ABE", "BCF"],
    proof: {
      blocks: [
        { reason: "正方形の辺はすべて等しいので、", equations: ["$AB = BC$"] },
        { reason: "仮定より、", equations: ["$BE = CF$"] },
        { reason: "正方形の角はすべて $90^\\circ$ だから、", equations: ["$\\angle ABE = \\angle BCF$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AB=CD", "AB=DA", "BC=CD"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AE = BF$" },
      { type: "condition", text: "直角三角形の斜辺と他の1辺がそれぞれ等しいので" }
    ],
    explanation: "正方形は「4つの辺が等しい」「4つの角が $90^\\circ$」の両方が使えます。$\\triangle ABE$ と $\\triangle BCF$ で対応する辺は $AB$ と $BC$ です。この合同から $AE = BF$ がわかります（さらに $AE \\perp BF$ も証明できます）。"
  },
  {
    id: "sq-03",
    unit, unitLabel,
    level: "★★☆",
    title: "ひし形の対角線",
    statement: "ひし形 $ABCD$ の対角線の交点を $O$ とする。このとき、$\\triangle ABO \\equiv \\triangle ADO$ であることを証明しなさい。",
    figure: {
      width: 220, height: 165,
      pts: { A: [110, 15], B: [45, 80], C: [110, 145], D: [175, 80], O: [110, 80] },
      segs: ["AB", "BC", "CD", "DA", "AOC", "BOD"],
      sides: [{ segs: ["AB", "BC", "CD", "DA"], n: 1 }],
      labels: { O: [9, -9] }
    },
    triangles: ["ABO", "ADO"],
    proof: {
      blocks: [
        { reason: "ひし形の辺はすべて等しいので、", equations: ["$AB = AD$"] },
        { reason: "ひし形の対角線は、それぞれの中点で交わるので、", equations: ["$BO = DO$"] },
        { reason: "共通な辺だから、", equations: ["$AO = AO$"] }
      ],
      condition: "3組の辺がそれぞれ等しいので"
    },
    extraTrue: ["AO=CO", "BC=CD"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$\\angle BAO = \\angle DAO$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "ひし形は平行四辺形の一種なので「対角線はそれぞれの中点で交わる」が使えます。この合同から $\\angle AOB = \\angle AOD = 90^\\circ$、つまり「ひし形の対角線は垂直に交わる」ことが証明できます。"
  },
  {
    id: "sq-04",
    unit, unitLabel,
    level: "★★☆",
    title: "正方形の対角線上の点",
    statement: "正方形 $ABCD$ の対角線 $AC$ 上に点 $P$ をとる。このとき、$\\triangle ABP \\equiv \\triangle ADP$ であることを証明しなさい。",
    figure: {
      width: 220, height: 155,
      pts: { A: [50, 15], B: [50, 135], C: [170, 135], D: [170, 15], P: [122, 87] },
      segs: ["AB", "BC", "CD", "DA", "APC", "BP", "DP"],
      angles: [{ angs: ["BAP", "PAD"], n: 1 }]
    },
    triangles: ["ABP", "ADP"],
    proof: {
      blocks: [
        { reason: "正方形の辺はすべて等しいので、", equations: ["$AB = AD$"] },
        { reason: "$\\angle BAC = \\angle DAC = 45^\\circ$ だから、", equations: ["$\\angle BAP = \\angle DAP$"] },
        { reason: "共通な辺だから、", equations: ["$AP = AP$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["BC=CD", "∠BCA=∠DCA"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$BP = DP$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "正方形の対角線は、$90^\\circ$ の角を $45^\\circ$ ずつに分けます（$\\triangle ABC$ は直角二等辺三角形）。点 $P$ が対角線上のどこにあっても、この合同は成り立ちます。"
  },
  {
    id: "sq-05",
    unit, unitLabel,
    level: "★★★",
    title: "2つの正方形",
    statement: "図で、四角形 $ABCD$ と四角形 $CGFE$ はどちらも正方形である。このとき、$\\triangle BCG \\equiv \\triangle DCE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 175,
      pts: { A: [30, 50], B: [30, 130], C: [110, 130], D: [110, 50], G: [137.5, 82.4], F: [185.1, 109.9], E: [157.6, 157.5] },
      segs: ["AB", "BC", "CD", "DA", "CG", "GF", "FE", "EC", "BG", "DE"],
      sides: [{ segs: ["BC", "CD"], n: 1 }, { segs: ["CG", "CE"], n: 2 }]
    },
    triangles: ["BCG", "DCE"],
    proof: {
      blocks: [
        { reason: "四角形 $ABCD$ は正方形だから、", equations: ["$BC = DC$"] },
        { reason: "四角形 $CGFE$ は正方形だから、", equations: ["$CG = CE$"] },
        { reason: "$\\angle BCG = 90^\\circ + \\angle DCG$, $\\angle DCE = 90^\\circ + \\angle DCG$ だから、", equations: ["$\\angle BCG = \\angle DCE$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AB=BC", "GF=FE", "∠BCD=∠GCE"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$BG = DE$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "「2つの正三角形」の問題と同じ考え方です。$\\angle BCG$ と $\\angle DCE$ は、どちらも $90^\\circ$ に共通な $\\angle DCG$ をたした角です。この合同から $BG = DE$ がわかります。"
  }
];
