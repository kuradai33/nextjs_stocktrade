# Stock Simulation

日本株を対象としたトレード戦略のバックテスト・シグナル検出を行う Web アプリケーションです。Next.js 14（App Router）+ TypeScript で構築されています。

## 主な機能

### シミュレーション (`/simulation`)

ヒストリカルな株価データを使って、以下のトレード戦略をバックテストできます。

- **Smashday**: HL-Band と EMA フィルターを利用したデイトレード戦略
- **Insideday**: 短期トレード戦略
- **Swingplay**: EMA クロスオーバーとリスク管理を組み合わせたスイングトレード戦略

各戦略について、トレード明細・損益などの結果一覧、EMA を重ねたチャート表示に加え、パラメータ（EMA期間など）を変化させて成績を比較するヒートマップ表示にも対応しています。

### シグナル検出 (`/signal`)

RSI とボリンジャーバンドを組み合わせたシグナルを全銘柄に対して検出し、買い・売りシグナルを一覧表示します。

## 技術スタック

- [Next.js](https://nextjs.org/) 14 (App Router) / React 18 / TypeScript
- [Prisma](https://www.prisma.io/) + SQLite（株価データの永続化）
- [ECharts](https://echarts.apache.org/)（`echarts-for-react`）によるチャート描画
- TailwindCSS
- xlsx（Excel データのインポート）

## セットアップ

### 前提

- Node.js がインストールされていること
- `prisma/dev.db`（株価データを含む SQLite データベース）がリポジトリに含まれていること

### 手順

1. 依存パッケージをインストール

   ```bash
   npm install
   ```

2. `.env` を作成し、データベース接続先を指定

   ```bash
   DATABASE_URL="file:./dev.db"
   ```

3. 開発サーバーを起動

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) を開くと確認できます。

## その他のコマンド

```bash
npm run build      # プロダクションビルド
npm start           # ビルド済みアプリの起動
npm run lint        # ESLint によるチェック
npx prisma studio   # データベースの内容をブラウザで確認
```

## ディレクトリ構成（主要部分）

```
src/app/
├── simulation/   # バックテスト機能（Smashday / Insideday / Swingplay）
├── signal/       # RSI+ボリンジャーバンドによるシグナル検出
├── api/          # チャート・シグナル・ヒートマップなどの API ルート
└── lib/          # DB アクセス、指標計算（EMA・RSI・HLバンドなど）の共通ロジック
```
