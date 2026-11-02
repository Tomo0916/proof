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
        { reason: "$AB \\parallel DC$ より、錯角は等しいので、", equations: ["$\\angle BAC = \\angle DCA$"] },
        { reason: "$AD \\parallel BC$ より、錯角は等しいので、", equations: ["$\\angle BCA = \\angle DAC$"] },
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
        { reason: "$AB \\parallel DC$ より、錯角は等しいので、", equations: ["$\\angle ABE = \\angle CDF$"] }
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
        { reason: "$AD \\parallel BC$ より、錯角は等しいので、", equations: ["$\\angle OAE = \\angle OCF$"] },
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
  }
];
