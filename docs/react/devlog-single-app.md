# 単一 App コンポーネントへの統合

## 概要
7つの独立した React root を単一の `<App />` コンポーネントに統合

## 現状
```
mountReactApp() が以下を個別にマウント:
1. SceneParams → #control
2. TransportButtons → footer
3. NavigationButtons → body
4. SessionGrid → #mixer-body
5. InstrumentsContainer → #instruments
6. SaveDialog → body
7. SidebarContainer → #sidebar-wrapper
```

## 手順

### Step 1: App.tsx を更新
- 全コンポーネントを統合したレイアウト作成
- 既存の HTML 構造を React で再現

### Step 2: index.html を簡素化
- `#app` ルートのみ残す
- `#templates` セクション削除
- 静的な構造 (wrapper, mixer, footer等) 削除

### Step 3: main.ts 更新
- `mountReactApp()` → 単一の `createRoot(#app).render(<App />)`

### Step 4: mountReactApp 削除
- `src/react/index.tsx` 削除または簡素化

### Step 5: CSS 調整
- 必要に応じてスタイル修正

## 関連ファイル
- `src/components/App.tsx` (更新)
- `index.html` (大幅簡素化)
- `src/main.ts` (更新)
- `src/react/index.tsx` (削除)
