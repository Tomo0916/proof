/**
 * 単元1: 平行と合同
 * ※UI上のネタバレ（label）を排除し、内部ロジック用の role のみ保持します。
 * ※requiredIds は正しい証明の順番どおりに並べます。
 */
export const unit1Problems = [
  {
    id: "cong-01",
    unit: "parallel_congruence",
    unitLabel: "平行と合同",
    difficulty: "★☆☆",
    title: "対頂角と仮定を使った合同の証明",
    statement: "図で、線分 $AB$ と $CD$ の交点を $O$ とする。$AO = BO$, $CO = DO$ ならば $\\triangle AOC \\equiv \\triangle BOD$ であることを証明しなさい。",
    svg: `
      <svg width="200" height="130" viewBox="0 0 200 130" class="max-w-full h-auto" role="img" aria-label="線分ABとCDが点Oで交わる図">
        <!-- 線分 AB・CD -->
        <line x1="30" y1="25" x2="170" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="30" y1="105" x2="170" y2="25" stroke="#334155" stroke-width="2" />
        <!-- 線分 AC・DB -->
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
        <!-- 頂点ラベル -->
        <text x="18" y="25" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="18" y="115" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="175" y="25" font-size="12" fill="#0f172a" font-weight="bold">D</text>
        <text x="175" y="115" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="96" y="55" font-size="12" fill="#0f172a" font-weight="bold">O</text>
      </svg>
    `,
    pieces: [
      { id: "p1", role: "target", text: "$\\triangle AOC$ と $\\triangle BOD$ において" },
      { id: "p2", role: "fact", text: "仮定より、" },
      { id: "p3", role: "fact", text: "$AO = BO$ …… ①" },
      { id: "p4", role: "fact", text: "$CO = DO$ …… ②" },
      { id: "p5", role: "fact", text: "対頂角は等しいので、" },
      { id: "p6", role: "fact", text: "$\\angle AOC = \\angle BOD$ …… ③" },
      { id: "p7", role: "condition", text: "①, ②, ③より、2組の辺とその間の角がそれぞれ等しいので" },
      { id: "p8", role: "conclusion", text: "$\\triangle AOC \\equiv \\triangle BOD$" },
      // ダミー選択肢（問題文の条件や図からは使えないもの）
      { id: "d1", role: "dummy", text: "①, ②, ③より、3組の辺がそれぞれ等しいので" },
      { id: "d2", role: "dummy", text: "平行線の錯角は等しいので、" }
    ],
    requiredIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
    explanation: "①着目する三角形を宣言 ➔ ②「仮定より」「対頂角は等しいので」と理由を述べてから等式を書く ➔ ③当てはまる合同条件を示す ➔ ④合同を結論付ける、という4段階の流れを掴みましょう。"
  },
  {
    id: "cong-02",
    unit: "parallel_congruence",
    unitLabel: "平行と合同",
    difficulty: "★★☆",
    title: "平行線の錯角を利用する証明",
    statement: "図で、線分 $AC$ と $BD$ の交点を $O$ とする。$AB \\parallel DC$, $AB = CD$ のとき、$\\triangle ABO \\equiv \\triangle CDO$ であることを証明しなさい。",
    svg: `
      <svg width="220" height="125" viewBox="0 0 220 125" class="max-w-full h-auto" role="img" aria-label="平行な線分ABとDCを、線分ACとBDが点Oで結ぶ図">
        <!-- 平行な線分 AB・DC -->
        <line x1="30" y1="30" x2="150" y2="30" stroke="#334155" stroke-width="2" />
        <line x1="70" y1="105" x2="190" y2="105" stroke="#334155" stroke-width="2" />
        <!-- 線分 AC・BD（交点 O） -->
        <line x1="30" y1="30" x2="190" y2="105" stroke="#334155" stroke-width="2" />
        <line x1="150" y1="30" x2="70" y2="105" stroke="#334155" stroke-width="2" />
        <!-- 平行の印（矢印） -->
        <path d="M56,26 L62,30 L56,34" fill="none" stroke="#16a34a" stroke-width="2" />
        <path d="M96,101 L102,105 L96,109" fill="none" stroke="#16a34a" stroke-width="2" />
        <!-- AB = CD の印 -->
        <line x1="90" y1="25" x2="90" y2="35" stroke="#ef4444" stroke-width="2" />
        <line x1="130" y1="100" x2="130" y2="110" stroke="#ef4444" stroke-width="2" />
        <!-- 頂点ラベル -->
        <text x="18" y="34" font-size="12" fill="#0f172a" font-weight="bold">A</text>
        <text x="156" y="34" font-size="12" fill="#0f172a" font-weight="bold">B</text>
        <text x="194" y="116" font-size="12" fill="#0f172a" font-weight="bold">C</text>
        <text x="58" y="116" font-size="12" fill="#0f172a" font-weight="bold">D</text>
        <text x="106" y="57" font-size="12" fill="#0f172a" font-weight="bold">O</text>
      </svg>
    `,
    pieces: [
      { id: "p1", role: "target", text: "$\\triangle ABO$ と $\\triangle CDO$ において" },
      { id: "p2", role: "fact", text: "仮定より、" },
      { id: "p3", role: "fact", text: "$AB = CD$ …… ①" },
      { id: "p4", role: "fact", text: "$AB \\parallel DC$ より、平行線の錯角は等しいので、" },
      { id: "p5", role: "fact", text: "$\\angle BAO = \\angle DCO$ …… ②" },
      { id: "p6", role: "fact", text: "$\\angle ABO = \\angle CDO$ …… ③" },
      { id: "p7", role: "condition", text: "①, ②, ③より、1組の辺とその両端の角がそれぞれ等しいので" },
      { id: "p8", role: "conclusion", text: "$\\triangle ABO \\equiv \\triangle CDO$" },
      // ダミー選択肢
      { id: "d1", role: "dummy", text: "平行線の同位角は等しいので、" },
      { id: "d2", role: "dummy", text: "①, ②, ③より、2組の辺とその間の角がそれぞれ等しいので" }
    ],
    requiredIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
    explanation: "平行線があるときは「錯角は等しい」を使って等しい角を導きます。①の辺 $AB$, $CD$ の両端にある角が②③で揃っているので、「1組の辺とその両端の角」が使えます。"
  }
];
