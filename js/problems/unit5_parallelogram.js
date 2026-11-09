/**
 * 単元5: 平行四辺形
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "parallelogram";
const unitLabel = "平行四辺形";

export const unit5Problems = [
  {
    id: "pg-01",
    unit, unitLabel,
    level: "★★☆",
    title: "平行四辺形を対角線で分ける",
    statement: "平行四辺形 $ABCD$ に対角線 $AC$ をひく。このとき、$\\triangle ABC \\equiv \\triangle CDA$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30] },
      segs: ["AB", "BC", "CD", "DA", "AC"],
      parallels: [{ segs: ["BA", "CD"], n: 1 }, { segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["ABC", "CDA"],
    proof: {
      blocks: [
        { reason: "$AB \\parallel DC$ より、平行線の錯角は等しいので、", equations: ["$\\angle BAC = \\angle DCA$"] },
        { reason: "$AD \\parallel BC$ より、平行線の錯角は等しいので、", equations: ["$\\angle BCA = \\angle DAC$"] },
        { reason: "共通な辺だから、", equations: ["$AC = CA$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: ["∠ABC=∠CDA"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$AB = AD$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "平行四辺形は「2組の向かい合う辺がそれぞれ平行」な四角形です。2組の平行線それぞれで錯角を使い、共通な辺 $AC$ の両はしの角をそろえます。この合同から「平行四辺形の向かい合う辺は等しい」ことが証明できます。"
  },
  {
    id: "pg-02",
    unit, unitLabel,
    level: "★★★",
    title: "対角線上の2点",
    statement: "平行四辺形 $ABCD$ の対角線 $BD$ 上に、$BE = DF$ となる点 $E$, $F$ をとる。このとき、$\\triangle ABE \\equiv \\triangle CDF$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30], E: [87, 93], F: [163, 57] },
      segs: ["AB", "BC", "CD", "DA", "BEFD", "AE", "CF"],
      sides: [{ segs: ["BE", "FD"], n: 1 }],
      parallels: [{ segs: ["BA", "CD"], n: 1 }, { segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["ABE", "CDF"],
    proof: {
      blocks: [
        { reason: "平行四辺形の向かい合う辺は等しいので、", equations: ["$AB = CD$"] },
        { reason: "仮定より、", equations: ["$BE = DF$"] },
        { reason: "$AB \\parallel DC$ より、平行線の錯角は等しいので、", equations: ["$\\angle ABE = \\angle CDF$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AD=BC", "∠BAD=∠BCD", "∠ABC=∠CDA"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AE = CF$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "平行四辺形の性質「向かい合う辺は等しい」と、平行線の錯角を組み合わせます。$\\angle ABE$ と $\\angle CDF$ は、平行な $AB$, $DC$ と対角線 $BD$ がつくる錯角です。"
  },
  {
    id: "pg-03",
    unit, unitLabel,
    level: "★★★",
    title: "対角線の交点を通る直線",
    statement: "平行四辺形 $ABCD$ の対角線の交点 $O$ を通る直線が、辺 $AD$, $BC$ と交わる点をそれぞれ $E$, $F$ とする。このとき、$\\triangle AOE \\equiv \\triangle COF$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30], O: [125, 75], E: [100, 30], F: [150, 120] },
      segs: ["AB", "BFC", "CD", "AED", "AOC", "BOD", "EOF"],
      sides: [{ segs: ["AO", "OC"], n: 1 }],
      parallels: [{ segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["AOE", "COF"],
    proof: {
      blocks: [
        { reason: "平行四辺形の対角線は、それぞれの中点で交わるので、", equations: ["$AO = CO$"] },
        { reason: "$AD \\parallel BC$ より、平行線の錯角は等しいので、", equations: ["$\\angle OAE = \\angle OCF$"] },
        { reason: "対頂角は等しいので、", equations: ["$\\angle AOE = \\angle COF$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: ["BO=DO"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$AE = CF$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "平行四辺形の性質「対角線はそれぞれの中点で交わる」から $AO = CO$ がわかります。さらに錯角と対頂角で、辺 $AO$, $CO$ の両はしの角がそろいます。$AE = CF$ は合同を証明したあとでわかることです。"
  },
  {
    id: "pg-04",
    unit, unitLabel,
    level: "★★☆",
    title: "向かい合う辺の上の2点",
    statement: "平行四辺形 $ABCD$ の辺 $AD$, $BC$ 上に、$AE = CF$ となる点 $E$, $F$ をとる。このとき、$\\triangle ABE \\equiv \\triangle CDF$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30], E: [110, 30], F: [140, 120] },
      segs: ["AED", "BFC", "AB", "CD", "BE", "DF"],
      sides: [{ segs: ["AE", "FC"], n: 1 }],
      parallels: [{ segs: ["BA", "CD"], n: 1 }, { segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["ABE", "CDF"],
    proof: {
      blocks: [
        { reason: "平行四辺形の向かい合う辺は等しいので、", equations: ["$AB = CD$"] },
        { reason: "仮定より、", equations: ["$AE = CF$"] },
        { reason: "平行四辺形の向かい合う角は等しいので、", equations: ["$\\angle BAE = \\angle DCF$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AD=BC", "∠ABC=∠CDA"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$BE = DF$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "平行四辺形の性質「向かい合う辺は等しい」「向かい合う角は等しい」を使います。$\\angle BAE$ は $\\angle BAD$ と、$\\angle DCF$ は $\\angle DCB$ と同じ角です。"
  },
  {
    id: "pg-05",
    unit, unitLabel,
    level: "★★☆",
    title: "向かい合う辺の中点",
    statement: "平行四辺形 $ABCD$ の辺 $AB$, $CD$ の中点をそれぞれ $M$, $N$ とする。このとき、$\\triangle AMD \\equiv \\triangle CNB$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30], M: [45, 75], N: [205, 75] },
      segs: ["AMB", "BC", "CND", "DA", "MD", "NB"],
      sides: [{ segs: ["AM", "MB", "CN", "ND"], n: 1 }],
      parallels: [{ segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["AMD", "CNB"],
    proof: {
      blocks: [
        { reason: "平行四辺形の向かい合う辺 $AB$, $CD$ は等しく、$M$, $N$ はそれぞれの中点だから、", equations: ["$AM = CN$"] },
        { reason: "平行四辺形の向かい合う辺は等しいので、", equations: ["$AD = CB$"] },
        { reason: "平行四辺形の向かい合う角は等しいので、", equations: ["$\\angle MAD = \\angle NCB$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AB=CD", "∠ABC=∠CDA"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$MD = NB$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "向かい合う辺 $AB$, $CD$ が等しいので、その半分の $AM$, $CN$ も等しくなります。$\\triangle AMD$ と $\\triangle CNB$ の頂点の対応（$A$ と $C$、$M$ と $N$、$D$ と $B$）を図で確かめましょう。"
  },
  {
    id: "pg-06",
    unit, unitLabel,
    level: "★★★",
    title: "対角線への2本の垂線",
    statement: "平行四辺形 $ABCD$ の頂点 $A$, $C$ から、対角線 $BD$ にそれぞれ垂線 $AE$, $CF$ をひく。このとき、$\\triangle ABE \\equiv \\triangle CDF$ であることを証明しなさい。",
    figure: {
      width: 240, height: 150,
      pts: { A: [60, 30], B: [30, 120], C: [190, 120], D: [220, 30], E: [89.3, 91.9], F: [160.7, 58.1] },
      segs: ["AB", "BC", "CD", "DA", "BEFD", "AE", "CF"],
      rights: ["AEB", "CFD"],
      parallels: [{ segs: ["BA", "CD"], n: 1 }, { segs: ["AD", "BC"], n: 2 }]
    },
    triangles: ["ABE", "CDF"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$\\angle AEB = \\angle CFD = 90^\\circ$"] },
        { reason: "平行四辺形の向かい合う辺は等しいので、", equations: ["$AB = CD$"] },
        { reason: "$AB \\parallel DC$ より、平行線の錯角は等しいので、", equations: ["$\\angle ABE = \\angle CDF$"] }
      ],
      condition: "直角三角形の斜辺と1つの鋭角がそれぞれ等しいので"
    },
    extraTrue: ["AD=BC"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AE = CF$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "垂線が出てきたら直角三角形の合同条件を考えます。$AB$, $CD$ はそれぞれの直角三角形の斜辺で、錯角から鋭角も等しくなります。この合同から $AE = CF$ がわかります。"
  }
];
