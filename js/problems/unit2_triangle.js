/**
 * 単元2: 三角形と四角形
 * データの書き方は problems/index.js の先頭を参照してください。
 */
export const unit2Problems = [
  {
    id: "tri-01",
    unit: "triangle_quad",
    unitLabel: "三角形と四角形",
    level: "★★☆",
    title: "二等辺三角形の頂角の二等分線",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ で、$\\angle A$ の二等分線と辺 $BC$ との交点を $D$ とする。このとき、$\\triangle ABD \\equiv \\triangle ACD$ であることを証明しなさい。",
    svg: `
      <svg width="200" height="140" viewBox="0 0 200 140" class="max-w-full h-auto" role="img" aria-label="二等辺三角形ABCと、頂角Aの二等分線AD">
        <polygon points="100,20 40,120 160,120" fill="none" stroke="#334155" stroke-width="2" />
        <line x1="100" y1="20" x2="100" y2="120" stroke="#334155" stroke-width="2" />
        <!-- AB = AC の印 -->
        <line x1="74.3" y1="72.6" x2="65.7" y2="67.4" stroke="#ef4444" stroke-width="2" />
        <line x1="134.3" y1="67.4" x2="125.7" y2="72.6" stroke="#ef4444" stroke-width="2" />
        <!-- ∠BAD = ∠CAD の印 -->
        <path d="M90.7,35.4 A18,18 0 0,0 100,38" fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d="M100,38 A18,18 0 0,0 109.3,35.4" fill="none" stroke="#f59e0b" stroke-width="2" />
        <text x="96" y="15" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="25" y="125" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="165" y="125" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="96" y="135" font-size="12" fill="#0f172a" font-weight="bold">D</text>
      </svg>
    `,
    points: ["A", "B", "C", "D"],
    lines: [["B", "D", "C"], ["A", "B"], ["A", "C"], ["A", "D"]],
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
  }
];
