/**
 * 単元3: 二等辺三角形・正三角形
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "isosceles";
const unitLabel = "二等辺三角形・正三角形";

export const unit3Problems = [
  {
    id: "tri-02",
    unit, unitLabel,
    level: "★☆☆",
    title: "二等辺三角形と底辺の中点",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ で、辺 $BC$ の中点を $M$ とする。このとき、$\\triangle ABM \\equiv \\triangle ACM$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [40, 130], C: [180, 130], M: [110, 130] },
      segs: ["AB", "AC", "BMC", "AM"],
      sides: [{ segs: ["AB", "AC"], n: 1 }, { segs: ["BM", "MC"], n: 2 }]
    },
    triangles: ["ABM", "ACM"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AC$"] },
        { reason: "$M$ は辺 $BC$ の中点だから、", equations: ["$BM = CM$"] },
        { reason: "共通な辺だから、", equations: ["$AM = AM$"] }
      ],
      condition: "3組の辺がそれぞれ等しいので"
    },
    extraTrue: ["∠ABC=∠ACB"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$\\angle BAM = \\angle CAM$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "「中点」という言葉から、$BM = CM$ がわかります。共通な辺 $AM$ と合わせて、3組の辺がそろいます。"
  },
  {
    id: "tri-01",
    unit, unitLabel,
    level: "★★☆",
    title: "二等辺三角形の頂角の二等分線",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ で、$\\angle A$ の二等分線と辺 $BC$ との交点を $D$ とする。このとき、$\\triangle ABD \\equiv \\triangle ACD$ であることを証明しなさい。",
    figure: {
      width: 200, height: 145,
      pts: { A: [100, 18], B: [40, 120], C: [160, 120], D: [100, 120] },
      segs: ["AB", "AC", "BDC", "AD"],
      sides: [{ segs: ["AB", "AC"], n: 1 }],
      angles: [{ angs: ["BAD", "DAC"], n: 1 }]
    },
    triangles: ["ABD", "ACD"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AC$"] },
        { reason: "$AD$ は $\\angle A$ の二等分線だから、", equations: ["$\\angle BAD = \\angle CAD$"] },
        { reason: "共通な辺だから、", equations: ["$AD = AD$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["∠ABC=∠ACB"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$BD = CD$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "「二等分線」から角が等しいことがわかります。2つの三角形が両方とも使っている辺 $AD$（共通な辺）を見落とさないようにしましょう。$BD = CD$ は、合同を証明したあとでわかることなので、ここではまだ使えません。"
  },
  {
    id: "tri-03",
    unit, unitLabel,
    level: "★★☆",
    title: "二等辺三角形の底角を使う",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ の辺 $BC$ 上に、$BD = CE$ となる点 $D$, $E$ をとる。このとき、$\\triangle ABD \\equiv \\triangle ACE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [30, 130], C: [190, 130], D: [80, 130], E: [140, 130] },
      segs: ["AB", "AC", "BDEC", "AD", "AE"],
      sides: [{ segs: ["AB", "AC"], n: 1 }, { segs: ["BD", "EC"], n: 2 }],
      angles: [{ angs: ["ABD", "ECA"], n: 1 }]
    },
    triangles: ["ABD", "ACE"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AC$", "$BD = CE$"] },
        { reason: "二等辺三角形の底角は等しいので、", equations: ["$\\angle ABD = \\angle ACE$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AD = AE$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "二等辺三角形では「底角は等しい」という性質が使えます。$\\angle ABD$ は $\\angle ABC$ と、$\\angle ACE$ は $\\angle ACB$ と同じ角です。"
  },
  {
    id: "tri-04",
    unit, unitLabel,
    level: "★★☆",
    title: "正三角形の辺と角を使う",
    statement: "正三角形 $ABC$ で、辺 $BC$ 上に点 $D$、辺 $CA$ 上に点 $E$ を、$BD = CE$ となるようにとる。このとき、$\\triangle ABD \\equiv \\triangle BCE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 160,
      pts: { A: [110, 18.8], B: [40, 140], C: [180, 140], D: [90, 140], E: [155, 96.7] },
      segs: ["AB", "BDC", "CEA", "AD", "BE"],
      sides: [{ segs: ["BD", "CE"], n: 1 }]
    },
    triangles: ["ABD", "BCE"],
    proof: {
      blocks: [
        { reason: "$\\triangle ABC$ は正三角形だから、", equations: ["$AB = BC$"] },
        { reason: "仮定より、", equations: ["$BD = CE$"] },
        { reason: "正三角形の角はすべて $60^\\circ$ だから、", equations: ["$\\angle ABD = \\angle BCE$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AB=CA", "BC=CA", "∠BAC=∠ABC", "∠BAC=∠BCA"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AD = BE$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "正三角形は「3つの辺が等しい」「3つの角が $60^\\circ$」の両方が使えます。$\\triangle ABD$ と $\\triangle BCE$ で対応する辺は $AB$ と $BC$ なので、$AB = BC$ を選びます。"
  },
  {
    id: "tri-05",
    unit, unitLabel,
    level: "★★★",
    title: "2つの正三角形",
    statement: "図で、3点 $B$, $C$, $D$ は一直線上にあり、$\\triangle ABC$ と $\\triangle ECD$ は正三角形である。このとき、$\\triangle ACD \\equiv \\triangle BCE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { B: [25, 130], C: [115, 130], D: [195, 130], A: [70, 52.1], E: [155, 60.7] },
      segs: ["BCD", "AB", "AC", "EC", "ED", "AD", "BE"],
      sides: [{ segs: ["AC", "BC"], n: 1 }, { segs: ["CD", "CE"], n: 2 }]
    },
    triangles: ["ACD", "BCE"],
    proof: {
      blocks: [
        { reason: "$\\triangle ABC$ は正三角形だから、", equations: ["$AC = BC$"] },
        { reason: "$\\triangle ECD$ は正三角形だから、", equations: ["$CD = CE$"] },
        { reason: "$\\angle ACD = 60^\\circ + \\angle ACE$, $\\angle BCE = 60^\\circ + \\angle ACE$ だから、", equations: ["$\\angle ACD = \\angle BCE$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["AB=BC", "AB=AC", "EC=ED", "ED=CD", "∠ACB=∠ECD"],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AD = BE$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "$\\angle ACD$ と $\\angle BCE$ は、どちらも「$60^\\circ$ の角」に「$\\angle ACE$」をたした角なので等しくなります。この考え方は入試でもよく出ます。"
  }
];
