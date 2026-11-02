/**
 * 単元1: 平行と合同
 * データの書き方は problems/index.js の先頭を参照してください。
 */
export const unit1Problems = [
  {
    id: "cong-01",
    unit: "parallel_congruence",
    unitLabel: "平行と合同",
    level: "★☆☆",
    title: "対頂角を使う証明",
    statement: "図で、線分 $AB$ と $CD$ の交点を $O$ とする。$AO = BO$, $CO = DO$ ならば $\\triangle AOC \\equiv \\triangle BOD$ であることを証明しなさい。",
    svg: `
      <svg width="200" height="130" viewBox="0 0 200 130" class="max-w-full h-auto" role="img" aria-label="線分ABとCDが点Oで交わる図">
        <line x1="30" y1="25" x2="170" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="30" y1="105" x2="170" y2="25" stroke="#334155" stroke-width="2" />
        <line x1="30" y1="25" x2="30" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="170" y1="25" x2="170" y2="105" stroke="#334155" stroke-width="2" />
        <!-- AO = BO の印（1本線） -->
        <line x1="67.5" y1="40.7" x2="62.5" y2="49.3" stroke="#ef4444" stroke-width="2" />
        <line x1="137.5" y1="80.7" x2="132.5" y2="89.3" stroke="#ef4444" stroke-width="2" />
        <!-- CO = DO の印（2本線） -->
        <line x1="64.9" y1="90.8" x2="59.9" y2="82.2" stroke="#2563eb" stroke-width="2" />
        <line x1="70.1" y1="87.8" x2="65.1" y2="79.2" stroke="#2563eb" stroke-width="2" />
        <line x1="134.9" y1="50.8" x2="129.9" y2="42.2" stroke="#2563eb" stroke-width="2" />
        <line x1="140.1" y1="47.8" x2="135.1" y2="39.2" stroke="#2563eb" stroke-width="2" />
        <text x="18" y="25" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="18" y="115" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="175" y="25" font-size="12" fill="#0f172a" font-weight="bold">D</text>
        <text x="175" y="115" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="96" y="55" font-size="12" fill="#0f172a" font-weight="bold">O</text>
      </svg>
    `,
    points: ["A", "B", "C", "D", "O"],
    lines: [["A", "O", "B"], ["C", "O", "D"], ["A", "C"], ["D", "B"]],
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
    explanation: "問題文からわかる2組の辺に加えて、図から「対頂角は等しい」ことに気づけたかがポイントです。2組の辺の「間の角」になっているかも確かめましょう。"
  },
  {
    id: "cong-02",
    unit: "parallel_congruence",
    unitLabel: "平行と合同",
    level: "★★☆",
    title: "平行線の錯角を使う証明",
    statement: "図で、線分 $AC$ と $BD$ の交点を $O$ とする。$AB \\parallel DC$, $AB = CD$ のとき、$\\triangle ABO \\equiv \\triangle CDO$ であることを証明しなさい。",
    svg: `
      <svg width="220" height="125" viewBox="0 0 220 125" class="max-w-full h-auto" role="img" aria-label="平行な線分ABとDCを、線分ACとBDが点Oで結ぶ図">
        <line x1="30" y1="30" x2="150" y2="30" stroke="#334155" stroke-width="2" />
        <line x1="70" y1="105" x2="190" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="30" y1="30" x2="190" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="150" y1="30" x2="70" y2="105" stroke="#334155" stroke-width="2" />
        <!-- 平行の印（矢印） -->
        <path d="M56,26 L62,30 L56,34" fill="none" stroke="#16a34a" stroke-width="2" />
        <path d="M96,101 L102,105 L96,109" fill="none" stroke="#16a34a" stroke-width="2" />
        <!-- AB = CD の印 -->
        <line x1="90" y1="25" x2="90" y2="35" stroke="#ef4444" stroke-width="2" />
        <line x1="130" y1="100" x2="130" y2="110" stroke="#ef4444" stroke-width="2" />
        <text x="18" y="34" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="156" y="34" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="194" y="116" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="58" y="116" font-size="12" fill="#0f172a" font-weight="bold">D</text>
        <text x="106" y="57" font-size="12" fill="#0f172a" font-weight="bold">O</text>
      </svg>
    `,
    points: ["A", "B", "C", "D", "O"],
    lines: [["A", "O", "C"], ["B", "O", "D"], ["A", "B"], ["D", "C"]],
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
  }
];
