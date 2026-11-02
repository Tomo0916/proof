/**
 * ステップ1用：生徒が書いた式（AB=CD、∠ABC=∠DEF など）を読み取り、
 * 「同じ意味の式かどうか」を判定するための部品。
 *
 * 次のような書き方の違いは、同じ式として扱います。
 *   ・辺の文字の順番          AO = BO と OA = OB
 *   ・左右の入れかえ          AO = BO と BO = AO
 *   ・角の端の文字の順番      ∠AOC と ∠COA
 *   ・一直線上の点による言いかえ ∠BAO と ∠BAC（O が線分 AC 上にあるとき）
 *     → 問題データの lines（一直線上に並ぶ点）を使って判定します。
 */

/** 問題データの KaTeX 表記（例: "$\\angle AOC = \\angle BOD$"）を "∠AOC=∠BOD" に直す */
export function texToPlain(tex) {
  return tex
    .replace(/\$/g, "")
    .replace(/\\angle/g, "∠")
    .replace(/\s+/g, "")
    .replace(/=\d+\^\\circ$/, "");   // 「∠A = ∠B = 90°」の「= 90°」は比べるときに使わない
}

/** 画面表示用に「=」の前後へすき間を入れる */
export function formatPlain(text) {
  return text.replace(/=/g, " = ");
}

/**
 * 頂点 vertex から点 through の方向へのびる半直線を、
 * 「その直線上でいちばん遠い点」で代表させる（∠BAO と ∠BAC を同じにするため）
 */
function rayEnd(vertex, through, lines) {
  for (const line of lines) {
    const iv = line.indexOf(vertex);
    const it = line.indexOf(through);
    if (iv !== -1 && it !== -1) {
      return it > iv ? line[line.length - 1] : line[0];
    }
  }
  return through;
}

function readSide(str, problem) {
  const { points, lines = [] } = problem;
  let kind;
  let letters;

  if (str.startsWith("∠")) {
    kind = "angle";
    letters = [...str.slice(1)];
    if (letters.includes("∠")) return { error: "「∠」は角の名前の先頭に1つだけ書きます（例: ∠ABC）" };
    if (letters.length !== 3) return { error: "角は「∠」のあとに点を3つ書きます（例: ∠ABC）" };
  } else {
    if (str.includes("∠")) return { error: "「∠」は角の名前の先頭に書きます（例: ∠ABC）" };
    kind = "segment";
    letters = [...str];
    if (letters.length !== 2) return { error: "辺は点を2つ書きます（例: AB）" };
  }

  const unknown = letters.find(c => !points.includes(c));
  if (unknown) return { error: `図に「${unknown}」という点はありません` };
  if (new Set(letters).size !== letters.length) return { error: "同じ点が2回入っています" };

  if (kind === "segment") {
    return { kind, key: [...letters].sort().join("") };
  }

  const [x, v, z] = letters;
  const ex = rayEnd(v, x, lines);
  const ez = rayEnd(v, z, lines);
  if (ex === ez) return { error: "角になっていません。真ん中の文字が角の頂点になるように書きます" };
  return { kind, key: `∠${v}:${[ex, ez].sort().join("")}` };
}

/**
 * 1行分の式を読み取る
 * @returns {{empty:true} | {error:string} | {key:string}}
 *   key は「同じ意味の式なら同じ文字列」になる比較用の値
 */
export function readEquality(text, problem) {
  const t = text.replace(/\s+/g, "");
  if (!t) return { empty: true };

  const parts = t.split("=");
  if (parts.length === 1) return { error: "「=」を使って、等しい2つを書きます（例: AB=CD）" };
  if (parts.length > 2) return { error: "「=」は1行に1つだけ使います" };
  if (!parts[0] || !parts[1]) return { error: "「=」の左と右の両方に書きます" };

  const left = readSide(parts[0], problem);
  if (left.error) return left;
  const right = readSide(parts[1], problem);
  if (right.error) return right;
  if (left.kind !== right.kind) return { error: "辺と角を「=」で結ぶことはできません" };

  return { key: [left.key, right.key].sort().join("=") };
}
