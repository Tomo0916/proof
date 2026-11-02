/**
 * 問題の図を、点の座標から自動で描く（SVG）
 *
 * figure: {
 *   width, height,                 // 図の大きさ（省略時 220×150）
 *   pts: { A: [x, y], ... },       // 点の座標（y は下向き）。名前が "_" で始まる点はラベルを出さない
 *   segs: ["AOB", "AC", ["_L","D","A","E","_R"]],
 *                                  // 線分。一直線上に並ぶ点を順に書く（端から端まで1本の線になる）
 *                                  // ここに書いた並びが、∠BAO と ∠BAC を同じ角と判定するのにも使われる
 *   sides:     [{ segs: ["AO", "BO"], n: 1 }],   // 等しい辺の印（n 本線）
 *   angles:    [{ angs: ["BAD", "CAD"], n: 1 }], // 等しい角の印（n 重の弧）。真ん中の文字が頂点
 *   rights:    ["ADB"],                          // 直角の印。真ん中の文字が頂点
 *   parallels: [{ segs: ["AB", "DC"], n: 1 }],   // 平行の印（矢印 n 個。1文字目→2文字目の向き）
 *                                                // 等しい辺の印と重ならないよう、辺の 35% の位置に描く
 *   labels:    { O: [dx, dy] },                  // ラベル位置を手で調整したいとき
 *   texts:     [{ at: [x, y], text: "ℓ" }]       // 点以外の文字
 * }
 */

const SIDE_COLORS = ["#ef4444", "#2563eb", "#9333ea"];
const ANGLE_COLORS = ["#f59e0b", "#16a34a", "#db2777"];
const LINE_COLOR = "#334155";
const TEXT_COLOR = "#0f172a";

const f = n => Math.round(n * 10) / 10;
const toArray = seg => (Array.isArray(seg) ? seg : [...seg]);
const isHidden = name => name.startsWith("_");

function unit(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

export function drawFigure(fig) {
  const {
    width = 220, height = 150, pts, segs = [],
    sides = [], angles = [], rights = [], parallels = [],
    labels = {}, texts = []
  } = fig;

  const P = name => {
    const p = pts[name];
    if (!p) throw new Error(`図のデータに点「${name}」がありません`);
    return p;
  };
  const out = [];

  // 線分
  segs.forEach(seg => {
    const a = toArray(seg);
    const [x1, y1] = P(a[0]);
    const [x2, y2] = P(a[a.length - 1]);
    out.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${LINE_COLOR}" stroke-width="2" stroke-linecap="round" />`);
  });

  // 等しい辺の印
  sides.forEach((group, gi) => {
    const color = SIDE_COLORS[gi % SIDE_COLORS.length];
    const n = group.n || gi + 1;
    group.segs.forEach(s => {
      const [a, b] = toArray(s);
      const [x1, y1] = P(a);
      const [x2, y2] = P(b);
      const [dx, dy] = unit(x2 - x1, y2 - y1);
      const [nx, ny] = [-dy, dx];
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * 4;
        const cx = mx + dx * off;
        const cy = my + dy * off;
        out.push(`<line x1="${f(cx - nx * 5)}" y1="${f(cy - ny * 5)}" x2="${f(cx + nx * 5)}" y2="${f(cy + ny * 5)}" stroke="${color}" stroke-width="2" />`);
      }
    });
  });

  // 等しい角の印
  angles.forEach((group, gi) => {
    const color = ANGLE_COLORS[gi % ANGLE_COLORS.length];
    const n = group.n || gi + 1;
    group.angs.forEach(ang => {
      const [p, v, q] = toArray(ang);
      const [vx, vy] = P(v);
      const a1 = Math.atan2(P(p)[1] - vy, P(p)[0] - vx);
      const a2 = Math.atan2(P(q)[1] - vy, P(q)[0] - vx);
      let delta = a2 - a1;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta <= -Math.PI) delta += 2 * Math.PI;
      const sweep = delta > 0 ? 1 : 0;
      // 隣り合う角の印がつながって見えないように、両はしを少しあける
      for (let i = 0; i < n; i++) {
        const r = 16 + i * 4;
        const gap = Math.sign(delta) * Math.min(3.5 / r, Math.abs(delta) / 4);
        const b1 = a1 + gap;
        const b2 = a2 - gap;
        const sx = vx + r * Math.cos(b1);
        const sy = vy + r * Math.sin(b1);
        const ex = vx + r * Math.cos(b2);
        const ey = vy + r * Math.sin(b2);
        out.push(`<path d="M${f(sx)},${f(sy)} A${r},${r} 0 0,${sweep} ${f(ex)},${f(ey)}" fill="none" stroke="${color}" stroke-width="2" />`);
      }
    });
  });

  // 直角の印
  rights.forEach(ang => {
    const [p, v, q] = toArray(ang);
    const [vx, vy] = P(v);
    const [ux, uy] = unit(P(p)[0] - vx, P(p)[1] - vy);
    const [wx, wy] = unit(P(q)[0] - vx, P(q)[1] - vy);
    const s = 9;
    out.push(`<path d="M${f(vx + ux * s)},${f(vy + uy * s)} L${f(vx + ux * s + wx * s)},${f(vy + uy * s + wy * s)} L${f(vx + wx * s)},${f(vy + wy * s)}" fill="none" stroke="#64748b" stroke-width="1.5" />`);
  });

  // 平行の印
  parallels.forEach((group, gi) => {
    const n = group.n || gi + 1;
    group.segs.forEach(s => {
      const [a, b] = toArray(s);
      const [x1, y1] = P(a);
      const [x2, y2] = P(b);
      const [dx, dy] = unit(x2 - x1, y2 - y1);
      const [nx, ny] = [-dy, dx];
      const mx = x1 + (x2 - x1) * 0.35;
      const my = y1 + (y2 - y1) * 0.35;
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * 6;
        const tx = mx + dx * (off + 3);
        const ty = my + dy * (off + 3);
        out.push(`<path d="M${f(tx - dx * 6 + nx * 4)},${f(ty - dy * 6 + ny * 4)} L${f(tx)},${f(ty)} L${f(tx - dx * 6 - nx * 4)},${f(ty - dy * 6 - ny * 4)}" fill="none" stroke="#16a34a" stroke-width="2" />`);
      }
    });
  });

  // 点のラベル（線が来ていない、いちばん広い方向に置く）
  const neighbors = {};
  segs.forEach(seg => {
    const a = toArray(seg);
    a.forEach((name, i) => {
      neighbors[name] = neighbors[name] || [];
      if (i > 0) neighbors[name].push(a[i - 1]);
      if (i < a.length - 1) neighbors[name].push(a[i + 1]);
    });
  });
  Object.keys(pts).filter(name => !isHidden(name)).forEach(name => {
    const [x, y] = pts[name];
    let dx;
    let dy;
    if (labels[name]) {
      [dx, dy] = labels[name];
    } else {
      const dirs = (neighbors[name] || [])
        .map(nb => Math.atan2(pts[nb][1] - y, pts[nb][0] - x))
        .sort((a, b) => a - b);
      let angle = -Math.PI / 2;
      if (dirs.length === 1) {
        angle = dirs[0] + Math.PI;
      } else if (dirs.length > 1) {
        let best = -1;
        dirs.forEach((d, i) => {
          const next = i === dirs.length - 1 ? dirs[0] + 2 * Math.PI : dirs[i + 1];
          if (next - d > best) {
            best = next - d;
            angle = d + (next - d) / 2;
          }
        });
      }
      dx = Math.cos(angle) * 12;
      dy = Math.sin(angle) * 12;
    }
    out.push(`<text x="${f(x + dx)}" y="${f(y + dy)}" font-size="13" fill="${TEXT_COLOR}" font-weight="bold" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman, serif" font-style="italic">${name}</text>`);
  });

  texts.forEach(t => {
    out.push(`<text x="${f(t.at[0])}" y="${f(t.at[1])}" font-size="13" fill="${TEXT_COLOR}" font-style="italic" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman, serif">${t.text}</text>`);
  });

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="max-w-full h-auto" role="img" aria-label="問題の図">${out.join("")}</svg>`;
}

/**
 * 問題データを使える形に整える
 * figure があれば、図（svg）・点の一覧（points）・一直線上の点（lines）を自動で作る
 */
export function prepareProblem(prob) {
  if (!prob.figure) return prob;
  const visible = Object.keys(prob.figure.pts).filter(n => !isHidden(n)).sort();
  return {
    ...prob,
    svg: prob.svg || drawFigure(prob.figure),
    points: prob.points || visible,
    lines: prob.lines || prob.figure.segs.map(toArray)
  };
}
