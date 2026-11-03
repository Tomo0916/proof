/**
 * 学習記録とプロファイルの管理（localStorage）
 *
 * - 日付は端末のローカル時刻で判定（日本なら午前0時に「今日」が切り替わる）
 * - 同じ問題は1日1回だけ「今日の問題数」にカウントする
 * - プライベートモード等で localStorage が使えなくてもアプリが止まらないようにする
 */
const STORAGE_PREFIX = "proof_app_";

// localStorage を安全に読み書きするラッパー
const safeStore = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* 保存できない環境では記録を諦める（アプリは動作を継続） */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* 何もしない */
    }
  },
  keys() {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }
};

// 端末のローカル日付を "YYYY-MM-DD" で返す（toISOString は UTC なので使わない）
function localDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function createEmptyData(todayStr) {
  return {
    clearedToday: 0,
    clearedTodayIds: [],
    bestDaily: 0,
    lastDate: todayStr,
    clearedProblems: []
  };
}

export const Storage = {
  getActiveUser() {
    return safeStore.get(`${STORAGE_PREFIX}current_user`) || "guest";
  },

  setActiveUser(userId) {
    safeStore.set(`${STORAGE_PREFIX}current_user`, String(userId).trim() || "guest");
  },

  getSoundEnabled() {
    return safeStore.get(`${STORAGE_PREFIX}sound`) !== "false"; // デフォルトON
  },

  setSoundEnabled(enabled) {
    safeStore.set(`${STORAGE_PREFIX}sound`, enabled ? "true" : "false");
  },

  // 出題範囲（"basic" 定期テスト / "advanced" 発展 / "all" すべて）。最初は定期テスト
  // 最後に読んだお知らせの id（端末ごと）
  getLastSeenNews() {
    return safeStore.get(`${STORAGE_PREFIX}news_seen`) || "";
  },

  setLastSeenNews(id) {
    safeStore.set(`${STORAGE_PREFIX}news_seen`, id);
  },

  getScope() {
    const v = safeStore.get(`${STORAGE_PREFIX}scope`);
    return ["basic", "advanced", "all"].includes(v) ? v : "basic";
  },

  setScope(scope) {
    safeStore.set(`${STORAGE_PREFIX}scope`, scope);
  },

  /**
   * 作業の途中経過（リロードしても続きから再開するため）。名前ごとに保存する
   * { unit, problemId, problems: { [問題id]: { lines, active, results, cleared, answer, palette, solved } } }
   */
  loadWork(userId) {
    const user = userId || this.getActiveUser();
    try {
      const work = JSON.parse(safeStore.get(`${STORAGE_PREFIX}work_${user}`));
      if (work && typeof work === "object") {
        if (!work.problems || typeof work.problems !== "object") work.problems = {};
        return work;
      }
    } catch {
      /* 壊れていたら空から */
    }
    return { problems: {} };
  },

  /** この端末に記録がある人の一覧（管理者ページ用） */
  listUsers() {
    const users = new Set();
    safeStore.keys().forEach(k => {
      const m = k.match(new RegExp(`^${STORAGE_PREFIX}(data|work)_(.+)$`));
      if (m) users.add(m[2]);
    });
    return [...users].sort((a, b) => (a === "guest" ? -1 : b === "guest" ? 1 : a.localeCompare(b, "ja")));
  },

  /** ある人の学習記録と途中経過を消す（管理者ページ用） */
  deleteUser(userId) {
    safeStore.remove(`${STORAGE_PREFIX}data_${userId}`);
    safeStore.remove(`${STORAGE_PREFIX}work_${userId}`);
  },

  saveWork(work, userId) {
    const user = userId || this.getActiveUser();
    safeStore.set(`${STORAGE_PREFIX}work_${user}`, JSON.stringify(work));
  },

  _getKey(userId) {
    const user = userId || this.getActiveUser();
    return `${STORAGE_PREFIX}data_${user}`;
  },

  loadData(userId) {
    const todayStr = localDateStr();
    const raw = safeStore.get(this._getKey(userId));
    if (!raw) return createEmptyData(todayStr);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return createEmptyData(todayStr);
    }

    // 旧バージョンのデータに足りない項目を補う
    data = { ...createEmptyData(todayStr), ...data };
    if (!Array.isArray(data.clearedTodayIds)) data.clearedTodayIds = [];
    if (!Array.isArray(data.clearedProblems)) data.clearedProblems = [];

    // 日付が変わっていたら「今日」の記録をリセット
    if (data.lastDate !== todayStr) {
      data.clearedToday = 0;
      data.clearedTodayIds = [];
      data.lastDate = todayStr;
      this.saveData(data, userId);
    }
    return data;
  },

  saveData(data, userId) {
    safeStore.set(this._getKey(userId), JSON.stringify(data));
  },

  /**
   * 正解を記録する
   * @returns {{ data: object, counted: boolean }} counted=false は「今日すでにカウント済み」
   */
  recordClear(problemId) {
    const data = this.loadData();
    let counted = false;

    if (!data.clearedTodayIds.includes(problemId)) {
      data.clearedTodayIds.push(problemId);
      data.clearedToday += 1;
      data.bestDaily = Math.max(data.bestDaily, data.clearedToday);
      counted = true;
    }
    if (!data.clearedProblems.includes(problemId)) {
      data.clearedProblems.push(problemId);
    }

    this.saveData(data);
    return { data, counted };
  }
};
