/**
 * 単元2: 共通な辺・角と合同
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "common";
const unitLabel = "共通な辺・角と合同";

export const unit2Problems = [
  {
    id: "com-01",
    unit, unitLabel,
    level: "★☆☆",
    title: "共通な辺を使う（3組の辺）",
    statement: "図で、$AB = AD$, $CB = CD$ ならば、$\\triangle ABC \\equiv \\triangle ADC$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [45, 72], C: [110, 128], D: [175, 72] },
      segs: ["AB", "BC", "CD", "DA", "AC"],
      sides: [{ segs: ["AB", "AD"], n: 1 }, { segs: ["CB", "CD"], n: 2 }]
    },
    triangles: ["ABC", "ADC"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AD$", "$CB = CD$"] },
        { reason: "共通な辺だから、", equations: ["$AC = AC$"] }
      ],
      condition: "3組の辺がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$\\angle BAC = \\angle DAC$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "2つの三角形が両方とも使っている辺 $AC$ が「共通な辺」です。問題文の2組と合わせて、3組の辺がそろいます。$\\angle BAC = \\angle DAC$ は合同を証明したあとでわかることなので、ここではまだ使えません。"
  },
  {
    id: "com-02",
    unit, unitLabel,
    level: "★☆☆",
    title: "共通な辺を使う（交わる線分）",
    statement: "図で、$AB = DC$, $AC = DB$ ならば、$\\triangle ABC \\equiv \\triangle DCB$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [70, 25], D: [150, 25], B: [40, 125], C: [180, 125] },
      segs: ["AB", "DC", "AC", "DB", "BC"],
      sides: [{ segs: ["AB", "DC"], n: 1 }, { segs: ["AC", "DB"], n: 2 }]
    },
    triangles: ["ABC", "DCB"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = DC$", "$AC = DB$"] },
        { reason: "共通な辺だから、", equations: ["$BC = CB$"] }
      ],
      condition: "3組の辺がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$\\angle ABC = \\angle DCB$" },
      { type: "condition", text: "1組の辺とその両端の角がそれぞれ等しいので" }
    ],
    explanation: "2つの三角形が重なっている図では、どちらにも含まれる辺 $BC$ が共通な辺です。三角形の頂点は、対応する順（$A$ と $D$、$B$ と $C$、$C$ と $B$）に書くことにも注意しましょう。"
  },
  {
    id: "com-03",
    unit, unitLabel,
    level: "★★☆",
    title: "共通な角を使う",
    statement: "図で、点 $D$ は辺 $AB$ 上、点 $E$ は辺 $AC$ 上にある。$AB = AC$, $AD = AE$ ならば、$\\triangle ABE \\equiv \\triangle ACD$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [40, 130], C: [180, 130], D: [71.5, 79.6], E: [148.5, 79.6] },
      segs: ["ADB", "AEC", "BE", "CD"],
      sides: [{ segs: ["AD", "AE"], n: 1 }, { segs: ["DB", "EC"], n: 2 }]
    },
    triangles: ["ABE", "ACD"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AC$", "$AE = AD$"] },
        { reason: "共通な角だから、", equations: ["$\\angle BAE = \\angle CAD$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$BE = CD$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "$\\angle BAE$ と $\\angle CAD$ は、どちらも頂点 $A$ の同じ角です。これが「共通な角」です。角は $\\angle BAE$ のように、頂点を真ん中にして3文字で書きます。"
  },
  {
    id: "com-04",
    unit, unitLabel,
    level: "★☆☆",
    title: "共通な辺と2組の角",
    statement: "図で、$\\angle ABC = \\angle DCB$, $\\angle ACB = \\angle DBC$ ならば、$\\triangle ABC \\equiv \\triangle DCB$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [70, 25], D: [150, 25], B: [40, 125], C: [180, 125] },
      segs: ["AB", "DC", "AC", "DB", "BC"],
      angles: [{ angs: ["ABC", "BCD"], n: 1, r: 30 }, { angs: ["ACB", "CBD"], n: 2, r: 13 }]
    },
    triangles: ["ABC", "DCB"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$\\angle ABC = \\angle DCB$", "$\\angle ACB = \\angle DBC$"] },
        { reason: "共通な辺だから、", equations: ["$BC = CB$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$AB = DC$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "共通な辺 $BC$ の両はしにある角（頂点 $B$ と $C$ の角）が2組とも等しいので、「1組の辺とその両端の角」が使えます。"
  },
  {
    id: "com-05",
    unit, unitLabel,
    level: "★☆☆",
    title: "共通な辺と間の角",
    statement: "図で、$AB = DC$, $\\angle ABC = \\angle DCB$ ならば、$\\triangle ABC \\equiv \\triangle DCB$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [70, 25], D: [150, 25], B: [40, 125], C: [180, 125] },
      segs: ["AB", "DC", "AC", "DB", "BC"],
      sides: [{ segs: ["AB", "DC"], n: 1 }],
      angles: [{ angs: ["ABC", "BCD"], n: 1 }]
    },
    triangles: ["ABC", "DCB"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = DC$", "$\\angle ABC = \\angle DCB$"] },
        { reason: "共通な辺だから、", equations: ["$BC = CB$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AC = DB$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "$\\angle ABC$ は、辺 $AB$ と共通な辺 $BC$ の「間の角」です。$AC = DB$ は合同を証明したあとでわかることなので、ここではまだ使えません。"
  },
  {
    id: "com-06",
    unit, unitLabel,
    level: "★★☆",
    title: "共通な角と2組の角",
    statement: "図で、点 $D$ は辺 $AB$ 上、点 $E$ は辺 $AC$ 上にある。$AB = AC$, $\\angle ABE = \\angle ACD$ ならば、$\\triangle ABE \\equiv \\triangle ACD$ であることを証明しなさい。",
    figure: {
      width: 220, height: 150,
      pts: { A: [110, 18], B: [40, 130], C: [180, 130], D: [71.5, 79.6], E: [148.5, 79.6] },
      segs: ["ADB", "AEC", "BE", "CD"],
      sides: [{ segs: ["AD", "AE"], n: 1 }, { segs: ["DB", "EC"], n: 2 }],
      angles: [{ angs: ["ABE", "DCA"], n: 1 }]
    },
    triangles: ["ABE", "ACD"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = AC$", "$\\angle ABE = \\angle ACD$"] },
        { reason: "共通な角だから、", equations: ["$\\angle BAE = \\angle CAD$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$BE = CD$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "辺 $AB$, $AC$ の両はしの角は、頂点 $A$ の角（共通な角）と、頂点 $B$, $C$ の角です。同じ図でも、わかっていることが変わると使う合同条件が変わります。"
  }
];
