/**
 * 単元1: 対頂角・平行線と合同
 * データの書き方は problems/index.js の先頭を参照してください。
 */
const unit = "parallel";
const unitLabel = "対頂角・平行線と合同";

export const unit1Problems = [
  {
    id: "cong-01",
    unit, unitLabel,
    level: "★☆☆",
    title: "対頂角を使う",
    statement: "図で、線分 $AB$ と $CD$ の交点を $O$ とする。$AO = BO$, $CO = DO$ ならば、$\\triangle AOC \\equiv \\triangle BOD$ であることを証明しなさい。",
    figure: {
      width: 200, height: 130,
      pts: { A: [30, 25], C: [30, 105], D: [170, 25], B: [170, 105], O: [100, 65] },
      segs: ["AOB", "COD", "AC", "DB"],
      sides: [{ segs: ["AO", "OB"], n: 1 }, { segs: ["CO", "OD"], n: 2 }]
    },
    triangles: ["AOC", "BOD"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AO = BO$", "$CO = DO$"] },
        { reason: "対頂角は等しいので、", equations: ["$\\angle AOC = \\angle BOD$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: ["∠AOD=∠BOC"],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$AC = BD$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "問題文からわかる2組の辺に加えて、図から「対頂角は等しい」ことに気づけたかがポイントです。その角が2組の辺の「間の角」になっていることも確かめましょう。"
  },
  {
    id: "cong-05",
    unit, unitLabel,
    level: "★★☆",
    title: "平行線の同位角を使う",
    statement: "図で、3点 $A$, $C$, $E$ は一直線上にある。$AB \\parallel CD$, $AB = CD$, $AC = CE$ のとき、$\\triangle ABC \\equiv \\triangle CDE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 145,
      pts: { A: [30, 120], C: [110, 120], E: [190, 120], B: [60, 35], D: [140, 35] },
      segs: ["ACE", "AB", "BC", "CD", "DE"],
      sides: [{ segs: ["AC", "CE"], n: 1 }, { segs: ["AB", "CD"], n: 2 }],
      parallels: [{ segs: ["AB", "CD"], n: 1 }]
    },
    triangles: ["ABC", "CDE"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = CD$", "$AC = CE$"] },
        { reason: "$AB \\parallel CD$ より、平行線の同位角は等しいので、", equations: ["$\\angle BAC = \\angle DCE$"] }
      ],
      condition: "2組の辺とその間の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "平行線の錯角は等しいので、" },
      { type: "equation", text: "$BC = DE$" },
      { type: "condition", text: "3組の辺がそれぞれ等しいので" }
    ],
    explanation: "平行線があるときは、同位角か錯角が等しくなります。この図では、直線 $AE$ に対して $\\angle BAC$ と $\\angle DCE$ が同じ位置にあるので「同位角」です。$BC = DE$ は合同を証明したあとでわかることなので、ここではまだ使えません。"
  },
  {
    id: "cong-02",
    unit, unitLabel,
    level: "★★☆",
    title: "平行線の錯角を使う",
    statement: "図で、線分 $AC$ と $BD$ の交点を $O$ とする。$AB \\parallel DC$, $AB = CD$ のとき、$\\triangle ABO \\equiv \\triangle CDO$ であることを証明しなさい。",
    figure: {
      width: 220, height: 130,
      pts: { A: [30, 30], B: [150, 30], C: [190, 105], D: [70, 105], O: [110, 67.5] },
      segs: ["AB", "DC", "AOC", "BOD"],
      sides: [{ segs: ["AB", "DC"], n: 1 }],
      parallels: [{ segs: ["AB", "DC"], n: 1 }],
      labels: { O: [0, -13] }
    },
    triangles: ["ABO", "CDO"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AB = CD$"] },
        { reason: "$AB \\parallel DC$ より、平行線の錯角は等しいので、", equations: ["$\\angle BAO = \\angle DCO$", "$\\angle ABO = \\angle CDO$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: ["∠AOB=∠COD", "∠AOD=∠BOC"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$AO = CO$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "平行線があるときは「錯角は等しい」を使います。辺 $AB$, $CD$ の両はしの角が等しいので、「1組の辺とその両端の角」が使えます。$AO = CO$ は、合同を証明したあとでわかることなので、ここではまだ使えません。"
  },
  {
    id: "cong-06",
    unit, unitLabel,
    level: "★★☆",
    title: "中点・錯角・対頂角を組み合わせる",
    statement: "図で、線分 $AD$ と $BC$ の交点を $O$ とする。$AB \\parallel CD$ で、$O$ が線分 $AD$ の中点のとき、$\\triangle ABO \\equiv \\triangle DCO$ であることを証明しなさい。",
    figure: {
      width: 220, height: 145,
      pts: { A: [40, 30], B: [140, 30], D: [180, 120], C: [80, 120], O: [110, 75] },
      segs: ["AB", "CD", "AOD", "BOC"],
      sides: [{ segs: ["AO", "OD"], n: 1 }],
      parallels: [{ segs: ["AB", "CD"], n: 1 }]
    },
    triangles: ["ABO", "DCO"],
    proof: {
      blocks: [
        { reason: "$O$ は線分 $AD$ の中点だから、", equations: ["$AO = DO$"] },
        { reason: "$AB \\parallel CD$ より、平行線の錯角は等しいので、", equations: ["$\\angle BAO = \\angle CDO$"] },
        { reason: "対頂角は等しいので、", equations: ["$\\angle AOB = \\angle DOC$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: ["∠ABO=∠DCO"],
    dummies: [
      { type: "reason", text: "平行線の同位角は等しいので、" },
      { type: "equation", text: "$AB = DC$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "中点から1組の辺、錯角と対頂角から2組の角がわかります。辺 $AO$, $DO$ の両はしにある角（頂点 $A$ と $D$、頂点 $O$）を選ぶのがポイントです。$\\angle ABO = \\angle DCO$ も正しいですが、辺 $AO$ の両はしの角ではないので、この証明では使いません。"
  },
  {
    id: "cong-07",
    unit, unitLabel,
    level: "★★☆",
    title: "2組の平行線と同位角",
    statement: "図で、3点 $A$, $C$, $E$ は一直線上にある。$AB \\parallel CD$, $BC \\parallel DE$, $AC = CE$ のとき、$\\triangle ABC \\equiv \\triangle CDE$ であることを証明しなさい。",
    figure: {
      width: 220, height: 145,
      pts: { A: [25, 125], C: [105, 125], E: [185, 125], B: [55, 40], D: [135, 40] },
      segs: ["ACE", "AB", "BC", "CD", "DE"],
      sides: [{ segs: ["AC", "CE"], n: 1 }],
      parallels: [{ segs: ["AB", "CD"], n: 1 }, { segs: ["CB", "ED"], n: 2 }]
    },
    triangles: ["ABC", "CDE"],
    proof: {
      blocks: [
        { reason: "仮定より、", equations: ["$AC = CE$"] },
        { reason: "$AB \\parallel CD$ より、平行線の同位角は等しいので、", equations: ["$\\angle BAC = \\angle DCE$"] },
        { reason: "$BC \\parallel DE$ より、平行線の同位角は等しいので、", equations: ["$\\angle BCA = \\angle DEC$"] }
      ],
      condition: "1組の辺とその両端の角がそれぞれ等しいので"
    },
    extraTrue: [],
    dummies: [
      { type: "reason", text: "対頂角は等しいので、" },
      { type: "equation", text: "$AB = CD$" },
      { type: "condition", text: "2組の辺とその間の角がそれぞれ等しいので" }
    ],
    explanation: "平行線が2組あるので、同位角も2組できます。辺 $AC$, $CE$ の両はしの角がそろうので「1組の辺とその両端の角」が使えます。"
  }
];
