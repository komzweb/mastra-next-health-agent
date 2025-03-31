# 健康管理エージェント（デモアプリ）

『[Mastra x Next.js x Windsurf で作る自分専用エージェント【10 分で完成】：初心者向け超入門](https://note.com/komzweb/n/na91683b7c7a0)』で紹介した AI エージェントアプリケーションです。Mastra と Next.js を使用して構築されています。

## 機能

- **クイック健康アドバイス**: 簡単な質問に対して、健康に関するアドバイスを提供
- **詳細健康プラン作成**: 食事、運動習慣、目標などの情報を入力して、個別の健康プランを作成
- **栄養成分検索**: 食品名を入力すると、その栄養成分情報を表示

## 使用技術

- **フロントエンド**: Next.js 15.2.4、React 19、TailwindCSS 4
- **AI 機能**: Mastra (@mastra/core)、Vercel AI SDK (@ai-sdk/openai)
- **モデル**: GPT-4o-mini

## プロジェクト構成

```
mastra-next-health-agent/
├── app/                  # Next.js アプリケーション
│   ├── actions.ts        # サーバーアクション
│   ├── components/       # UI コンポーネント
│   └── page.tsx          # メインページ
├── lib/                  # ユーティリティ関数
│   └── nutrition/        # 栄養情報関連機能
├── mastra/               # Mastra 設定
│   ├── agents/           # AI エージェント定義
│   ├── tools/            # カスタムツール
│   └── index.ts          # Mastra 初期化
└── public/               # 静的ファイル
```

## セットアップ手順

### 前提条件

- Node.js 18.0.0 以上
- npm、yarn、pnpm のいずれか

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/komzweb/mastra-next-health-agent.git
cd mastra-next-health-agent
```

2. 依存関係をインストール

```bash
npm install
# または
yarn
# または
pnpm install
```

3. 環境変数の設定
   `.env.development` ファイルを作成し、OpenAI API キーを設定します。

4. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

5. ブラウザで `http://localhost:3000` にアクセス

## 使い方

1. **クイック質問**: 健康に関する質問を入力し、「アドバイスを取得」ボタンをクリック
2. **詳細プラン作成**: 食事内容、運動習慣、健康目標などを入力し、「健康プランを作成」ボタンをクリック
3. **栄養成分検索**: 食品名を入力し、「栄養成分を検索」ボタンをクリック

## 注意事項

- このアプリケーションは医学的なアドバイスを提供するものではありません
- 健康に関する重要な決断は、必ず医療専門家に相談してください
