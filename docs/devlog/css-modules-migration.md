# CSS Modules 移行プラン

## 現状分析
- `static/css/riff.css`: 1880行のモノリシックCSS
- `static/css/main.css`: footer用の最小限CSS
- `index.html`から`<link>`で読み込み
- Reactコンポーネント: 24ファイル

## 移行方針

### Phase 1: 基盤整備
1. グローバルスタイルを `src/styles/global.css` に分離
   - リセット (`*`, `html`, `body`)
   - スクロールバー (`::-webkit-scrollbar`)
   - `#top`, `#dialog` (非React部分)
2. `main.tsx` でグローバルCSSをimport

### Phase 2: コンポーネント別CSS Modules作成
各コンポーネントに `.module.css` を作成:

| コンポーネント | 対応するCSS |
|--------------|-----------|
| `App.tsx` | `#wrapper`, `#instruments`, `#mixer`, `.btn` |
| `TransportButtons.tsx` | `#control-*` |
| `NavigationButtons.tsx` | `#btn-left`, `#btn-right`, etc. |
| `SessionGrid.tsx` | `#mixer-body`, `#session-*` |
| `SidebarContainer.tsx` | `#sidebar-*`, `.sidebar-*` |
| `SynthEditor.tsx` | `.RS_*`, `.synth-*` |
| `SamplerEditor.tsx` | `.Sampler_*`, `.sampler` |
| FXViews | `.sidebar-module` |

### Phase 3: クリーンアップ
1. `index.html`から`<link>`削除
2. `static/css/riff.css`, `main.css`削除
3. 未使用CSS削除

## 注意点
- ID→クラス変換 (`#mixer` → `styles.mixer`)
- camelCase変換 (`synth-core` → `synthCore` or `['synth-core']`)
- 非React部分 (`#top`, `#dialog`) はグローバルに残す
