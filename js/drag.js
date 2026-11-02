/**
 * ステップ2のカードをドラッグで動かす
 *
 * ・パソコン（マウス）: そのままドラッグ
 * ・スマホ（タッチ）  : 少し長押ししてからドラッグ（ふつうのスワイプは画面のスクロールになる）
 * ・タップ（クリック）の動きはそのまま残す
 *
 * ドラッグできる要素には data-drag-src="answer" / "palette" と data-index を付けておく。
 * data-act の付いたボタン（▲▼✕）の上からはドラッグを始めない。
 */

const MOUSE_THRESHOLD = 5;     // マウスはこれだけ動いたらドラッグ開始（px）
const TOUCH_HOLD_MS = 220;     // タッチはこの時間長押ししたらドラッグ開始
const TOUCH_SLOP = 8;          // 長押しの間にこれ以上動いたらスクロールとみなす（px）
const EDGE = 70;               // 画面の端に近づいたら自動でスクロール（px）

export function setupCardDrag({ dropZone, paletteZone, onDrop }) {
  let pending = null;   // ドラッグ開始前（押しただけ）の状態
  let drag = null;      // ドラッグ中の状態
  let suppressClickUntil = 0;
  let scrollTimer = null;

  const indicator = document.createElement("div");
  indicator.className = "drop-indicator";

  // ---------- 開始 ----------
  function onPointerDown(e) {
    if (drag) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = e.target.closest("[data-drag-src]");
    if (!el || e.target.closest("[data-act]")) return;
    if (!dropZone.contains(el) && !paletteZone.contains(el)) return;

    pending = {
      el,
      src: el.dataset.dragSrc,
      index: Number(el.dataset.index),
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      timer: null
    };
    if (e.pointerType !== "mouse") {
      pending.timer = setTimeout(startDrag, TOUCH_HOLD_MS);
    }
  }

  function cancelPending() {
    if (pending && pending.timer) clearTimeout(pending.timer);
    pending = null;
  }

  function startDrag() {
    if (!pending) return;
    const { el, src, index, pointerId, x, y } = pending;
    cancelPending();

    const rect = el.getBoundingClientRect();
    const ghost = el.cloneNode(true);
    ghost.classList.add("drag-ghost");
    ghost.removeAttribute("data-drag-src");
    ghost.style.width = `${rect.width}px`;
    document.body.appendChild(ghost);

    el.classList.add("is-dragging");
    document.body.classList.add("is-card-dragging");
    if (navigator.vibrate) navigator.vibrate(10);

    drag = {
      el, src, index, pointerId, ghost,
      offX: x - rect.left,
      offY: y - rect.top,
      x, y,
      target: null,
      insertAt: -1
    };
    update();
    scrollTimer = setInterval(autoScroll, 16);
  }

  // ---------- 移動 ----------
  function onPointerMove(e) {
    if (pending && e.pointerId === pending.pointerId) {
      pending.x = e.clientX;
      pending.y = e.clientY;
      const dist = Math.hypot(e.clientX - pending.startX, e.clientY - pending.startY);
      if (pending.pointerType === "mouse") {
        if (dist > MOUSE_THRESHOLD) startDrag();
      } else if (dist > TOUCH_SLOP) {
        cancelPending();   // スクロールしようとしている
      }
      return;
    }
    if (drag && e.pointerId === drag.pointerId) {
      e.preventDefault();
      drag.x = e.clientX;
      drag.y = e.clientY;
      update();
    }
  }

  function inside(zone, x, y) {
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  // ゴーストの位置と、落とす場所の表示を更新する
  function update() {
    const { ghost, x, y, offX, offY } = drag;
    ghost.style.left = `${x - offX}px`;
    ghost.style.top = `${y - offY}px`;

    dropZone.classList.remove("is-drop-target");
    paletteZone.classList.remove("is-drop-target");
    indicator.remove();
    drag.target = null;
    drag.insertAt = -1;

    if (inside(dropZone, x, y)) {
      // 証明の中：ドラッグ中のカード以外の並びの中で、何番目に入れるかを決める
      const others = [...dropZone.querySelectorAll('[data-drag-src="answer"]')].filter(c => c !== drag.el);
      let insertAt = others.length;
      for (let i = 0; i < others.length; i++) {
        const r = others[i].getBoundingClientRect();
        if (y < r.top + r.height / 2) { insertAt = i; break; }
      }
      drag.target = "answer";
      drag.insertAt = insertAt;
      dropZone.classList.add("is-drop-target");
      if (insertAt < others.length) dropZone.insertBefore(indicator, others[insertAt]);
      else dropZone.appendChild(indicator);
    } else if (drag.src === "answer" && inside(paletteZone, x, y)) {
      // カード置き場へ戻す
      drag.target = "palette";
      paletteZone.classList.add("is-drop-target");
    }
  }

  function autoScroll() {
    if (!drag) return;
    let dy = 0;
    if (drag.y < EDGE) dy = -Math.ceil((EDGE - drag.y) / 6);
    else if (drag.y > window.innerHeight - EDGE) dy = Math.ceil((drag.y - (window.innerHeight - EDGE)) / 6);
    if (dy !== 0) {
      window.scrollBy(0, dy);
      update();
    }
  }

  // ---------- 終了 ----------
  function finish(dropIt) {
    if (!drag) return;
    const { el, ghost, src, index, target, insertAt } = drag;
    clearInterval(scrollTimer);
    ghost.remove();
    indicator.remove();
    el.classList.remove("is-dragging");
    document.body.classList.remove("is-card-dragging");
    dropZone.classList.remove("is-drop-target");
    paletteZone.classList.remove("is-drop-target");
    drag = null;
    suppressClickUntil = Date.now() + 350;   // ドラッグのあとの「タップ」は無視する
    if (dropIt && target) onDrop({ src, index, target, insertAt });
  }

  function onPointerUp(e) {
    if (pending && e.pointerId === pending.pointerId) cancelPending();   // ただのタップ
    if (drag && e.pointerId === drag.pointerId) finish(true);
  }

  function onPointerCancel(e) {
    if (pending && e.pointerId === pending.pointerId) cancelPending();
    if (drag && e.pointerId === drag.pointerId) finish(false);
  }

  document.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);

  // ドラッグ中は、スマホの画面がスクロールしないようにする
  document.addEventListener("touchmove", e => { if (drag) e.preventDefault(); }, { passive: false });
  // 長押しで出るメニューを止める
  document.addEventListener("contextmenu", e => { if (pending || drag) e.preventDefault(); });
  // ドラッグを終えた直後のクリックで、カードが追加されたりしないようにする
  document.addEventListener("click", e => {
    if (Date.now() < suppressClickUntil) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drag) finish(false); });
}
