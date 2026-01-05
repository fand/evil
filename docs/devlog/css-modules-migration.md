# CSS Modules 移行プラン

## 現状分析
- `static/css/riff.css`: 1880行のモノリシックCSS
- `static/css/main.css`: footer用の最小限CSS
- `index.html`から`<link>`で読み込み
- Reactコンポーネント: 24ファイル

## 移行方針

### Phase 1: 基盤整備 ✅ 完了
1. グローバルスタイルを `src/styles/global.css` に分離
   - リセット (`*`, `html`, `body`)
   - スクロールバー (`::-webkit-scrollbar`)
   - `#top`, `#dialog` (非React部分)
2. `main.tsx` でグローバルCSSをimport

### Phase 2: コンポーネント別CSS Modules作成

| コンポーネント | 状態 | 対応するCSS |
|--------------|------|-----------|
| `App.tsx` | ✅ 完了 | `#wrapper`, `#instruments`, `#mixer` |
| `TransportButtons.tsx` | ✅ 完了 | `#control-*` |
| `NavigationButtons.tsx` | ✅ 完了 | `#btn-left`, `#btn-right`, etc. |
| `SessionGrid.tsx` | ✅ 完了 | `#mixer-tracks`, `#mixer-master` |
| `TracksCanvas.tsx` | ✅ 完了 | `#session-tracks-*` |
| `MasterCanvas.tsx` | ✅ 完了 | `#session-master-*` |
| `MixerPanel.tsx` | ✅ 完了 | `#console-*`, `.console-track` |
| `SongInfo.tsx` | ✅ 完了 | `#song-info` |
| `SynthEditor.tsx` | ✅ 完了 | `.RS_*`, `.synth-*` |
| `SamplerEditor.tsx` | ✅ 完了 | `.Sampler_*`, `.sampler` |
| `SidebarContainer.tsx` | ⏳ 未着手 | `#sidebar-*`, `.sidebar-*` |
| FXViews | ⏳ 未着手 | `.sidebar-module` |

### Phase 3: クリーンアップ ⏳ 未着手
1. `index.html`から`<link>`削除
2. `static/css/riff.css`, `main.css`削除
3. 未使用CSS削除

**注**: 未完了コンポーネントがあるため、旧CSSファイルはまだ必要

## 作成済みファイル
- `src/styles/global.css`
- `src/components/App.module.css`
- `src/components/player/TransportButtons.module.css`
- `src/components/player/NavigationButtons.module.css`
- `src/components/session/SessionGrid.module.css`
- `src/components/session/TracksCanvas.module.css`
- `src/components/session/MasterCanvas.module.css`
- `src/components/session/SongInfo.module.css`
- `src/components/mixer/MixerPanel.module.css`
- `src/components/instruments/Instruments.module.css`

## 注意点
- ID→クラス変換 (`#mixer` → `styles.mixer`)
- camelCase変換 (`synth-core` → `synthCore` or `['synth-core']`)
- 非React部分 (`#top`, `#dialog`) はグローバルに残す

## 移行済みコンポーネントについて

### SynthEditor / SamplerEditor ✅ 完了
**対応内容:**
- CSS変数を使ってSynth/Samplerのカラーバリエーションを管理
  - `.synth { --primary-color: #0df; }`
  - `.sampler { --primary-color: #f3e; }`
- すべてのスタイルで `var(--primary-color)` を使用し、色の重複を削減
- JSXのクラス名をすべてCSS Modulesに置換完了

### Sidebar / FXViews
**着手しなかった理由:**
- SidebarContainer, Sidebar, 各FXView（Compressor, Delay, Reverb等）で同様のスタイルを共有
- `.sidebar-module`, `.sidebar-effects`, `.sidebar-name` など共通クラスが多い
- エフェクトパラメータのUIが統一されているため、共通コンポーネント化を先にした方が効率的

**移行時の注意:**
- FXViewsは構造が似ているので、共通の `FXModule.module.css` を作成すると良い
- `fieldset`, `legend` のスタイリングに注意

### 移行の優先度
1. ~~**低**: SynthEditor/SamplerEditor~~ ✅ 完了
2. **低**: Sidebar/FX - 動作に影響なし、見た目も変わらない
3. **高**: 旧CSSの削除 - 全コンポーネント移行後に実施
