# EX21 — EX早特21購入支援PWA

React / Viteで構築した非公式の購入支援ツールです。予約・購入確定は公式サイトで手動で行います。

## 機能

- 乗車日・出発駅・到着駅を端末に保存
- 日本時間の21日前23:30を表示
- 購入確認用のカレンダーファイル（締切日22:00・1時間前アラーム）
- 公式予約サイトへのリンク、購入済みの自己申告
- ホーム画面への追加、初回読み込み後のオフライン利用

発売期間・除外日・区間・席数・価格を判定しません。期限内でも購入できるとは限りません。
条件は https://www.smart-ex.jp/product/hayatoku21/ で確認してください。
アプリからのプッシュ通知、自動ログイン、自動予約・自動購入はありません。
保存はブラウザーごとで、端末間の同期や復元はありません。

## 開発

Node.js 22.12以上。`npm ci` → `npm test` → `npm run build`。
開発用は `npm run dev`、ビルド確認は `npm run preview`。

## GitHub Pages

1. Settings → Pages → Source を **GitHub Actions** にする。
2. mainにコミットすると `.github/workflows/deploy.yml` がテスト・ビルド・公開する。
3. Actionsの成功後 https://itukisan-dotcom.github.io/ex21-pwa/ を開く。
4. iPhoneのSafariで共有 → ホーム画面に追加。

Viteのbaseは `/ex21-pwa/`。リポジトリ名変更時は変更してください。
サービスワーカーを変更するときは `public/sw.js` のキャッシュ名も更新してください。
