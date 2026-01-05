# キーボード入力修正 & フォント変更

## 変更内容

### 1. グローバルフォントをsans-serifに変更
- `src/styles/global.css` の `*` セレクタに `font-family: sans-serif` を追加

### 2. キーボード入力の改善 (`src/Keyboard.ts`)

#### Modifierキー付きイベントの無視
- `Ctrl+数字キー`（ブラウザタブ切り替え等）が誤ってアプリに処理されないように修正
- 対象: `ctrlKey`, `altKey`, `metaKey`

#### Input要素フォーカス時のイベント無視
- `<input>`, `<textarea>`, `<select>` にフォーカスしている時はキーボードイベントを無視
- フォーム入力中に意図しない操作が発生するのを防止
