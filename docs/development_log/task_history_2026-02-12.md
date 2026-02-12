# CMS認証エラー修正タスク

## 認証システムの実装
- [x] `/api/auth/login` エンドポイントの作成
- [x] `admin/page.tsx`のログイン処理を修正
- [x] ローカル環境変数の修正（`ADMIN_PASSWORD`を`genki0513`に変更）
- [x] ローカル環境でのログイン・削除機能のテスト

## Vercelへのデプロイと検証
- [x] Vercelへの変更のデプロイ
- [x] 本番環境でのログインテスト（失敗 - 環境変数の問題を発見）
- [x] Vercel環境変数の修正（`genki0513genki0513` → `genki0513`）
- [x] 手動Redeployの実行（ID: 9PikvPhQh）
- [x] デプロイ完了待機
- [x] 修正後の本番環境でのログインテスト
- [x] 本番環境での投稿作成・削除テスト
- [x] 最終確認

## 自動デプロイの実装（Deploy Hook）
- [x] VercelでDeploy Hookを作成
- [x] Deploy Hook URLを環境変数 `VERCEL_DEPLOY_HOOK_URL` に設定
- [x] `src/lib/github.ts` にHook呼び出し処理を追加
- [x] 変更のプッシュとデプロイ待機
- [x] 動作確認（テスト投稿の保存とデプロイ開始の確認）
 - [x] "via Deploy Hook" によるデプロイを確認

## その他修正
- [x] OGP画像の生成修正（GitHub API廃止、デザイン変更）
- [x] Toolsページの「個人開発したツール」記述削除
- [x] ToolsページをAppsページに移行（名称変更、白背景化）
- [x] AntiRealityの説明文を更新
- [x] AntiRealityセクションに画像を追加するためのコード修正
- [x] 画像パスを `antireality_image.png` に変更
- [x] 画像が見切れないようにCSS調整
- [x] 画像下のボーダーとテキストのマージン調整
- [x] OGP画像の設定 (`watanabegenki.com`)
- [x] Minitext記事ページのOGP修正（タイトル反映）
- [x] トップページにSNSアイコンを追加 (Twitter, Instagram)
- [x] モバイル表示でSNSリンクをナビゲーション等の適切な位置にテキストで配置
- [x] SNSリンクをヘッダー（ナビゲーション区切り線の下）に移動し、全デバイスで統一デザインにする
- [x] MiniText記事ページにリンクコピーボタンを実装する
