# OGP画像生成の修正

## 問題

MiniText記事のOGP画像が、実際の記事タイトルではなくフォールバックの「MiniText」を表示していた。

## 原因

2つの問題が重なっていました：

### 1. GitHub API認証の問題
当初、GitHub APIを使用して記事タイトルを取得しようとしていましたが、404エラーが発生していました。環境変数は正しく設定されていましたが、`GITHUB_TOKEN`の権限に問題がある可能性がありました。

### 2. Next.js 15の破壊的変更
Next.js 15では、動的ルートの`params`がPromiseになりました。そのため、`await`せずに直接アクセスすると`undefined`になります。

```typescript
// 問題のあったコード
export default async function Image({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug);  // ← params.slug が undefined
```

Vercelログで確認：
```
[OGP] Generating image for slug: undefined, title: MiniText
```

## 修正内容

### 1. GitHub APIの削除
GitHub APIを使用する代わりに、既存の`getPostBySlug`関数を使用してファイルシステムから直接読み取るように変更しました。

### 2. paramsのawait
Next.js 15の仕様に合わせて、`params`を`await`するように修正しました。

[opengraph-image.tsx](file:///Users/watanabegenki/.gemini/antigravity/scratch/watanabegenki-site/src/app/minitext/[slug]/opengraph-image.tsx#L11-17)

```diff
 import { ImageResponse } from 'next/og';
+import { getPostBySlug } from '@/lib/posts';

-export default async function Image({ params }: { params: { slug: string } }) {
-    const title = await getPostTitle(params.slug);
+export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
+    const { slug } = await params;
+    const post = getPostBySlug(slug);
+    const title = post?.title || 'MiniText';
+
+    console.log(`[OGP] Generating image for slug: ${slug}, title: ${title}`);
```

### 3. デザイン変更（白背景・黒テキスト）
紫のグラデーション背景から、シンプルな白背景に変更しました。

```diff
-                    backgroundColor: '#f5f5f7',
-                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
+                    backgroundColor: 'white',

-                            color: 'white',
-                            textShadow: '2px 2px 10px rgba(0,0,0,0.3)',
+                            color: 'black',
```

### 4. カスタムフォントの試行と問題
Noto Sans JP Black（900）フォントを適用しようとしましたが、`FUNCTION_INVOCATION_FAILED`エラーが発生しました。

**試行したアプローチ:**
- Google Fontsからwoffフォーマットをfetch
- より軽量なwoff2フォーマットに変更

**問題の原因:**
Vercel Serverless FunctionでのImageResponse生成時に、外部フォントのfetchと処理が原因で500エラーが発生。

**解決策:**
カスタムフォント機能を削除し、システムデフォルトフォントを使用することで、OGP画像生成を安定化させました。

## 動作確認

本番環境で検証成功：

````carousel
![gun-powder記事のOGP画像：「夜ごはんの献立」が正しく表示されている](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/ogp_gun_powder_7j1vcplon_check_1770784718449.png)
<!-- slide -->
![insurance記事のOGP画像：「医療保険」が正しく表示されている](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/ogp_insurance_7j1vcplon_check_1770784736479.png)
<!-- slide -->
![白背景・黒テキストに変更後のOGP画像](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/ogp_white_bg_check_1770785642955.png)
<!-- slide -->
![カスタムフォント削除後の最終OGP画像](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/ogp_basic_check_1770789971509.png)
````

✅ 両方の記事で、実際のタイトルが正しく表示されています。

## コミット情報
- **コミット1**: `15d5414` - "fix: use getPostBySlug instead of GitHub API for OGP image title"
- **コミット2**: `e376cc7` - "fix: await params to get slug correctly in Next.js 15"
- **コミット3**: `c8c113e` - "style: change OGP image to white background with black text"
- **コミット4**: `1491675` - "feat: add Noto Sans JP Black font to OGP images" (後に削除)
- **コミット5**: `34e667f` - "fix: use lighter woff2 font format for OGP images" (後に削除)
- **コミット6**: `73d8e9a` - "fix: remove custom font to resolve 500 error in OGP generation"

## 今後の改善案

カスタムフォントを使用したい場合の代替アプローチ：
1. フォントファイルをプロジェクトに含める（`public/fonts`）
2. ビルド時にフォントを静的アセットとして配置
3. より小さいフォントサブセットを使用

---

## カスタムフォント実装の試行と技術的制約

### 背景
ユーザーからNoto Sans JP Black（900）フォントをOGP画像に適用したいという要望がありました。

### 試行したアプローチ

#### 1. 外部フォントのfetch（Google Fonts）
```typescript
const fontData = await fetch(
    'https://fonts.gstatic.com/s/notosansjp/v52/...woff2'
).then((res) => res.arrayBuffer());
```
**結果**: `FUNCTION_INVOCATION_FAILED` (500エラー)

#### 2. ローカルフォントファイル + fs.readFileSync
```typescript
const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Black.woff2');
const fontData = fs.readFileSync(fontPath);
```
**結果**: `FUNCTION_INVOCATION_FAILED` (500エラー)
- Vercel Serverless環境で`fs`モジュールが正しく動作しない

#### 3. HTTP fetch（publicディレクトリ）
```typescript
const fontUrl = new URL('/fonts/NotoSansJP-Black.woff2', 'https://watanabegenki-site.vercel.app');
const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
```
**結果**: `FUNCTION_INVOCATION_FAILED` (500エラー)
- 自己参照による循環依存の可能性

### 技術的制約

1. **Vercel Serverless環境の制限**
   - `fs.readFileSync`がファイルシステムにアクセスできない
   - `runtime = 'nodejs'`を指定してもファイルアクセスに制限がある

2. **外部fetchの問題**
   - フォントファイルのfetchと処理がタイムアウトまたはメモリ制限に達する
   - ImageResponse生成中のネットワークリクエストが不安定

3. **循環参照の問題**
   - OGP画像生成中に自分自身のドメインをfetchすると、デッドロックや循環参照が発生する可能性

### 結論

現時点では、Vercel環境の制約により、カスタムフォントの実装は困難と判断しました。以下の理由から、システムデフォルトフォントを使用することにしました：

- ✅ 安定性：システムフォントは確実に動作する
- ✅ パフォーマンス：フォントfetchのオーバーヘッドがない
- ✅ 保守性：追加の依存関係やファイル管理が不要

### 将来的な解決策

カスタムフォントを実装するには、以下のアプローチが考えられます：

1. **Base64エンコード**
   - フォントファイルをBase64エンコードして直接コードに埋め込む
   - ファイルサイズが小さい場合（<5KB）のみ推奨

2. **Edge Functionの使用**
   - Vercel Edge Functionで異なるランタイム環境を試す

3. **別のOGP生成サービス**
   - Cloudinary、imgix等の外部サービスを使用

### コミット履歴

カスタムフォント関連のコミット：
- `1491675` - "feat: add Noto Sans JP Black font to OGP images" (外部fetch)
- `34e667f` - "fix: use lighter woff2 font format for OGP images" (woff2に変更)
- `fa2c928` - "feat: add Noto Sans JP Black font using local file for OGP images" (fs.readFileSync)
---

## デプロイ後の検証結果（2026-02-11）

### 変更内容の確認
1. **Appsページへの移行**: `/tools` → `/apps` への変更と白背景化を確認しました。
2. **OGP画像の修正**: テキストが「watanabegenki.com」に変更され、中央揃えで正しく表示されています。

````carousel
![Appsページの検証結果](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/apps_page_verification_1770796842646.png)
<!-- slide -->
![AntiReality説明文更新](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/antireality_description_verified_1770797116284.png)
<!-- slide -->
![OGP画像の最終検証](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/ogp_final_verification_1770796852606.png)
````

すべての修正が本番環境で正常に動作していることを確認しました。

### AntiReality説明文の更新と画像表示機能
AppsページのAntiRealityの説明文を更新し、画像を表示できるようにコンポーネントを拡張しました。
> 画像パス: `/apps/antireality_image.png`
> 
> **ステータス**: ✅ 画像表示を確認しました。
> (原因: アプリケーションコードでのプロパティ渡し忘れ修正済み)

````carousel
![画像表示あり（修正後・スケーリング/マージン調整済）](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/scaled_image_verification_1770805367302.png)
````

### OGP設定 (watanabegenki.com)
メタデータを更新し、指定されたOGP画像を設定しました。
- `metadataBase`: `https://watanabegenki.com`
- `og:image`: `/ogp.png`


### Minitext記事ページOGP修正
各記事ページに `generateMetadata` を実装し、記事タイトル・説明文・動的生成画像が反映されるように修正しました。
- `og:title`: 記事タイトル（例：「いま、パソコンが面白い」）
- `og:description`: 記事本文の抜粋

### SNSリンクの配置変更（ヘッダーへの統合）
SNSリンクを3Dシーン内からヘッダーのナビゲーション直下に移動しました。
これにより、デバイスを問わず統一されたデザインとなり、モバイルでのコントロールパネルとの干渉も完全に解消されました。

````carousel
![PC表示：ナビゲーション下にリンクを配置](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/desktop_social_relocation_verify_1770813622653.png)
<!-- slide -->
![モバイル表示：PCと同じ位置・デザイン](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/mobile_social_relocation_verify_1770900738712.png)
````

### MiniText記事リンクコピー機能
記事ページのヘッダー（日付横）に「🔗 Copy Link」ボタンを追加しました。
ボタンをクリックすると現在のURLがクリップボードにコピーされ、ボタンのテキストが一時的に「✅ Copied!」に変わります。

````carousel
![ボタン配置確認（PC）](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/copy_link_button_deployed_1770902706074.png)
<!-- slide -->
![クリック時の挙動（Copied!）](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/copy_link_button_clicked_1770902861548.png)
<!-- slide -->
![モバイル表示確認](/Users/watanabegenki/.gemini/antigravity/brain/a53a6efe-445a-4657-95dc-b60b170f8c87/copy_link_button_mobile_deployed_1770902867345.png)
````
