/**
 * 不具合・要望の送り先（Google フォーム）
 *
 * ── 設定のしかた ──
 * 1. Google フォームを作り、次の3つの質問を作る（すべて「段落」か「記述式」）
 *      「種類」「内容」「自動で添える情報」
 * 2. フォームの編集画面の「︙」→「事前入力した URL を取得」で、3つの質問に適当な文字を入れて
 *    「リンクを取得」→ 出てきた URL をコピーする
 *      https://docs.google.com/forms/d/e/【formId】/viewform?usp=pp_url&entry.111=...&entry.222=...&entry.333=...
 * 3. 【formId】と、それぞれの質問の entry.数字 を下に書く
 *
 * formId が空のあいだは、送信フォームの「送る」ボタンのかわりに「内容をコピー」だけが使えます。
 */
export const FEEDBACK_FORM = {
  formId: "",
  entries: {
    type: "",      // 「種類」の entry.数字（例: "entry.111111111"）
    body: "",      // 「内容」の entry.数字
    context: ""    // 「自動で添える情報」の entry.数字
  }
};
