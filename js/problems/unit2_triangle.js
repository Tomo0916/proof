/**
 * 単元2: 三角形と四角形
 * ※理由と等式は別々のカードに分けています（単元1と形式をそろえるため）。
 */
export const unit2Problems = [
  {
    id: "tri-01",
    unit: "triangle_quad",
    unitLabel: "三角形と四角形",
    difficulty: "★★☆",
    title: "二等辺三角形の頂角の二等分線",
    statement: "$AB = AC$ の二等辺三角形 $ABC$ で、$\\angle A$ の二等分線と辺 $BC$ との交点を $D$ とする。このとき、$\\triangle ABD \\equiv \\triangle ACD$ であることを証明しなさい。",
    svg: `
      <svg width="200" height="140" viewBox="0 0 200 140" class="max-w-full h-auto" role="img" aria-label="二等辺三角形ABCと、頂角Aの二等分線AD">
        <polygon points="100,20 40,120 160,120" fill="none" stroke="#334155" stroke-width="2" />
        <!-- 二等分線 AD -->
        <line x1="100" y1="20" x2="100" y2="120" stroke="#334155" stroke-width="2" />
        <!-- AB = AC の印 -->
        <line x1="74.3" y1="72.6" x2="65.7" y2="67.4" stroke="#ef4444" stroke-width="2" />
        <line x1="134.3" y1="67.4" x2="125.7" y2="72.6" stroke="#ef4444" stroke-width="2" />
        <!-- ∠BAD = ∠CAD の印 -->
        <path d="M90.7,35.4 A18,18 0 0,0 100,38" fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d="M100,38 A18,18 0 0,0 109.3,35.4" fill="none" stroke="#f59e0b" stroke-width="2" />
        <!-- 頂点ラベル -->
        <text x="96" y="15" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="25" y="125" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="165" y="125" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="96" y="135" font-size="12" fill="#0f172a" font-weight="bold">D</text>
      </svg>
    `,
    pieces: [
      { id: "p1", role: "target", text: "$\\triangle ABD$ と $\\triangle ACD$ において" },
      { id: "p2", role: "fact", text: "仮定より、" },
      { id: "p3", role: "fact", text: "$AB = AC$ …… ①" },
      { id: "p4", role: "fact", text: "$AD$ は $\\angle A$ の二等分線だから、" },
      { id: "p5", role: "fact", text: "$\\angle BAD = \\angle CAD$ …… ②" },
      { id: "p6", role: "fact", text: "共通な辺だから、" },
      { id: "p7", role: "fact", text: "$AD = AD$ …… ③" },
      { id: "p8", role: "condition", text: "①, ②, ③より、2組の辺とその間の角がそれぞれ等しいので" },
      { id: "p9", role: "conclusion", text: "$\\triangle ABD \\equiv \\triangle ACD$" },
      // ダミー選択肢
      { id: "d1", role: "dummy", text: "対頂角は等しいので、" },
      { id: "d2", role: "dummy", text: "①, ②, ③より、3組の辺がそれぞれ等しいので" }
    ],
    requiredIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"],
    explanation: "「二等分線」という言葉から角の等しい関係（$\\angle BAD = \\angle CAD$）を導き、2つの三角形が共有している「共通な辺」$AD$ を見落とさないようにするのがポイントです。"
  }
];
