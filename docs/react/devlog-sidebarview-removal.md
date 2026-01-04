# SidebarView.ts 削除計画

## 概要
vanilla JS の `SidebarView.ts` を削除し、React版 `Sidebar.tsx` に完全移行

## 現状
- `SidebarView.ts`: DOM操作でサイドバーUI制御
- `Sidebar.tsx`: React版、既にUI実装済み
- `Sidebar.ts` (モデル) が `SidebarView` に依存

## 手順

### Step 1: Sidebar.ts から SidebarView 依存除去
- `view` プロパティ削除
- `new SidebarView(this)` 削除

### Step 2: show() メソッドを store 経由に変更
- `view.showTracks()` → `store.getState().setCurrentInstrument()`
- `view.showMaster()` → `store.getState().setScene()`

### Step 3: setBPM/setKey/setScale を store 経由に変更
- `view.setBPM()` → `store.getState().setScene({ bpm })`
- 同様に key, scale も

### Step 4: SidebarView.ts 削除

## 関連ファイル
- `src/SidebarView.ts` (削除対象)
- `src/Sidebar.ts` (修正)
- `src/components/sidebar/Sidebar.tsx` (既存React版)
- `src/store.ts` (必要に応じて修正)
